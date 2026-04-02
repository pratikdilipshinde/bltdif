import { NextResponse } from "next/server";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Customer = {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CartItem[] = body.items || [];
    const customer: Customer = body.customer;

    if (!items.length) {
      return NextResponse.json(
        { error: "Cart is empty." },
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
        { error: "Missing customer details." },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid order total." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(total * 100);
    const internalOrderId = crypto.randomUUID();

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
        amount: amountInPaise,
        currency: "INR",
        receipt: internalOrderId,
        notes: {
          customer_name: customer.fullName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          shipping_city: customer.city,
          shipping_state: customer.state,
          shipping_country: customer.country,
        },
      }),
      cache: "no-store",
    });

    const razorpayData = await razorpayRes.json();

    if (!razorpayRes.ok) {
      return NextResponse.json(
        {
          error:
            razorpayData?.error?.description || "Unable to create Razorpay order.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderId: razorpayData.id,
      internalOrderId,
      amount: amountInPaise,
      currency: "INR",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error while creating order." },
      { status: 500 }
    );
  }
}