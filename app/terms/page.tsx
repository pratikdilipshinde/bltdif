import Link from "next/link";
import {
  ArrowUpRight,
  Scale,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  Copyright,
  FileText,
  RefreshCcw,
  Mail,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import AnnouncementBar from "../components/AnnouncementBar";

const BRAND_RED = "#CE0028";

export const metadata = {
  title: "Terms & Conditions | BLTDIF",
};

const termsSections = [
  {
    title: "Use of Website",
    text: "By accessing and using the BLTDIF website, you agree to use it only for lawful purposes and in a manner that does not infringe the rights of or restrict the use of the site by others.",
    icon: ShieldCheck,
  },
  {
    title: "Products & Availability",
    text: "All products displayed on our website are subject to availability. We reserve the right to modify, discontinue, or update products, pricing, and descriptions without prior notice.",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    text: "Once you place an order, you will receive an order confirmation. BLTDIF reserves the right to refuse, cancel, or limit any order at our discretion, including in cases of pricing errors, suspected fraud, or stock issues.",
    icon: FileText,
  },
  {
    title: "Pricing & Payments",
    text: "All prices shown on the website are listed in the applicable currency and are subject to change without notice. Payments must be completed through our approved payment methods before orders are processed.",
    icon: CreditCard,
  },
  {
    title: "Shipping",
    text: "Delivery timelines are estimates and may vary depending on your location, carrier delays, holidays, or other circumstances beyond our control.",
    icon: Truck,
  },
  {
    title: "Returns & Refunds",
    text: "Returns, exchanges, and refunds are governed by our Refund Policy. Please review that page carefully before placing an order.",
    icon: RefreshCw,
  },
  {
    title: "Intellectual Property",
    text: "All BLTDIF branding, content, designs, logos, images, graphics, and website materials are owned by or licensed to BLTDIF and may not be copied, reproduced, or used without permission.",
    icon: Copyright,
  },
  {
    title: "Limitation of Liability",
    text: "BLTDIF shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the website, products, or services.",
    icon: LockKeyhole,
  },
  {
    title: "Changes to Terms",
    text: "We may revise these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of those updated terms.",
    icon: RefreshCcw,
  },
];

const glassPanel =
  "border border-white/75 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_10px_35px_rgba(0,0,0,0.045)] backdrop-blur-2xl";

const glassInner =
  "border border-white/80 bg-white/[0.52] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_18px_rgba(0,0,0,0.025)] backdrop-blur-xl";

export default function TermsPage() {
  return (
    <>
    <AnnouncementBar />
    <main className="relative min-h-screen overflow-hidden bg-[#f3f2ef] text-black">

      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#CE0028]/[0.055] blur-[120px]" />
        <div className="absolute -right-40 top-[30%] h-[500px] w-[500px] rounded-full bg-white/80 blur-[130px]" />
        <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-[#CE0028]/[0.035] blur-[120px]" />
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 md:pb-16 md:pt-25 lg:px-8">
        <div className={`${glassPanel} relative overflow-hidden rounded-[28px] p-6 sm:p-10 md:rounded-[36px] md:p-14`}>

          <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#CE0028]/[0.07] blur-[90px]" />

          <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-12">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/60 px-4 py-2">
                <Scale size={13} style={{ color: BRAND_RED }} />
                <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-black/55">
                  BLTDIF · Legal
                </span>
              </div>

              <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                TERMS &
                <br />
                <span style={{ color: BRAND_RED }}>CONDITIONS.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-black/55 md:text-[15px]">
                These terms govern your use of the BLTDIF website, purchases,
                content, and services. Please read them carefully before
                browsing or placing an order.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_12px_30px_rgba(206,0,40,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(206,0,40,0.25)]"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
                  }}
                >
                  Shop Products
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/65 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-black/65 transition hover:bg-white"
                >
                  Contact Us
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative mx-auto flex w-full max-w-[340px] items-center justify-center py-5 md:py-8">
              <div className="absolute inset-4 rounded-full bg-[#CE0028]/[0.06] blur-[55px]" />

              <div className="relative flex aspect-square w-full items-center justify-center rounded-[32px] border border-white/80 bg-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_25px_65px_rgba(0,0,0,0.06)] backdrop-blur-2xl">
                <div className="absolute inset-5 rounded-[25px] border border-white/70" />

                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/90 bg-white/60 shadow-[0_15px_45px_rgba(0,0,0,0.06)] sm:h-52 sm:w-52">
                  <div className="absolute inset-4 rounded-full border border-black/[0.04]" />

                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-[28px] border border-white bg-white/80 shadow-[inset_0_1px_2px_white,0_10px_30px_rgba(0,0,0,0.06)] sm:h-32 sm:w-32">
                    <Scale
                      size={42}
                      strokeWidth={1.2}
                      style={{ color: BRAND_RED }}
                    />
                    <span className="mt-3 text-[8px] font-bold uppercase tracking-[0.2em] text-black/45">
                      BLTDIF
                    </span>
                  </div>

                  <div className="absolute -right-2 top-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white/85 shadow-lg">
                    <CheckCircle2 size={19} style={{ color: BRAND_RED }} />
                  </div>

                  <div className="absolute -bottom-1 -left-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/85 shadow-lg">
                    <FileText size={19} className="text-black/55" />
                  </div>
                </div>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.22em] text-black/45">
                  Clear Terms · Better Experience
                </div>
              </div>
            </div>

          </div>

          {/* HERO FOOTER */}
          <div className="relative mt-10 flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-6">
            {["Orders & Payments", "Shipping", "Returns", "Website Usage"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/90 bg-white/55 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-black/50"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* INTRODUCTION & AGREEMENT */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">

          {/* INTRO */}
          <div className={`${glassPanel} rounded-[28px] p-7 sm:p-9`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-black/40">
              Terms of Use
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              Premium brand.
              <br />
              <span style={{ color: BRAND_RED }}>
                Clear expectations.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-black/55">
              These Terms & Conditions outline the rules, responsibilities,
              and conditions that apply when you use the BLTDIF website,
              browse our products, or place an order through our platform.
            </p>

            <div className="mt-8">
              <Link
                href="/returns"
                className="group inline-flex items-center gap-2 rounded-full border border-[#CE0028]/15 bg-[#CE0028]/[0.055] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] transition hover:bg-[#CE0028]/10"
                style={{ color: BRAND_RED }}
              >
                View Refund Policy
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          {/* AGREEMENT */}
          <div className={`${glassPanel} rounded-[28px] p-7 sm:p-9`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#CE0028]/10 bg-[#CE0028]/[0.06]">
                <ShieldCheck size={20} style={{ color: BRAND_RED }} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/40">
                  Agreement
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Your acceptance matters
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-black/55">
              By using this website, you confirm that you accept these Terms
              & Conditions. If you do not agree, please do not use the BLTDIF
              website or its services.
            </p>

            <div className="my-7 h-px bg-black/[0.07]" />

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/70">
                <Mail size={19} className="text-black/55" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/40">
                  Questions?
                </p>
                <p className="mt-1 text-sm font-semibold">
                  We're here to help
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-black/55">
              For any questions about these terms, reach out to us at{" "}
              <a
                href="mailto:support@bltdif.in"
                className="font-semibold transition hover:opacity-60"
                style={{ color: BRAND_RED }}
              >
                support@bltdif.in
              </a>
              .
            </p>
          </div>

        </div>
      </section>

      {/* TERMS DETAILS */}
      <section className="relative border-y border-white/80 bg-white/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-black/40">
                Terms Details
              </p>

              <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                The essentials,
                <span style={{ color: BRAND_RED }}> clearly laid out.</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-black/50">
                A closer look at the conditions and responsibilities that
                apply when shopping and interacting with BLTDIF.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/90 bg-white/55 px-4 py-2.5">
              <FileText size={14} style={{ color: BRAND_RED }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/50">
                09 Terms & Conditions
              </span>
            </div>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {termsSections.map((item, index) => (
              <TermsCard
                key={item.title}
                title={item.title}
                text={item.text}
                icon={item.icon}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className={`${glassPanel} relative overflow-hidden rounded-[28px] p-7 sm:p-10 md:rounded-[32px]`}>
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#CE0028]/[0.07] blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND_RED }} />
                <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-black/40">
                  Need assistance?
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Have questions about our terms?
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/50">
                If anything is unclear, our team is happy to help you
                understand our policies and shopping terms.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_12px_30px_rgba(206,0,40,0.2)] transition hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
              }}
            >
              Contact Support
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

    </main>
    </>
  );
}

function TermsCard({
  title,
  text,
  icon: Icon,
  index,
}: {
  title: string;
  text: string;
  icon: React.ElementType;
  index: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white/[0.48] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_8px_28px_rgba(0,0,0,0.025)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.72] hover:shadow-[0_18px_45px_rgba(0,0,0,0.055)]">

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#CE0028]/10 bg-[#CE0028]/[0.055] transition group-hover:bg-[#CE0028]/10">
          <Icon size={19} strokeWidth={1.7} style={{ color: BRAND_RED }} />
        </div>

        <span className="text-[10px] font-bold tabular-nums tracking-[0.15em] text-black/20">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-6 text-[15px] font-semibold tracking-tight text-black">
        {title}
      </h3>

      <p className="mt-3 text-[13px] leading-6 text-black/55">
        {text}
      </p>

      <div className="mt-6 h-px w-full bg-gradient-to-r from-[#CE0028]/20 via-black/[0.04] to-transparent" />
    </div>
  );
}
