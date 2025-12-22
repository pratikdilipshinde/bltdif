import Image from "next/image";
import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export const metadata = { title: "About BLTDIF" };

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · BRAND"
        title="Built Different."
        subtitle="Modern streetwear with contemporary formals — premium fabrics, minimal branding, and comfort-first silhouettes that make a statement without trying too hard."
        image="/images/about-hero.jpg"
        primaryCta={{ label: "Shop Drop 01", href: "/products" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />

      {/* Story section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-black/45">
              About BLTDIF
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black leading-tight">
              Street energy. <span style={{ color: BRAND_RED }}>Modern form.</span>
            </h2>

            <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-black/70">
              BLTDIF is a modern, fashion-forward clothing brand that blends streetwear with contemporary formals.
              With premium fabrics, bold yet minimal designs, and a focus on comfort, we create fresh pieces that
              represent luxury, flow with the latest trends, and make a stylish, conversation-worthy statement.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Premium Fabrics", "Minimal Branding", "Comfort First", "Statement Fits"].map((t) => (
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
                href="/products"
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
              >
                Explore Products
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xs border border-black/10 bg-black/[0.02]">
            <div className="relative h-[420px] md:h-[520px]">
              <Image src="/images/photo-3.jpg" alt="BLTDIF" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision blocks */}
      <section className="w-full bg-black/[0.02] border-y border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <Block
              title="Our Mission"
              text="At BLTDIF, we create fashion that feels like it was made for you. We mix the energy of streetwear with the elegance of modern formals to craft pieces that are effortless, comfortable, and premium."
            />
            <Block
              title="Our Vision"
              text="We dream of BLTDIF becoming your go-to brand — bold, timeless, and personal. Our aim is to set trends, shape the market, and make every piece you wear reflect your style, comfort, and confidence."
            />
          </div>

          <div className="mt-6 rounded-xs border border-black/10 bg-white p-6">
            <p className="text-sm text-black/70 leading-relaxed">
              <span className="font-semibold">Our goal:</span> help you show up confidently, express yourself,
              and turn everyday moments into conversations.
            </p>
          </div>
        </div>
      </section>

      {/* USP grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-black/45">What makes us different</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
              Designed to move different.
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <USP title="Modern Aesthetic Blend" desc="Streetwear + contemporary formals for clean versatility." />
          <USP title="Premium Quality" desc="Better fabric, better feel, better drape." />
          <USP title="Comfort & Flow" desc="Designed for long days and late nights." />
          <USP title="Statement Style" desc="Minimal branding, maximum presence." />
        </div>
      </section>
    </main>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6">
      <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">{title}</p>
      <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-black/70">{text}</p>
    </div>
  );
}

function USP({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xs border border-black/10 bg-white p-6 hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-black/60">{desc}</p>
    </div>
  );
}
