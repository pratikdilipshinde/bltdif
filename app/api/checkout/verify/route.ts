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
      console.error("RAZORPAY_KEY_SECRET is missing.");
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
      console.error("Invalid Razorpay signature.", {
        internalOrderId,
        razorpay_order_id,
        razorpay_payment_id,
      });

      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const itemsText = Array.isArray(items)
      ? items
          .map(
            (item: any) =>
              `${item?.name || "Item"} x${item?.quantity || 1} (₹${item?.price || 0})`
          )
          .join(" | ")
      : "";

    const sheetRow = [
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
    ];

    let sheetSaved = true;

    try {
      await appendOrderToSheet(sheetRow);
      console.log("Google Sheet updated successfully.", {
        internalOrderId,
        razorpay_payment_id,
      });
    } catch (sheetError: any) {
      sheetSaved = false;
      console.error("Google Sheet append failed.", {
        internalOrderId,
        razorpay_payment_id,
        error: sheetError?.response?.data || sheetError?.message || sheetError,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: sheetSaved
          ? "Payment verified and order saved successfully."
          : "Payment verified successfully.",
        paymentVerified: true,
        orderLoggedToSheet: sheetSaved,
        orderId: internalOrderId,
        paymentId: razorpay_payment_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("VERIFY_ERROR", error?.message || error);

    return NextResponse.json(
      { success: false, error: "Server error while verifying payment." },
      { status: 500 }
    );
  }
}