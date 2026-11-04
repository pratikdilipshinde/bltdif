import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  LockKeyhole,
  CreditCard,
  Database,
  Cookie,
  UserRound,
  FileCheck,
  Mail,
  Eye,
  Fingerprint,
} from "lucide-react";
import AnnouncementBar from "../components/AnnouncementBar";

const BRAND_RED = "#CE0028";

export const metadata = {
  title: "Privacy Policy | BLTDIF",
};

const glassPanel =
  "border border-white/75 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_10px_35px_rgba(0,0,0,0.045)] backdrop-blur-2xl";

const glassInner =
  "border border-white/80 bg-white/[0.52] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_18px_rgba(0,0,0,0.025)] backdrop-blur-xl";

const privacySections = [
  {
    title: "Information We Collect",
    text: "We may collect personal information such as your name, email address, phone number, shipping and billing details, and any information you provide while placing an order, contacting us, or subscribing to updates.",
    icon: UserRound,
    number: "01",
  },
  {
    title: "How We Use Your Information",
    text: "We use your information to process orders, provide customer support, improve our website experience, send important order-related updates, and, where permitted, share marketing communications about products, drops, and offers.",
    icon: Database,
    number: "02",
  },
  {
    title: "Payments",
    text: "Payments made on BLTDIF are processed through trusted third-party payment providers. We do not store your full card details on our servers.",
    icon: CreditCard,
    number: "03",
  },
  {
    title: "Shipping & Order Fulfillment",
    text: "Your shipping and contact information may be shared with logistics, fulfillment, and delivery partners only to the extent required to process and deliver your order.",
    icon: LockKeyhole,
    number: "04",
  },
  {
    title: "Cookies & Analytics",
    text: "We may use cookies, pixels, and similar technologies to understand website traffic, improve performance, remember preferences, and enhance your browsing experience.",
    icon: Cookie,
    number: "05",
  },
  {
    title: "Data Protection",
    text: "We take reasonable technical and organizational measures to protect your data. However, no digital platform or internet transmission can be guaranteed to be completely secure.",
    icon: ShieldCheck,
    number: "06",
  },
  {
    title: "Your Rights",
    text: "You may request access to, correction of, or deletion of your personal information, subject to applicable legal and business requirements.",
    icon: Eye,
    number: "07",
  },
  {
    title: "Policy Updates",
    text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the revised effective date.",
    icon: FileCheck,
    number: "08",
  },
];

const privacyHighlights = [
  "Order Processing",
  "Secure Payments",
  "Data Protection",
  "Customer Support",
];

