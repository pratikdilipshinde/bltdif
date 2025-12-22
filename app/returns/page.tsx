import Image from "next/image";
import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export const metadata = { title: "Returns & Exchanges · BLTDIF" };

export default function ReturnsPage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · RETURNS"
        title="Returns & Exchanges"
        subtitle="We keep it simple: unworn, tagged, and within the return window — we’ll take care of the rest."
        image="/images/returns-hero.jpg"
        primaryCta={{ label: "Contact Support", href: "/contact" }}
        secondaryCta={{ label: "Shop Products", href: "/products" }}
      />

      {/* Policy cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <PolicyCard
            title="Return Window"
            value="7 Days"
            desc="Return requests must be initiated within 7 days of delivery."
          />
          <PolicyCard
            title="Condition"
            value="Unworn + Tagged"
            desc="Items must be unworn, unwashed, and with original tags."
          />
          <PolicyCard
            title="Exchanges"
            value="Size / Variant"
            desc="Exchange available based on stock. If unavailable, refund may apply."
          />
        </div>
      </section>

      {/* Steps */}
      <section className="w-full border-y border-black/10 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs tracking-[0.28em] uppercase text-black/45">
                How it works
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black leading-tight">
                A clean process, <span style={{ color: BRAND_RED }}>no drama.</span>
              </h2>

              <div className="mt-7 space-y-4">
                <Step
                  num="01"
                  title="Request"
                  desc="Contact us with your order number and reason for return/exchange."
                />
                <Step
                  num="02"
                  title="Confirmation"
                  desc="Our team confirms eligibility and shares the next steps."
                />
                <Step
                  num="03"
                  title="Pickup / Ship"
                  desc="Depending on region, we arrange pickup or you ship it back."
                />
                <Step
                  num="04"
                  title="Refund / Exchange"
                  desc="After inspection, we process your exchange or refund."
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                  style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
                >
                  Start a return
                </Link>
                <Link
                  href="/size-guide"
                  className="rounded-xs border border-black/15 bg-white px-6 py-3 text-[12px] font-semibold text-black hover:bg-black/[0.02] transition"
                >
                  Size Guide
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xs border border-black/10 bg-white">
              <div className="relative h-[360px] md:h-[520px]">
                <Image src="/images/photo-5.jpg" alt="Returns" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <Info title="Non-returnable Items" desc="Items marked Final Sale or Limited Drops may not be eligible for returns." />
          <Info title="Refund Method" desc="Refunds are processed to the original payment method after inspection approval." />
          <Info title="Damaged / Wrong Item" desc="If you received the wrong item or damaged item, contact us within 24–48 hours." />
          <Info title="Shipping Fees" desc="Shipping fees are typically non-refundable unless the return is due to our error." />
        </div>
      </section>
    </main>
  );
}

function PolicyCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6 hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition">
      <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">{title}</p>
      <p className="mt-3 text-xl font-semibold text-black">{value}</p>
      <p className="mt-2 text-sm text-black/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <span
          className="rounded-xs px-2 py-1 text-[11px] font-semibold text-white"
          style={{ backgroundColor: BRAND_RED }}
        >
          {num}
        </span>
        <div>
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="mt-1 text-sm text-black/65 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Info({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-black/70">{desc}</p>
    </div>
  );
}
