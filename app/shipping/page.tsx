import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  PackageCheck,
  Truck,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import PageHero from "../components/marketing/PageHero";
import AnnouncementBar from "../components/AnnouncementBar";

const BRAND_RED = "#CE0028";

export const metadata = { title: "Shipping & Delivery · BLTDIF" };

const glassPanel =
  "border border-white/80 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_14px_45px_rgba(0,0,0,0.045)] backdrop-blur-2xl";

export default function ShippingPage() {
  return (
    <>
    <AnnouncementBar />
    <main className="relative isolate overflow-hidden bg-[#f4f3f2] text-black pt-10 md:pt-15">
      {/* Ambient glass background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-40 top-[350px] h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{ background: "rgba(206,0,40,0.075)" }}
        />

        <div className="absolute -right-40 top-[950px] h-[480px] w-[480px] rounded-full bg-white/90 blur-[120px]" />

        <div
          className="absolute bottom-[150px] left-1/3 h-[360px] w-[360px] rounded-full blur-[110px]"
          style={{ background: "rgba(206,0,40,0.045)" }}
        />

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.14) 0.6px, transparent 0.6px)",
            backgroundSize: "7px 7px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* <PageHero
          kicker="BLTDIF · SHIPPING"
          title="SHIPPING & DELIVERY"
          subtitle="Fast dispatch, reliable delivery, and clear timelines — so you always know what to expect."
          //image="/images/shipping-hero.jpg"
          image=""
          primaryCta={{ label: "Shop Drop 01", href: "/products" }}
          secondaryCta={{ label: "Contact Support", href: "/contact" }}
        /> */}

        {/* Overview strip */}
        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:py-16 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="h-[2px] w-8"
                  style={{ backgroundColor: BRAND_RED }}
                />
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                  The delivery experience
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                From checkout to <span style={{ color: BRAND_RED }}>your door.</span>
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Processing Time"
              value="1–2 Business Days"
              desc="Orders are prepared and dispatched quickly (excluding holidays)."
              icon={Clock3}
              number="01"
            />

            <StatCard
              title="Delivery Time"
              value="3–7 Business Days"
              desc="Varies by location and courier service availability."
              icon={Truck}
              number="02"
            />

            <StatCard
              title="Order Updates"
              value="Tracking Provided"
              desc="You’ll receive tracking once the order is shipped."
              icon={PackageCheck}
              number="03"
            />
          </div>
        </section>

        {/* Delivery details */}
        <section className="relative border-y border-white/80 bg-white/[0.24] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10" />

          <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:py-20 lg:px-10">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-12">
              {/* Image */}
              <div className={`group relative overflow-hidden rounded-[28px] p-2 sm:rounded-[34px] ${glassPanel}`}>
                <div className="relative h-[340px] overflow-hidden rounded-[21px] sm:h-[460px] lg:h-[560px]">
                  <Image
                    src="/images/photo-1.jpg"
                    alt="Shipping"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/25" />

                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                    <div className="rounded-2xl border border-white/35 bg-black/20 px-4 py-3 text-white shadow-lg backdrop-blur-xl sm:px-5">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                        BLTDIF delivery
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                        Every order matters.
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-xl transition-transform duration-300 group-hover:rotate-12">
                      <PackageCheck size={20} strokeWidth={1.6} />
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-[21px] border border-white/25" />
                </div>
              </div>

              {/* Delivery information */}
              <div className={`relative rounded-[28px] p-6 sm:rounded-[32px] sm:p-8 lg:p-10 ${glassPanel}`}>
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                <div className="flex items-center gap-3">
                  <span
                    className="h-[2px] w-7"
                    style={{ backgroundColor: BRAND_RED }}
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                    Delivery details
                  </p>
                </div>

                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
                  Built different —{" "}
                  <span style={{ color: BRAND_RED }}>delivered clean.</span>
                </h2>

                <ul className="mt-7 space-y-5 text-sm leading-6 text-black/65 md:text-[15px]">
                  <DeliveryPoint>
                    Orders are dispatched after payment confirmation.
                  </DeliveryPoint>

                  <DeliveryPoint>
                    Delivery timelines may vary due to region/courier delays.
                  </DeliveryPoint>

                  <DeliveryPoint>
                    Ensure address + phone details are accurate for smooth delivery.
                  </DeliveryPoint>

                  <DeliveryPoint>
                    If your package is delayed, contact support with your order number.
                  </DeliveryPoint>
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/contact"
                    className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-white/30 px-6 py-3.5 text-center text-[12px] font-semibold text-white shadow-[0_12px_30px_rgba(206,0,40,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(206,0,40,0.28)]"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
                    }}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative">Ask about my order</span>
                    <ArrowUpRight
                      size={15}
                      className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>

                  <Link
                    href="/faq"
                    className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/90 bg-white/[0.55] px-6 py-3.5 text-center text-[12px] font-semibold text-black/75 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_5px_16px_rgba(0,0,0,0.035)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.85]"
                  >
                    View FAQ
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping notes */}
        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:py-20 lg:px-10">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span
                className="h-[2px] w-8"
                style={{ backgroundColor: BRAND_RED }}
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                Good to know
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              The details, <span style={{ color: BRAND_RED }}>covered.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              title="Shipping Charges"
              desc="Shipping fees may vary by region and order size. Charges (if any) are shown at checkout."
              number="01"
            />

            <InfoCard
              title="Missed Delivery"
              desc="If delivery fails due to incorrect address or unavailable receiver, courier may attempt re-delivery or return the package."
              number="02"
            />

            <InfoCard
              title="Damaged Package"
              desc="If your package arrives damaged, contact support within 24–48 hours with photos for assistance."
              number="03"
            />

            <InfoCard
              title="International Shipping"
              desc="If you plan international delivery, contact us. Rates and timelines vary by destination."
              number="04"
            />
          </div>

          {/* Closing note */}
          <div className={`mt-8 flex flex-col gap-4 rounded-[24px] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${glassPanel}`}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white/65 text-black/65 shadow-sm">
                <ShieldCheck size={19} strokeWidth={1.6} />
              </div>

              <div>
                <p className="text-sm font-semibold text-black/80">
                  Need help with a delivery?
                </p>
                <p className="mt-1 text-xs leading-5 text-black/55">
                  Our support team can help with your order questions.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/90 bg-white/[0.65] px-5 py-3 text-[11px] font-semibold text-black/75 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:self-auto"
            >
              Contact Support
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}

function DeliveryPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white bg-white/75 shadow-sm">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: BRAND_RED }}
        />
      </span>
      <span>{children}</span>
    </li>
  );
}

function StatCard({
  title,
  value,
  desc,
  icon: Icon,
  number,
}: {
  title: string;
  value: string;
  desc: string;
  icon: React.ElementType;
  number: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-[24px] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.72] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] sm:p-7 ${glassPanel}`}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/[0.65] text-black/65 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:scale-105">
          <Icon size={20} strokeWidth={1.6} />
        </div>

        <span className="text-[10px] font-medium tracking-[0.2em] text-black/25">
          {number}
        </span>
      </div>

      <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-tight text-black sm:text-2xl">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-black/55">{desc}</p>

      <div
        className="mt-6 h-[2px] w-8 rounded-full transition-all duration-300 group-hover:w-14"
        style={{ backgroundColor: BRAND_RED }}
      />
    </div>
  );
}

function InfoCard({
  title,
  desc,
  number,
}: {
  title: string;
  desc: string;
  number: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-[24px] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.75] hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)] sm:p-7 ${glassPanel}`}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_12px_rgba(206,0,40,0.2)]"
            style={{ backgroundColor: BRAND_RED }}
          />

          <p className="text-sm font-semibold text-black">{title}</p>
        </div>

        <span className="text-[10px] tracking-[0.2em] text-black/25">
          {number}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-black/60">{desc}</p>
    </div>
  );
}
