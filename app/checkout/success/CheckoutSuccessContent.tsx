"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");

  return (
    <section className="bg-white px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-xs border border-black/10 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#CE0028]">
          Payment successful
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-black">
          Thank you for your order
        </h1>

        <p className="mt-4 text-black/65">
          Your payment has been verified successfully.
        </p>

        {order ? (
          <p className="mt-3 text-sm text-black/55">Order ID: {order}</p>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>

          <Link
            href="/cart"
            className="rounded-xs border border-black/10 px-6 py-3 text-sm font-semibold text-black"
          >
            View cart
          </Link>
        </div>
      </div>
    </section>
  );
}