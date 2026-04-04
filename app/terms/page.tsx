import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export const metadata = { title: "Terms & Conditions | BLTDIF" };

const termsSections = [
  {
    title: "Use of Website",
    text: "By accessing and using the BLTDIF website, you agree to use it only for lawful purposes and in a manner that does not infringe the rights of or restrict the use of the site by others.",
  },
  {
    title: "Products & Availability",
    text: "All products displayed on our website are subject to availability. We reserve the right to modify, discontinue, or update products, pricing, and descriptions without prior notice.",
  },
  {
    title: "Orders",
    text: "Once you place an order, you will receive an order confirmation. BLTDIF reserves the right to refuse, cancel, or limit any order at our discretion, including in cases of pricing errors, suspected fraud, or stock issues.",
  },
  {
    title: "Pricing & Payments",
    text: "All prices shown on the website are listed in the applicable currency and are subject to change without notice. Payments must be completed through our approved payment methods before orders are processed.",
  },
  {
    title: "Shipping",
    text: "Delivery timelines are estimates and may vary depending on your location, carrier delays, holidays, or other circumstances beyond our control.",
  },
  {
    title: "Returns & Refunds",
    text: "Returns, exchanges, and refunds are governed by our Refund Policy. Please review that page carefully before placing an order.",
  },
  {
    title: "Intellectual Property",
    text: "All BLTDIF branding, content, designs, logos, images, graphics, and website materials are owned by or licensed to BLTDIF and may not be copied, reproduced, or used without permission.",
  },
  {
    title: "Limitation of Liability",
    text: "BLTDIF shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the website, products, or services.",
  },
  {
    title: "Changes to Terms",
    text: "We may revise these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of those updated terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · LEGAL"
        title="TERMS & CONDITIONS"
        subtitle="These terms govern your use of the BLTDIF website, purchases, content, and services. Please read them carefully before browsing or placing an order."
        image=""
        primaryCta={{ label: "Shop Products", href: "/products" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-black/45">
              Terms of Use
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black leading-tight">
              Premium brand.{" "}
              <span style={{ color: BRAND_RED }}>Clear expectations.</span>
            </h2>

            <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-black/70">
              These Terms & Conditions outline the rules, responsibilities, and
              conditions that apply when you use the BLTDIF website, browse our
              products, or place an order through our platform.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Orders & Payments",
                "Shipping",
                "Returns",
                "Website Usage",
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
                href="/refunds"
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)`,
                }}
              >
                View Refund Policy
              </Link>
            </div>
          </div>

          <div className="rounded-xs border border-black/10 bg-black/[0.02] p-6 md:p-8">
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">
              Agreement
            </p>
            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-black/70">
              By using this website, you confirm that you accept these Terms &
              Conditions. If you do not agree, please do not use the BLTDIF
              website or its services.
            </p>

            <div className="my-6 h-px w-full bg-black/10" />

            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">
              Questions
            </p>
            <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-black/70">
              For any questions about these terms, reach out to us at{" "}
              <a
                href="mailto:support@bltdif.in"
                className="font-medium text-black hover:opacity-70 transition"
              >
                support@bltdif.in
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
                Terms details
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
                The essentials, clearly laid out.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {termsSections.map((item) => (
              <TermsCard key={item.title} title={item.title} text={item.text} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function TermsCard({ title, text }: { title: string; text: string }) {
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