
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// =====================================================
// TYPES
// =====================================================

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

type ProductType = "tshirt" | "hoodie" | "cap" | "other";

type BundleItem = {
  productType: ProductType;
  unitPrice: number;
  quantity: number;
};

const GST_RATE = 0.05;

const COMPLETE_LOOK_DISCOUNT_RATE = 0.15;
const PICK_ANY2_DISCOUNT_RATE = 0.10;

// =====================================================
// MONEY HELPERS
// =====================================================

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// =====================================================
// ORDER NUMBER
// =====================================================

function generateOrderNumber() {
  const date = new Date();

  const yyyymmdd = date
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `BLTDIF-${yyyymmdd}-${random}`;
}

// =====================================================
// PRODUCT CLASSIFICATION
// =====================================================

function getProductType(item: {
  name: string;
  productCode?: string | null;
  sku?: string | null;
  categoryCode?: string | null;
}): ProductType {
  const category = (item.categoryCode ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const categoryMap: Record<string, ProductType> = {
    tshirt: "tshirt",
    tshirts: "tshirt",
    tee: "tshirt",
    tees: "tshirt",

    hoodie: "hoodie",
    hoodies: "hoodie",

    cap: "cap",
    caps: "cap",
  };

  if (categoryMap[category]) {
    return categoryMap[category];
  }

  const text = [
    item.name,
    item.productCode ?? "",
    item.sku ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (/\bhoodies?\b/i.test(text)) {
    return "hoodie";
  }

  if (/\b(t[\s-]?shirts?|tees?)\b/i.test(text)) {
    return "tshirt";
  }

  if (/\bcaps?\b/i.test(text)) {
    return "cap";
  }

  return "other";
}

// =====================================================
// COMBINATION OFFERS
// MUTUALLY EXCLUSIVE
// =====================================================

function calculateCombinationOffers(items: BundleItem[]) {
  type Unit = {
    price: number;
  };

  const tshirtUnits: Unit[] = [];
  const hoodieUnits: Unit[] = [];
  const capUnits: Unit[] = [];

  // ---------------------------------------------------
  // EXPAND QUANTITIES INTO INDIVIDUAL UNITS
  // ---------------------------------------------------

  for (const item of items) {
    const quantity = Math.max(
      0,
      Math.floor(Number(item.quantity) || 0)
    );

    const unitPrice = Math.max(
      0,
      Number(item.unitPrice) || 0
    );

    if (quantity === 0 || !Number.isFinite(unitPrice)) {
      continue;
    }

    const unit = { price: unitPrice };

    for (let i = 0; i < quantity; i++) {
      if (item.productType === "tshirt") {
        tshirtUnits.push({ ...unit });
      } else if (item.productType === "hoodie") {
        hoodieUnits.push({ ...unit });
      } else if (item.productType === "cap") {
        capUnits.push({ ...unit });
      }
    }
  }

  // ---------------------------------------------------
  // SORT EACH CATEGORY BY HIGHEST PRICE
  // ---------------------------------------------------

  tshirtUnits.sort((a, b) => b.price - a.price);
  hoodieUnits.sort((a, b) => b.price - a.price);
  capUnits.sort((a, b) => b.price - a.price);

  // ===================================================
  // OFFER 1: COMPLETE LOOK
  // 1 T-SHIRT + 1 HOODIE + 1 CAP = 15% OFF
  // ===================================================

  const completeLookCount = Math.min(
    tshirtUnits.length,
    hoodieUnits.length,
    capUnits.length
  );

  let completeLookSubtotal = 0;

  for (let i = 0; i < completeLookCount; i++) {
    completeLookSubtotal += tshirtUnits[i].price;
    completeLookSubtotal += hoodieUnits[i].price;
    completeLookSubtotal += capUnits[i].price;
  }

  completeLookSubtotal = roundMoney(completeLookSubtotal);

  const completeLookDiscount = roundMoney(
    completeLookSubtotal * COMPLETE_LOOK_DISCOUNT_RATE
  );

  // ===================================================
  // OFFER 2: PICK ANY 2
  // ONLY APPLIES IF NO COMPLETE LOOK EXISTS
  // ===================================================

  let pickAny2Count = 0;
  let pickAny2Subtotal = 0;
  let pickAny2Discount = 0;

  if (completeLookCount === 0) {
    const eligibleUnits = [
      ...tshirtUnits,
      ...hoodieUnits,
      ...capUnits,
    ];

    eligibleUnits.sort((a, b) => b.price - a.price);

    pickAny2Count = Math.floor(eligibleUnits.length / 2);

    const matchedUnits = pickAny2Count * 2;

    for (let i = 0; i < matchedUnits; i++) {
      pickAny2Subtotal += eligibleUnits[i].price;
    }

    pickAny2Subtotal = roundMoney(pickAny2Subtotal);

    pickAny2Discount = roundMoney(
      pickAny2Subtotal * PICK_ANY2_DISCOUNT_RATE
    );
  }

  // ===================================================
  // TOTAL DISCOUNT
  // COMPLETE LOOK ALWAYS TAKES PRIORITY
  // ===================================================

  const totalDiscount = roundMoney(
    completeLookCount > 0
      ? completeLookDiscount
      : pickAny2Discount
  );

  return {
    completeLookCount,
    completeLookSubtotal,
    completeLookDiscount,

    pickAny2Count,
    pickAny2Subtotal,
    pickAny2Discount,

    totalDiscount,

    totalMatchedItems:
      completeLookCount > 0
        ? completeLookCount * 3
        : pickAny2Count * 2,

    appliedOffer:
      completeLookCount > 0
        ? "COMPLETE_LOOK_15"
        : pickAny2Count > 0
          ? "PICK_ANY_2_10"
          : "NONE",
  };
}

// =====================================================
// CREATE CHECKOUT ORDER
// =====================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const items: CartItem[] = body.items || [];
    const customer: Customer = body.customer;

    // -------------------------------------------------
    // VALIDATE REQUEST
    // -------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty.",
        },
        { status: 400 }
      );
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
        {
          success: false,
          error: "Missing customer details.",
        },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        !Number.isSafeInteger(item.variantId) ||
        item.variantId <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid product or quantity.",
          },
          { status: 400 }
        );
      }
    }

    const variantIdSet = new Set(
      items.map((item) => item.variantId)
    );

    if (variantIdSet.size !== items.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate product variants in cart.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // DATABASE ORDER TRANSACTION
    // =================================================

    const result = await prisma.$transaction(
      async (tx) => {
        const variantIds = items.map((item) =>
          BigInt(item.variantId)
        );

        const variants =
          await tx.catalogProductVariant.findMany({
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
                    orderBy: [
                      { isPrimary: "desc" },
                      { sortOrder: "asc" },
                    ],
                    take: 1,
                  },
                },
              },
              size: true,
              images: {
                orderBy: [
                  { isPrimary: "desc" },
                  { sortOrder: "asc" },
                ],
                take: 1,
              },
            },
          });

        if (variants.length !== items.length) {
          throw new Error(
            "Some cart items are no longer available."
          );
        }

        // ---------------------------------------------
        // VALIDATE STOCK AND PREPARE ITEMS
        // ---------------------------------------------

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

          if (cartItem.quantity > availableStock) {
            throw new Error(
              `${variant.product.name} has only ${availableStock} item(s) available.`
            );
          }

          const unitPrice = Number(
            variant.price ?? variant.product.basePrice
          );

          if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
          ) {
            throw new Error(
              `Invalid price for ${variant.product.name}.`
            );
          }

          const totalPrice = roundMoney(
            unitPrice * cartItem.quantity
          );

          subtotal += totalPrice;

          const categoryCode =
            variant.product.category?.code ?? null;

          const productType = getProductType({
            name: variant.product.name,
            productCode: variant.product.productCode,
            sku: variant.sku,
            categoryCode,
          });

          return {
            variant,
            quantity: cartItem.quantity,
            unitPrice,
            totalPrice,
            productType,
            imageUrl:
              variant.images?.[0]?.imageUrl ||
              variant.product.images?.[0]?.imageUrl ||
              null,
          };
        });

        subtotal = roundMoney(subtotal);

        // ---------------------------------------------
        // APPLY ONLY ONE OFFER
        // ---------------------------------------------

        const offerResult = calculateCombinationOffers(
          preparedItems.map((item) => ({
            productType: item.productType,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          }))
        );

        const discountAmount = offerResult.totalDiscount;

        // ---------------------------------------------
        // DISCOUNTED SUBTOTAL
        // ---------------------------------------------

        const discountedSubtotal = roundMoney(
          Math.max(0, subtotal - discountAmount)
        );

        // ---------------------------------------------
        // GST AND FINAL TOTAL
        // ---------------------------------------------

        const shippingAmount = 0;

        const taxAmount = roundMoney(
          discountedSubtotal * GST_RATE
        );

        const totalAmount = roundMoney(
          discountedSubtotal +
            shippingAmount +
            taxAmount
        );

        const amountInPaise = Math.round(
          totalAmount * 100
        );

        // ---------------------------------------------
        // CUSTOMER PROFILE
        // ---------------------------------------------

        const profile =
          await tx.profile.findUnique({
            where: {
              email: customer.email,
            },
          });

        // ---------------------------------------------
        // CREATE INTERNAL ORDER
        // ---------------------------------------------

        const internalOrder =
          await tx.shopOrder.create({
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

                  productCode:
                    item.variant.product.productCode,

                  sku: item.variant.sku,

                  productName:
                    item.variant.product.name,

                  categoryCode:
                    item.variant.product.category?.code ?? null,

                  sizeCode:
                    item.variant.size?.code ?? null,

                  sizeLabel:
                    item.variant.size?.label ?? null,

                  color:
                    item.variant.color ?? null,

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

        // ---------------------------------------------
        // RESERVE STOCK
        // ---------------------------------------------

        for (const item of preparedItems) {
          const stockUpdate =
            await tx.catalogProductVariant.updateMany({
              where: {
                id: item.variant.id,
                isActive: true,
                stockQuantity: {
                  gte:
                    item.variant.reservedQuantity +
                    item.quantity,
                },
              },
              data: {
                reservedQuantity: {
                  increment: item.quantity,
                },
              },
            });

          if (stockUpdate.count !== 1) {
            throw new Error(
              `${item.variant.product.name} is no longer available in the requested quantity. Please refresh your cart.`
            );
          }

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

          subtotal,
          discountedSubtotal,
          shippingAmount,

          discountAmount,

          completeLookCount:
            offerResult.completeLookCount,

          completeLookSubtotal:
            offerResult.completeLookSubtotal,

          completeLookDiscount:
            offerResult.completeLookDiscount,

          pickAny2Count:
            offerResult.pickAny2Count,

          pickAny2Subtotal:
            offerResult.pickAny2Subtotal,

          pickAny2Discount:
            offerResult.pickAny2Discount,

          appliedOffer: offerResult.appliedOffer,

          taxAmount,
          totalAmount,

          amountInPaise,
        };
      }
    );

    // =================================================
    // CREATE RAZORPAY ORDER
    // =================================================

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error(
        "Payment gateway configuration is missing."
      );
    }

    const auth = Buffer.from(
      `${razorpayKeyId}:${razorpayKeySecret}`
    ).toString("base64");

    const razorpayRes = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
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

            subtotal: result.subtotal.toFixed(2),

            applied_offer: result.appliedOffer,

            complete_look_count: String(
              result.completeLookCount
            ),

            complete_look_subtotal:
              result.completeLookSubtotal.toFixed(2),

            complete_look_discount:
              result.completeLookDiscount.toFixed(2),

            pick_any2_count: String(
              result.pickAny2Count
            ),

            pick_any2_subtotal:
              result.pickAny2Subtotal.toFixed(2),

            pick_any2_discount:
              result.pickAny2Discount.toFixed(2),

            total_discount:
              result.discountAmount.toFixed(2),

            gst_rate: "5%",

            gst_amount: result.taxAmount.toFixed(2),

            total_amount: result.totalAmount.toFixed(2),
          },
        }),

        cache: "no-store",
      }
    );

    const razorpayData = await razorpayRes.json();

    if (!razorpayRes.ok) {
      throw new Error(
        razorpayData?.error?.description ||
          "Unable to create Razorpay order."
      );
    }

    // -----------------------------------------------
    // SAVE RAZORPAY ORDER ID
    // -----------------------------------------------

    await prisma.shopOrder.update({
      where: {
        id: result.internalOrder.id,
      },

      data: {
        paymentOrderId: razorpayData.id,
      },
    });

    // -----------------------------------------------
    // RETURN CHECKOUT TOTALS
    // -----------------------------------------------

    return NextResponse.json({
      success: true,

      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      razorpayOrderId: razorpayData.id,

      internalOrderId: result.internalOrder.id,

      orderNumber: result.internalOrder.orderNumber,

      subtotal: result.subtotal,

      discountedSubtotal: result.discountedSubtotal,

      completeLookCount: result.completeLookCount,
      completeLookSubtotal: result.completeLookSubtotal,
      completeLookDiscount: result.completeLookDiscount,

      pickAny2Count: result.pickAny2Count,
      pickAny2Subtotal: result.pickAny2Subtotal,
      pickAny2Discount: result.pickAny2Discount,

      appliedOffer: result.appliedOffer,

      discountAmount: result.discountAmount,

      gstRate: 5,
      gstAmount: result.taxAmount,

      shippingAmount: result.shippingAmount,

      totalAmount: result.totalAmount,

      amount: result.amountInPaise,

      currency: "INR",
    });
  } catch (error) {
    console.error(
      "CREATE_CHECKOUT_ORDER_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Server error while creating order.",
      },
      {
        status: 500,
      }
    );
  }
}
