import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { appendOrderToSheet } from "@/app/lib/googleSheets";
import { sendInvoiceEmail } from "@/app/lib/sendInvoiceEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      internalOrderId,
    } = body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !internalOrderId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Payment verification is not configured." },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.$transaction(
      async (tx) => {
      const order = await tx.shopOrder.findUnique({
        where: { id: internalOrderId },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      if (order.paymentStatus === "PAID") {
        return order;
      }

      for (const item of order.items) {
        const variant = await tx.catalogProductVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new Error(`Variant not found for SKU ${item.sku}`);
        }

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
            reason: "PAYMENT_SUCCESS",
            note: `Payment received for order ${order.orderNumber}`,
          },
        });
      }

      return tx.shopOrder.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          paidAt: new Date(),
        },
        include: {
          items: true,
        },
      });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      }
    );

    let sheetSaved = true;

    try {
      const itemsText = updatedOrder.items
        .map(
          (item) =>
            `${item.productName} - ${item.sizeLabel || ""} ${
              item.color || ""
            } x${item.quantity} (₹${item.unitPrice})`
        )
        .join(" | ");

      await appendOrderToSheet([
        updatedOrder.id,
        updatedOrder.orderNumber,
        razorpay_payment_id,
        new Date().toISOString(),
        updatedOrder.customerName,
        updatedOrder.customerEmail,
        updatedOrder.customerPhone || "",
        updatedOrder.addressLine1,
        updatedOrder.addressLine2 || "",
        updatedOrder.city,
        updatedOrder.state,
        updatedOrder.zipCode,
        updatedOrder.country,
        itemsText,
        Number(updatedOrder.totalAmount),
        updatedOrder.currencyCode,
        "paid",
      ]);
    } catch (sheetError) {
      sheetSaved = false;
      console.error("Google Sheet append failed.", sheetError);
    }

    let invoiceSent = true;

    try {
      await sendInvoiceEmail(updatedOrder);
    } catch (invoiceError) {
      invoiceSent = false;
      console.error("Invoice email failed.", invoiceError);
    }

    return NextResponse.json({
      success: true,
      message: invoiceSent
        ? "Payment verified, order placed, and invoice sent successfully."
        : "Payment verified and order placed successfully, but invoice email failed.",
      paymentVerified: true,
      invoiceSent,
      orderLoggedToSheet: sheetSaved,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("VERIFY_PAYMENT_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Server error while verifying payment.",
      },
      { status: 500 }
    );
  }
}