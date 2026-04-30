import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

async function markOrderPaid(
  internalOrderId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string
) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.shopOrder.findUnique({
      where: { id: internalOrderId },
      include: { items: true },
    });

    if (!order || order.paymentStatus === "PAID") {
      return;
    }

    for (const item of order.items) {
      const variant = await tx.catalogProductVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant) continue;

      await tx.catalogProductVariant.update({
        where: { id: item.variantId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
          reservedQuantity: {
            decrement: item.quantity,
          },
        },
      });

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          variantId: item.variantId,
          orderId: order.id,
          movementType: "SOLD",
          quantity: item.quantity,
          previousStock: variant.stockQuantity,
          newStock: variant.stockQuantity - item.quantity,
          reason: "RAZORPAY_WEBHOOK_PAYMENT_CAPTURED",
          note: `Webhook payment captured for order ${order.orderNumber}`,
        },
      });
    }

    await tx.shopOrder.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        paymentId: razorpayPaymentId,
        paymentOrderId: razorpayOrderId,
        paidAt: new Date(),
      },
    });
  });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature." },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured." },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload?.event;

    if (event === "payment.captured") {
      const payment = payload?.payload?.payment?.entity;

      const razorpayPaymentId = payment?.id;
      const razorpayOrderId = payment?.order_id;

      if (razorpayOrderId && razorpayPaymentId) {
        const order = await prisma.shopOrder.findFirst({
          where: {
            paymentOrderId: razorpayOrderId,
          },
        });

        if (order) {
          await markOrderPaid(order.id, razorpayPaymentId, razorpayOrderId);
        }
      }
    }

    if (event === "payment.failed") {
      const payment = payload?.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;

      if (razorpayOrderId) {
        await prisma.shopOrder.updateMany({
          where: {
            paymentOrderId: razorpayOrderId,
            paymentStatus: "PENDING",
          },
          data: {
            paymentStatus: "FAILED",
            orderStatus: "CANCELLED",
            cancelledAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("RAZORPAY_WEBHOOK_ERROR", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}