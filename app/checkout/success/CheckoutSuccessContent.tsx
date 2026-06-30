"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PageHero from "@/app/components/marketing/PageHero";
import PurchasePixel from "@/app/components/PurchasePixel";

export default function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const order = searchParams.get("order");
  const amount = Number(searchParams.get("amount") || 0);

  return (
    <main className="bg-white">
      {order && (
        <PurchasePixel
          orderId={order}
          totalAmount={amount}
          currency="INR"
        />
      )}

      <PageHero
        kicker="BLTDIF · CHECKOUT"
        title="ORDER PLACED"
        subtitle="Your payment has been verified successfully. Your invoice and order details have been sent to your email address."
        image=""
        primaryCta={{ label: "Shop Drop 01", href: "/products" }}
        secondaryCta={{ label: "Contact Support", href: "/contact" }}
      />

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
            BLTDIF · CHECKOUT
          </p>
        </div>

        <div className="rounded-xs border border-black/10 bg-[#fafafa] p-6 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#CE0028]/20 bg-[#CE0028]/10">
              <span className="text-3xl font-semibold text-[#CE0028]">✓</span>
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#CE0028]">
              Payment Successful
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-tight text-black md:text-4xl">
              Your order is successfully placed
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/60 md:text-[15px]">
              Your payment has been verified successfully. We have sent the
              invoice and order confirmation to your email address.
            </p>

            {order && (
              <div className="mx-auto mt-6 max-w-md rounded-xs border border-black/10 bg-white px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
                  Order Number
                </p>
                <p className="mt-2 text-base font-semibold text-black">
                  {order}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-8 cursor-pointer rounded-xs bg-black px-10 py-3 text-sm font-semibold text-white transition hover:bg-[#CE0028]"
            >
              OK
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}