export default function PrivacyPage() {
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
              {/* HERO CONTENT */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-4 py-2 shadow-sm backdrop-blur-xl">
                  <ShieldCheck className="size-3.5 text-[#CE0028]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.23em] text-black/55">
                    BLTDIF · Your Privacy Matters
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-black sm:text-5xl md:text-6xl">
                  PRIVACY
                  <br />
                  <span style={{ color: BRAND_RED }}>POLICY.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/55 md:text-base">
                  Your privacy matters to us. This policy explains how BLTDIF
                  collects, uses, stores, and protects your information when
                  you browse our website or place an order.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.13)] transition-all duration-300 hover:bg-[#CE0028]"
                  >
                    Contact Us
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
                    <LockKeyhole className="size-4 text-[#CE0028]" />
                    <span className="text-[10px] font-semibold text-black/50">
                      Secure information
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Fingerprint className="size-4 text-[#CE0028]" />
                    <span className="text-[10px] font-semibold text-black/50">
                      Respect for your privacy
                    </span>
                  </div>
                </div>
              </div>

              {/* PRIVACY VISUAL */}
              <div className="relative mx-auto w-full max-w-[440px]">
                <div className="absolute -inset-5 rounded-full bg-[#CE0028]/[0.06] blur-[65px]" />

                <div className={`relative overflow-hidden rounded-[28px] p-6 md:rounded-[32px] md:p-9 ${glassInner}`}>
                  <div className="absolute right-0 top-0 size-40 rounded-full bg-[#CE0028]/[0.045] blur-[55px]" />

                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <div className="relative flex size-36 items-center justify-center rounded-[38px] border border-white/90 bg-white/65 shadow-[0_15px_45px_rgba(0,0,0,0.06)] md:size-44 md:rounded-[48px]">
                        <div className="absolute inset-3 rounded-[30px] border border-[#CE0028]/10 md:rounded-[40px]" />
                        <ShieldCheck className="size-16 text-[#CE0028] md:size-20" strokeWidth={1.2} />
                        <div className="absolute -right-2 -top-2 flex size-10 items-center justify-center rounded-2xl border border-white bg-white shadow-lg">
                          <LockKeyhole className="size-4 text-black/65" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#CE0028]">
                        Privacy at BLTDIF
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black md:text-3xl">
                        Respecting your data.
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-black/50">
                        Protecting your trust.
                      </p>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-2">
                      {privacyHighlights.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-xl border border-white/90 bg-white/55 px-3 py-3"
                        >
                          <span className="size-1.5 shrink-0 rounded-full bg-[#CE0028]" />
                          <span className="text-[9px] font-semibold text-black/55 md:text-[10px]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl px-4 py-3 md:-left-8 ${glassPanel}`}>
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#CE0028]/[0.07]">
                    <ShieldCheck className="size-4 text-[#CE0028]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">
                      Our Commitment
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-black">
                      Your trust comes first
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY INTRODUCTION */}
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:gap-6">
            <div className={`relative overflow-hidden rounded-[26px] p-6 md:rounded-[30px] md:p-9 ${glassPanel}`}>
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#CE0028]/[0.04] blur-[75px]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/60 px-4 py-2">
                  <Eye className="size-3.5 text-[#CE0028]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/50">
                    Privacy at BLTDIF
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-black md:text-4xl">
                  Respecting your data.
                  <br />
                  <span style={{ color: BRAND_RED }}>
                    Protecting your trust.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/55 md:text-[15px]">
                  At BLTDIF, we believe premium experiences should come with
                  clarity and trust. This Privacy Policy describes what
                  information we collect, why we collect it, and how we use it
                  to deliver a better shopping experience.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {privacyHighlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/90 bg-white/60 px-4 py-2 text-[10px] font-semibold text-black/55 shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* POLICY INFORMATION */}
            <div className={`relative overflow-hidden rounded-[26px] p-6 md:rounded-[30px] md:p-9 ${glassPanel}`}>
              <div className="pointer-events-none absolute -bottom-20 -right-16 size-56 rounded-full bg-white/90 blur-[75px]" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/90 bg-white/65 shadow-sm">
                    <FileCheck className="size-5 text-[#CE0028]" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                      Effective Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      Privacy Policy
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-black/55">
                  This Privacy Policy applies to your use of the BLTDIF website
                  and related services. By using our site, you agree to the
                  collection and use of information in accordance with this
                  policy.
                </p>

                <div className="my-6 h-px w-full bg-black/[0.07]" />

                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/90 bg-white/65 shadow-sm">
                    <Mail className="size-5 text-[#CE0028]" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                      Privacy Enquiries
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      Get in touch
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-black/55">
                  For questions about this policy or your personal data,
                  contact us at{" "}
                  <a
                    href="mailto:support@bltdif.in"
                    className="font-semibold text-[#CE0028] transition hover:opacity-70"
                  >
                    support@bltdif.in
                  </a>
                  .
                </p>

                <Link
                  href="/contact"
                  className="group mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition hover:text-[#CE0028]"
                >
                  Contact Support
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY DETAILS */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <div className={`relative overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-10 lg:p-12 ${glassPanel}`}>
            <div className="pointer-events-none absolute -right-24 top-1/4 size-80 rounded-full bg-[#CE0028]/[0.035] blur-[100px]" />

            <div className="relative">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/60 px-4 py-2">
                    <LockKeyhole className="size-3.5 text-[#CE0028]" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/50">
                      Privacy Details
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-black md:text-4xl">
                    Clear, simple,
                    <br className="sm:hidden" />{" "}
                    <span style={{ color: BRAND_RED }}>transparent.</span>
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
                    Here's a closer look at how we handle your information
                    throughout your BLTDIF experience.
                  </p>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-white/90 bg-white/60 px-4 py-2.5 md:inline-flex">
                  <span className="size-2 rounded-full bg-[#CE0028]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-black/50">
                    08 Policy Sections
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {privacySections.map((item) => (
                  <PolicyCard
                    key={item.title}
                    title={item.title}
                    text={item.text}
                    icon={item.icon}
                    number={item.number}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CONTACT CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-8 md:pb-20 md:pt-12">
          <div className={`relative overflow-hidden rounded-[26px] p-6 md:rounded-[32px] md:p-10 ${glassPanel}`}>
            <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[#CE0028]/[0.055] blur-[80px]" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white/65 shadow-sm">
                  <Mail className="size-5 text-[#CE0028]" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#CE0028]">
                    We're here to help
                  </p>

                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-black md:text-2xl">
                    Have a privacy-related question?
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-black/50">
                    Reach out to our team and we'll be happy to assist.
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#CE0028]"
              >
                Get in Touch
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

function PolicyCard({
  title,
  text,
  icon: Icon,
  number,
}: {
  title: string;
  text: string;
  icon: React.ElementType;
  number: string;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-[22px] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_18px_45px_rgba(0,0,0,0.065)] md:p-6 ${glassInner}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#CE0028]/[0.035] blur-2xl transition-all group-hover:bg-[#CE0028]/[0.07]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/90 bg-white/65 text-[#CE0028] shadow-sm">
            <Icon className="size-[18px]" strokeWidth={1.8} />
          </div>

          <span className="text-[10px] font-bold tracking-[0.15em] text-black/20">
            {number}
          </span>
        </div>

        <h3 className="mt-5 text-sm font-semibold text-black">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/50">
          {text}
        </p>
      </div>
    </article>
  );
}