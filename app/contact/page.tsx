"use client";

import { useState } from "react";
import Image from "next/image";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · SUPPORT"
        title="Contact us"
        subtitle="Sizing help, product questions, or order support — message us anytime."
        image="/images/contact-hero.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          {/* Left visual */}
          <div className="rounded-xs border border-black/10 overflow-hidden bg-black/[0.02]">
            <div className="relative h-[360px] md:h-[540px]">
              <Image src="/images/photo-5.jpg" alt="Support" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-6">
              <p className="text-xs tracking-[0.28em] uppercase text-black/45">Support</p>
              <h2 className="mt-2 text-xl font-semibold text-black">We reply fast.</h2>
              <p className="mt-2 text-sm text-black/60 leading-relaxed">
                Typical response time: 24–48 hours. Include your order number if available.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Sizing", "Order Status", "Returns", "Product Details"].map((t) => (
                  <span key={t} className="rounded-xs border border-black/10 bg-white px-3 py-1 text-[12px] text-black/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-xs border border-black/10 bg-white p-6 md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
            <p className="text-xs tracking-[0.28em] uppercase text-black/45">Send a message</p>
            <h2 className="mt-3 text-2xl font-semibold text-black">How can we help?</h2>

            {sent ? (
              <div className="mt-5 rounded-sm border border-black/10 bg-black/[0.02] p-4">
                <p className="text-sm text-black/70">
                  ✅ Message submitted (UI only). Connect this to your email/API when ready.
                </p>
              </div>
            ) : null}

            <form
              className="mt-6 grid grid-cols-1 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Field label="Full name" placeholder="Full Name" />
              <Field label="Email" type="email" placeholder="you@domain.com" />
              <Field label="Subject" placeholder="Order / Size / Product question" />
              <TextArea label="Message" placeholder="Write your message..." />

              <button
                type="submit"
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
              >
                Send Message
              </button>

              <p className="text-[12px] text-black/55 leading-relaxed">
                By sending, you agree to be contacted regarding your request.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold text-black/85">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="
          w-full rounded-xs border border-black/10 bg-black/[0.03]
          px-4 py-2.5 text-[13px] text-black placeholder:text-black/35
          outline-none transition focus:border-[#CE0028]/45 focus:bg-black/[0.045]
        "
      />
    </div>
  );
}

function TextArea({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold text-black/85">{label}</label>
      <textarea
        placeholder={placeholder}
        className="
          min-h-[140px] w-full rounded-xs border border-black/10 bg-black/[0.03]
          px-4 py-3 text-[13px] text-black placeholder:text-black/35
          outline-none transition focus:border-[#CE0028]/45 focus:bg-black/[0.045]
        "
      />
    </div>
  );
}
