import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Success | BLTDIF",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-white px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-xs border border-black/10 p-8 text-center">
            <p className="text-sm text-black/60">Loading...</p>
          </div>
        </section>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}