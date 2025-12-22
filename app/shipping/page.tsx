import Image from "next/image";
import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export const metadata = { title: "Shipping & Delivery · BLTDIF" };

export default function ShippingPage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · SHIPPING"
        title="Shipping & Delivery"
        subtitle="Fast dispatch, reliable delivery, and clear timelines — so you always know what to expect."
        image="/images/shipping-hero.jpg"
        primaryCta={{ label: "Shop Drop 01", href: "/products" }}
        secondaryCta={{ label: "Contact Support", href: "/contact" }}
      />

      {/* Overview strip */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Processing Time"
            value="1–2 Business Days"
            desc="Orders are prepared and dispatched quickly (excluding holidays)."
          />
          <StatCard
            title="Delivery Time"
            value="3–7 Business Days"
            desc="Varies by location and courier service availability."
          />
          <StatCard
            title="Order Updates"
            value="Tracking Provided"
            desc="You’ll receive tracking once the order is shipped."
          />
        </div>
      </section>

      {/* Split section */}
      <section className="w-full border-y border-black/10 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="relative overflow-hidden rounded-sm border border-black/10 bg-white">
              <div className="relative h-[360px] md:h-[520px]">
                <Image src="/images/photo-1.jpg" alt="Shipping" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.28em] uppercase text-black/45">
                Delivery details
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black leading-tight">
                Built different — <span style={{ color: BRAND_RED }}>delivered clean.</span>
              </h2>

              <ul className="mt-6 space-y-4 text-sm md:text-[15px] leading-relaxed text-black/70">
                <li className="flex gap-3">
                  <Dot />
                  Orders are dispatched after payment confirmation.
                </li>
                <li className="flex gap-3">
                  <Dot />
                  Delivery timelines may vary due to region/courier delays.
                </li>
                <li className="flex gap-3">
                  <Dot />
                  Ensure address + phone details are accurate for smooth delivery.
                </li>
                <li className="flex gap-3">
                  <Dot />
                  If your package is delayed, contact support with your order number.
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-sm px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                  style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
                >
                  Ask about my order
                </Link>
                <Link
                  href="/faq"
                  className="rounded-sm border border-black/15 bg-white px-6 py-3 text-[12px] font-semibold text-black hover:bg-black/[0.02] transition"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            title="Shipping Charges"
            desc="Shipping fees may vary by region and order size. Charges (if any) are shown at checkout."
          />
          <InfoCard
            title="Missed Delivery"
            desc="If delivery fails due to incorrect address or unavailable receiver, courier may attempt re-delivery or return the package."
          />
          <InfoCard
            title="Damaged Package"
            desc="If your package arrives damaged, contact support within 24–48 hours with photos for assistance."
          />
          <InfoCard
            title="International Shipping"
            desc="If you plan international delivery, contact us. Rates and timelines vary by destination."
          />
        </div>
      </section>
    </main>
  );
}

function Dot() {
  return <span className="mt-2 h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />;
}

function StatCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-6 hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition">
      <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">{title}</p>
      <p className="mt-3 text-xl font-semibold text-black">{value}</p>
      <p className="mt-2 text-sm text-black/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-black/70">{desc}</p>
    </div>
  );
}
