import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type CartItemInput = {
  variantId: number;
  quantity: number;
};

type CreateOrderBody = {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  customerNote?: string;
  items: CartItemInput[];
};

function generateOrderNumber() {
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `BLTDIF-${yyyymmdd}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderBody;

    if (!body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { error: "Customer name and email are required." },
        { status: 400 }
      );
    }

    if (!body.addressLine1 || !body.city || !body.state || !body.zipCode) {
      return NextResponse.json(
        { error: "Shipping address is incomplete." },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const variantIds = body.items.map((item) => BigInt(item.variantId));

      const variants = await tx.catalogProductVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
          isActive: true,
        },
        include: {
          product: {
            include: {
              category: true,
              images: {
                where: {
                  isPrimary: true,
                },
                take: 1,
              },
            },
          },
          size: true,
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      });

      if (variants.length !== body.items.length) {
        throw new Error("Some cart items are no longer available.");
      }

      let subtotal = 0;

      const preparedItems = body.items.map((cartItem) => {
        const variant = variants.find(
          (v) => v.id === BigInt(cartItem.variantId)
        );

        if (!variant) {
          throw new Error("Invalid product variant.");
        }

        const availableStock =
          variant.stockQuantity - variant.reservedQuantity;

        if (cartItem.quantity <= 0) {
          throw new Error("Invalid quantity selected.");
        }

        if (cartItem.quantity > availableStock) {
          throw new Error(
            `${variant.product.name} has only ${availableStock} item(s) available.`
          );
        }

        const unitPrice = Number(variant.price ?? variant.product.basePrice);
        const totalPrice = unitPrice * cartItem.quantity;

        subtotal += totalPrice;

        const variantImage = variant.images?.[0]?.imageUrl;
        const productImage = variant.product.images?.[0]?.imageUrl;

        return {
          variant,
          quantity: cartItem.quantity,
          unitPrice,
          totalPrice,
          imageUrl: variantImage ?? productImage ?? null,
        };
      });

      const shippingAmount = 0;
      const discountAmount = 0;
      const taxAmount = 0;
      const totalAmount =
        subtotal + shippingAmount + taxAmount - discountAmount;

      const createdOrder = await tx.shopOrder.create({
        data: {
          orderNumber: generateOrderNumber(),

          userId: body.userId ?? null,

          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone ?? null,

          shippingName: body.customerName,
          shippingPhone: body.customerPhone ?? null,

          addressLine1: body.addressLine1,
          addressLine2: body.addressLine2 ?? null,
          city: body.city,
          state: body.state,
          zipCode: body.zipCode,
          country: body.country ?? "USA",

          subtotalAmount: subtotal,
          shippingAmount,
          discountAmount,
          taxAmount,
          totalAmount,

          currencyCode: "USD",

          orderStatus: "PENDING",
          paymentStatus: "PENDING",

          customerNote: body.customerNote ?? null,

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
        const previousStock = item.variant.stockQuantity;
        const newReserved =
          item.variant.reservedQuantity + item.quantity;

        await tx.catalogProductVariant.update({
          where: {
            id: item.variant.id,
          },
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
            orderId: createdOrder.id,

            movementType: "RESERVED",
            quantity: item.quantity,

            previousStock,
            newStock: previousStock,

            reason: "ORDER_PLACED",
            note: `Stock reserved for order ${createdOrder.orderNumber}`,
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create order.",
      },
      { status: 500 }
    );
  }
}