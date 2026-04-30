import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type CartItem = {
  variantId: number;
  quantity: number;
};

type Customer = {
  userId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

function generateOrderNumber() {
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `BLTDIF-${yyyymmdd}-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const items: CartItem[] = body.items || [];
    const customer: Customer = body.customer;

    if (!items.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (
      !customer?.fullName ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.addressLine1 ||
      !customer?.city ||
      !customer?.state ||
      !customer?.postalCode ||
      !customer?.country
    ) {
      return NextResponse.json(
        { error: "Missing customer details." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const variantIds = items.map((item) => BigInt(item.variantId));

      const variants = await tx.catalogProductVariant.findMany({
        where: {
          id: { in: variantIds },
          isActive: true,
        },
        include: {
          product: {
            include: {
              category: true,
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
              },
            },
          },
          size: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
            take: 1,
          },
        },
      });

      if (variants.length !== items.length) {
        throw new Error("Some cart items are no longer available.");
      }

      let subtotal = 0;

      const preparedItems = items.map((cartItem) => {
        const variant = variants.find(
          (v) => v.id === BigInt(cartItem.variantId)
        );

        if (!variant) {
          throw new Error("Invalid product variant.");
        }

        const availableStock =
          variant.stockQuantity - variant.reservedQuantity;

        if (cartItem.quantity <= 0) {
          throw new Error("Invalid item quantity.");
        }

        if (cartItem.quantity > availableStock) {
          throw new Error(
            `${variant.product.name} has only ${availableStock} item(s) available.`
          );
        }

        const unitPrice = Number(variant.price ?? variant.product.basePrice);
        const totalPrice = unitPrice * cartItem.quantity;

        subtotal += totalPrice;

        return {
          variant,
          quantity: cartItem.quantity,
          unitPrice,
          totalPrice,
          imageUrl:
            variant.images?.[0]?.imageUrl ||
            variant.product.images?.[0]?.imageUrl ||
            null,
        };
      });

      const shippingAmount = 0;
      const discountAmount = 0;
      const taxAmount = 0;
      const totalAmount =
        subtotal + shippingAmount + taxAmount - discountAmount;


      const profile = await tx.profile.findUnique({
        where: {
          email: customer.email,
        },
      });

      const internalOrder = await tx.shopOrder.create({
        data: {
          orderNumber: generateOrderNumber(),

          userId: profile?.id ?? null,

          customerName: customer.fullName,
          customerEmail: customer.email,
          customerPhone: customer.phone,

          shippingName: customer.fullName,
          shippingPhone: customer.phone,

          addressLine1: customer.addressLine1,
          addressLine2: customer.addressLine2 || null,
          city: customer.city,
          state: customer.state,
          zipCode: customer.postalCode,
          country: customer.country,

          subtotalAmount: subtotal,
          shippingAmount,
          discountAmount,
          taxAmount,
          totalAmount,

          currencyCode: "INR",

          orderStatus: "PENDING",
          paymentStatus: "PENDING",

          paymentProvider: "RAZORPAY",

          items: {
            create: preparedItems.map((item) => ({
              productId: item.variant.productId,
              variantId: item.variant.id,

              productCode: item.variant.product.productCode,
              sku: item.variant.sku,
              productName: item.variant.product.name,
              categoryCode: item.variant.product.category?.code ?? null,

              sizeCode: item.variant.size?.code ?? null,
              sizeLabel: item.variant.size?.label ?? null,
              color: item.variant.color ?? null,
              imageUrl: item.imageUrl,

              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of preparedItems) {
        await tx.catalogProductVariant.update({
          where: { id: item.variant.id },
          data: {
            reservedQuantity: {
              increment: item.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.variant.productId,
            variantId: item.variant.id,
            orderId: internalOrder.id,
            movementType: "RESERVED",
            quantity: item.quantity,
            previousStock: item.variant.stockQuantity,
            newStock: item.variant.stockQuantity,
            reason: "ORDER_CREATED",
            note: `Reserved for order ${internalOrder.orderNumber}`,
          },
        });
      }

      return {
        internalOrder,
        amountInPaise: Math.round(totalAmount * 100),
      };
    });

    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: result.amountInPaise,
        currency: "INR",
        receipt: result.internalOrder.id,
        notes: {
          internal_order_id: result.internalOrder.id,
          order_number: result.internalOrder.orderNumber,
          customer_name: customer.fullName,
          customer_email: customer.email,
          customer_phone: customer.phone,
        },
      }),
      cache: "no-store",
    });

    const razorpayData = await razorpayRes.json();

    if (!razorpayRes.ok) {
      throw new Error(
        razorpayData?.error?.description || "Unable to create Razorpay order."
      );
    }

    await prisma.shopOrder.update({
      where: { id: result.internalOrder.id },
      data: {
        paymentOrderId: razorpayData.id,
      },
    });

    return NextResponse.json({
      success: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayData.id,
      internalOrderId: result.internalOrder.id,
      orderNumber: result.internalOrder.orderNumber,
      amount: result.amountInPaise,
      currency: "INR",
    });
  } catch (error) {
    console.error("CREATE_CHECKOUT_ORDER_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Server error while creating order.",
      },
      { status: 500 }
    );
  }
}