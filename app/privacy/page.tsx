import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export const metadata = { title: "Privacy Policy | BLTDIF" };

const privacySections = [
  {
    title: "Information We Collect",
    text: "We may collect personal information such as your name, email address, phone number, shipping and billing details, and any information you provide while placing an order, contacting us, or subscribing to updates.",
  },
  {
    title: "How We Use Your Information",
    text: "We use your information to process orders, provide customer support, improve our website experience, send important order-related updates, and, where permitted, share marketing communications about products, drops, and offers.",
  },
  {
    title: "Payments",
    text: "Payments made on BLTDIF are processed through trusted third-party payment providers. We do not store your full card details on our servers.",
  },
  {
    title: "Shipping & Order Fulfillment",
    text: "Your shipping and contact information may be shared with logistics, fulfillment, and delivery partners only to the extent required to process and deliver your order.",
  },
  {
    title: "Cookies & Analytics",
    text: "We may use cookies, pixels, and similar technologies to understand website traffic, improve performance, remember preferences, and enhance your browsing experience.",
  },
  {
    title: "Data Protection",
    text: "We take reasonable technical and organizational measures to protect your data. However, no digital platform or internet transmission can be guaranteed to be completely secure.",
  },
  {
    title: "Your Rights",
    text: "You may request access to, correction of, or deletion of your personal information, subject to applicable legal and business requirements.",
  },
  {
    title: "Policy Updates",
    text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the revised effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · LEGAL"
        title="PRIVACY POLICY"
        subtitle="Your privacy matters to us. This policy explains how BLTDIF collects, uses, stores, and protects your information when you browse our website or place an order."
        image=""
        primaryCta={{ label: "Contact Us", href: "/contact" }}
        secondaryCta={{ label: "Shop Products", href: "/products" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-black/45">
              Privacy at BLTDIF
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black leading-tight">
              Respecting your data.{" "}
              <span style={{ color: BRAND_RED }}>Protecting your trust.</span>
            </h2>

            <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-black/70">
              At BLTDIF, we believe premium experiences should come with clarity
              and trust. This Privacy Policy describes what information we
              collect, why we collect it, and how we use it to deliver a better
              shopping experience.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Order Processing",
                "Secure Payments",
                "Data Protection",
                "Customer Support",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-xs border border-black/10 bg-black/[0.02] px-3 py-1 text-[12px] text-black/70"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
                }}
              >
                Need Help?
              </Link>
            </div>
          </div>

          <div className="rounded-xs border border-black/10 bg-black/[0.02] p-6 md:p-8">
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">
              Effective Date
            </p>
            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-black/70">
              This Privacy Policy applies to your use of the BLTDIF website and
              related services. By using our site, you agree to the collection
              and use of information in accordance with this policy.
            </p>

            <div className="my-6 h-px w-full bg-black/10" />

            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">
              Contact
            </p>
            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-black/70">
              For questions about this policy or your personal data, contact us
              at{" "}
              <a
                href="mailto:hello@bltdif.com"
                className="font-medium text-black hover:opacity-70 transition"
              >
                hello@bltdif.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-black/[0.02] border-y border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs tracking-[0.28em] uppercase text-black/45">
                Privacy details
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
                Clear, simple, transparent.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {privacySections.map((item) => (
              <PolicyCard key={item.title} title={item.title} text={item.text} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function PolicyCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6 hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>
      <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-black/60">
        {text}
      </p>
    </div>
  );
}