import crypto from "crypto";
import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/app/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      internalOrderId,
      customer,
      items,
      amount,
      currency,
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
        { success: false, error: "Razorpay secret is not configured." },
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

    const itemsText = Array.isArray(items)
      ? items
          .map(
            (item: any) =>
              `${item.name} x${item.quantity} (₹${item.price})`
          )
          .join(" | ")
      : "";

    await appendOrderToSheet([
      internalOrderId,
      razorpay_payment_id,
      new Date().toISOString(),
      customer?.fullName || "",
      customer?.email || "",
      customer?.phone || "",
      customer?.addressLine1 || "",
      customer?.addressLine2 || "",
      customer?.city || "",
      customer?.state || "",
      customer?.postalCode || "",
      customer?.country || "",
      itemsText,
      amount ? amount / 100 : "",
      currency || "INR",
      "paid",
    ]);

    return NextResponse.json({
      success: true,
      message: "Payment verified and order saved to Google Sheet.",
    });
  } catch (error) {
    console.error("VERIFY_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Server error while verifying payment." },
      { status: 500 }
    );
  }
}