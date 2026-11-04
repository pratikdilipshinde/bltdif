import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  RefreshCw,
  PackageCheck,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import AnnouncementBar from "../components/AnnouncementBar";

const BRAND_RED = "#CE0028";

export const metadata = {
  title: "Returns & Exchanges · BLTDIF",
};

const glassPanel =
  "border border-white/75 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_10px_35px_rgba(0,0,0,0.045)] backdrop-blur-2xl";

const glassInner =
  "border border-white/80 bg-white/[0.52] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_18px_rgba(0,0,0,0.025)] backdrop-blur-xl";

export default function ReturnsPage() {
  return (
    <>
    <AnnouncementBar />
    <main className="relative min-h-screen overflow-hidden bg-[#f3f2ef]">
      {/* BACKGROUND ACCENTS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 size-[420px] rounded-full bg-[#CE0028]/[0.045] blur-[110px]" />
        <div className="absolute -right-40 top-[650px] size-[500px] rounded-full bg-white/80 blur-[120px]" />
        <div className="absolute left-1/3 top-[1450px] size-[350px] rounded-full bg-[#CE0028]/[0.025] blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-20 md:px-8 md:pb-12 md:pt-25">
          <div className={`relative overflow-hidden rounded-[28px] p-6 md:rounded-[36px] md:p-12 lg:p-16 ${glassPanel}`}>
            <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-[#CE0028]/[0.055] blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-white/90 blur-[80px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-4 py-2 shadow-sm backdrop-blur-xl">
                  <RefreshCw className="size-3.5 text-[#CE0028]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.23em] text-black/55">
                    BLTDIF · Customer Care
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-black sm:text-5xl md:text-6xl">
                  RETURNS
                  <br />
                  <span style={{ color: BRAND_RED }}>& EXCHANGES.</span>
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-7 text-black/55 md:text-base">
                  We keep it simple: unworn, tagged, and within the return
                  window — we’ll take care of the rest.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.13)] transition-all duration-300 hover:bg-[#CE0028]"
                  >
                    Contact Support
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-black/65 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-white hover:text-[#CE0028]"
                  >
                    Shop Products
                  </Link>
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-black/[0.07] pt-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-[#CE0028]" />
                    <span className="text-[10px] font-semibold text-black/50">
                      Customer-first support
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PackageCheck className="size-4 text-[#CE0028]" />
                    <span className="text-[10px] font-semibold text-black/50">
                      Simple return process
                    </span>
                  </div>
                </div>
              </div>

              {/* HERO IMAGE */}
              <div className="relative mx-auto w-full max-w-[480px]">
                <div className="absolute -inset-4 rounded-[32px] bg-white/40 blur-2xl" />

                <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-white/50 p-2 shadow-[0_25px_70px_rgba(0,0,0,0.10)] backdrop-blur-2xl md:rounded-[30px]">
                  <div className="relative h-[280px] overflow-hidden rounded-[21px] md:h-[390px]">
                    <Image
                      src="/images/version-2-tee-banner-mobile.jpg"
                      alt="BLTDIF returns and exchanges"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 backdrop-blur-xl">
                        <CheckCircle2 className="size-3.5 text-white" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white">
                          We're here to help
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`absolute -bottom-5 -left-3 rounded-2xl px-4 py-3 md:-left-8 ${glassPanel}`}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/40">
                    Return Window
                  </p>
                  <p className="mt-1 text-xl font-semibold text-black">
                    07 Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY CARDS */}
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <SectionHeading
            eyebrow="THE BLTDIF POLICY"
            title="A little clarity goes a long way."
            description="Everything you need to know before requesting a return or exchange."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <PolicyCard
              icon={<Clock3 className="size-5" />}
              title="Return Window"
              value="7 Days"
              desc="Return requests must be initiated within 7 days of delivery."
            />

            <PolicyCard
              icon={<ShieldCheck className="size-5" />}
              title="Condition"
              value="Unworn + Tagged"
              desc="Items must be unworn, unwashed, and with original tags."
            />

            <PolicyCard
              icon={<RefreshCw className="size-5" />}
              title="Exchanges"
              value="Size / Variant"
              desc="Exchange available based on stock. If unavailable, refund may apply."
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <div className={`relative overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-10 lg:p-14 ${glassPanel}`}>
            <div className="pointer-events-none absolute -right-24 top-1/4 size-80 rounded-full bg-[#CE0028]/[0.035] blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/60 px-4 py-2">
                  <RefreshCw className="size-3.5 text-[#CE0028]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/50">
                    How it works
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-black md:text-4xl lg:text-5xl">
                  A clean process,
                  <br />
                  <span style={{ color: BRAND_RED }}>no drama.</span>
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-black/55">
                  We've kept the process straightforward. Reach out to our
                  team and we'll guide you through every step.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#CE0028] px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_12px_30px_rgba(206,0,40,0.18)] transition-all duration-300 hover:bg-black"
                  >
                    Start a Return
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  {/* <Link
                    href="/size-guide"
                    className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-black/65 backdrop-blur-xl transition-all duration-300 hover:bg-white hover:text-[#CE0028]"
                  >
                    Size Guide
                  </Link> */}
                </div>
              </div>

              {/* STEPS */}
              <div className="space-y-3">
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
            </div>
          </div>
        </section>

        {/* ADDITIONAL INFORMATION */}
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-8 md:pb-20 md:pt-12">
          <SectionHeading
            eyebrow="GOOD TO KNOW"
            title="The finer details."
            description="A few important things to keep in mind when requesting a return or exchange."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info
              title="Non-returnable Items"
              desc="Items marked Final Sale or Limited Drops may not be eligible for returns."
            />

            <Info
              title="Refund Method"
              desc="Refunds are processed to the original payment method after inspection approval."
            />

            <Info
              title="Damaged / Wrong Item"
              desc="If you received the wrong item or damaged item, contact us within 24–48 hours."
            />

            <Info
              title="Shipping Fees"
              desc="Shipping fees are typically non-refundable unless the return is due to our error."
            />
          </div>
        </section>

        {/* SUPPORT CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-20">
          <div className={`relative overflow-hidden rounded-[26px] p-6 md:rounded-[32px] md:p-10 ${glassPanel}`}>
            <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[#CE0028]/[0.055] blur-[80px]" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white/65 shadow-sm">
                  <Headphones className="size-5 text-[#CE0028]" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#CE0028]">
                    Need assistance?
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-black md:text-2xl">
                    We're just a message away.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/50">
                    Get in touch with our team for help with your return or exchange.
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#CE0028]"
              >
                Contact Us
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#CE0028] md:text-[10px]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-black md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-black/50">
        {description}
      </p>
    </div>
  );
}

function PolicyCard({
  icon,
  title,
  value,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] ${glassPanel}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#CE0028]/[0.035] blur-2xl transition-all group-hover:bg-[#CE0028]/[0.07]" />

      <div className="relative">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-white/90 bg-white/65 text-[#CE0028] shadow-sm">
          {icon}
        </div>

        <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
          {title}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-black">
          {value}
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/50">
          {desc}
        </p>
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className={`group rounded-[20px] p-4 transition-all duration-300 hover:bg-white/75 md:p-5 ${glassInner}`}>
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#CE0028] text-[10px] font-bold tracking-wider text-white shadow-[0_6px_18px_rgba(206,0,40,0.18)]">
          {num}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-black">
              {title}
            </h3>
            <ArrowUpRight className="size-4 shrink-0 text-black/20 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#CE0028]" />
          </div>

          <p className="mt-1.5 text-xs leading-6 text-black/50 md:text-sm">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className={`group rounded-[22px] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/75 md:p-6 ${glassPanel}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#CE0028]/10 bg-[#CE0028]/[0.06]">
          <CheckCircle2 className="size-4 text-[#CE0028]" />
        </span>

        <h3 className="text-sm font-semibold text-black">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-black/55">
        {desc}
      </p>
    </div>
  );
}