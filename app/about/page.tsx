import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Eye,
  Gem,
  MoveUpRight,
  Sparkles,
  Waves,
  Crown,
  Target,
} from "lucide-react";

import PageHero from "../components/marketing/PageHero";
import AnnouncementBar from "../components/AnnouncementBar";

const BRAND_RED = "#CE0028";

export const metadata = { title: "About BLTDIF" };

const glassPanel =
  "border border-white/75 bg-white/[0.42] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_16px_50px_rgba(0,0,0,0.055)] backdrop-blur-2xl";

const features = [
  {
    title: "Modern Aesthetic Blend",
    desc: "Streetwear + contemporary formals for clean versatility.",
    icon: Sparkles,
    number: "01",
  },
  {
    title: "Premium Quality",
    desc: "Better fabric, better feel, better drape.",
    icon: Gem,
    number: "02",
  },
  {
    title: "Comfort & Flow",
    desc: "Designed for long days and late nights.",
    icon: Waves,
    number: "03",
  },
  {
    title: "Statement Style",
    desc: "Minimal branding, maximum presence.",
    icon: Crown,
    number: "04",
  },
];

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />

      <main className="relative isolate overflow-hidden bg-[#f4f3f2] text-[#111111]">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -left-48 top-[350px] h-[520px] w-[520px] rounded-full blur-[120px]"
            style={{ background: "rgba(206,0,40,0.09)" }}
          />
          <div className="absolute -right-48 top-[850px] h-[600px] w-[600px] rounded-full bg-white/90 blur-[130px]" />
          <div className="absolute -left-40 top-[1800px] h-[500px] w-[500px] rounded-full bg-[#f3cbd2]/50 blur-[130px]" />
          <div className="absolute right-0 top-[2300px] h-[500px] w-[500px] rounded-full bg-white/80 blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.12) 0.6px, transparent 0.6px)",
              backgroundSize: "7px 7px",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Hero */}
          {/* <PageHero
            kicker="BLTDIF · BRAND"
            title="ABOUT US!"
            subtitle="Modern streetwear with contemporary formals — premium fabrics, minimal branding, and comfort-first silhouettes that make a statement without trying too hard."
            image=""
            primaryCta={{ label: "Shop Drop 01", href: "/products" }}
            secondaryCta={{ label: "Contact Us", href: "/contact" }}
          /> */}

          {/* Brand story */}
          <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 md:pt-25 lg:px-10">
            <div
              className={`relative overflow-hidden rounded-[30px] p-3 sm:p-5 md:rounded-[38px] ${glassPanel}`}
            >
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/80 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-rose-200/30 blur-[90px]" />

              <div className="relative grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Story copy */}
                <div className="relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-white/80 bg-white/[0.48] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl sm:p-9 md:p-12">
                  <div className="mb-8 flex items-center gap-3">
                    <span
                      className="h-[2px] w-8"
                      style={{ backgroundColor: BRAND_RED }}
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                      About BLTDIF
                    </p>
                  </div>

                  <h2 className="max-w-xl text-4xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl md:text-6xl">
                    Street energy.
                    <br />
                    <span style={{ color: BRAND_RED }}>Modern form.</span>
                  </h2>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-black/65 sm:text-[15px]">
                    BLTDIF is a modern, fashion-forward clothing brand that
                    blends streetwear with contemporary formals. With premium
                    fabrics, bold yet minimal designs, and a focus on comfort,
                    we create fresh pieces that represent luxury, flow with the
                    latest trends, and make a stylish, conversation-worthy
                    statement.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {[
                      "Premium Fabrics",
                      "Minimal Branding",
                      "Comfort First",
                      "Statement Fits",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white bg-white/60 px-3.5 py-2 text-[11px] font-medium text-black/65 shadow-[0_3px_12px_rgba(0,0,0,0.035)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Link
                      href="/products"
                      className="group inline-flex items-center gap-5 rounded-full border border-white/25 px-6 py-3.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(206,0,40,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(206,0,40,0.3)]"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND_RED}, #92001d)`,
                      }}
                    >
                      Explore Products
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>

                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Made to stand apart
                    </span>
                  </div>

                  <div className="pointer-events-none absolute right-5 top-5 hidden text-[10px] tracking-[0.3em] text-black/20 sm:block">
                    BLTDIF®
                  </div>
                </div>

                {/* Editorial image */}
                <div className="group relative min-h-[360px] overflow-hidden rounded-[24px] border border-white/80 bg-white/30 p-2 sm:min-h-[480px] lg:min-h-[600px]">
                  <div className="relative h-full min-h-[344px] overflow-hidden rounded-[18px] sm:min-h-[464px] lg:min-h-[584px]">
                    <Image
                      src="/images/photo-3.jpg"
                      alt="BLTDIF contemporary fashion"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-white/10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />

                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                      <div className="rounded-2xl border border-white/30 bg-black/20 px-4 py-3 text-white shadow-lg backdrop-blur-xl sm:px-5">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                          The BLTDIF identity
                        </p>
                        <p className="mt-1 text-lg font-semibold tracking-[0.12em] sm:text-xl">
                          LESS. BUT BETTER.
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-xl transition-transform duration-300 group-hover:rotate-45">
                        <MoveUpRight size={19} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission / vision / goal */}
          <section className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6 md:pt-5 lg:px-10">
            <div className={`relative overflow-hidden rounded-[30px] p-5 sm:p-8 md:rounded-[36px] md:p-10 ${glassPanel}`}>
              <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-rose-200/30 blur-[90px]" />

              <div className="relative grid gap-8 lg:grid-cols-[0.65fr_2fr] lg:gap-12">
                <div className="flex flex-col justify-between gap-6 lg:py-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/45">
                      What drives us
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
                      Beyond
                      <br />
                      <span style={{ color: BRAND_RED }}>the outfit.</span>
                    </h2>
                  </div>

                  <div className="hidden lg:block">
                    <div className="h-px w-14 bg-black/15" />
                    <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-black/40">
                      Purpose. Perspective. Presence.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Block
                    number="01"
                    icon={Target}
                    title="Our Mission"
                    text="At BLTDIF, we create fashion that feels like it was made for you. We mix the energy of streetwear with the elegance of modern formals to craft pieces that are effortless, comfortable, and premium."
                  />

                  <Block
                    number="02"
                    icon={Eye}
                    title="Our Vision"
                    text="We dream of BLTDIF becoming your go-to brand — bold, timeless, and personal. Our aim is to set trends, shape the market, and make every piece you wear reflect your style, comfort, and confidence."
                  />

                  <Block
                    number="03"
                    icon={ArrowDownRight}
                    title="Our Goal"
                    text="We help you show up confidently, express yourself, and turn everyday moments into conversations."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Brand values */}
          <section className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6 md:pt-5 lg:px-10">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.5fr]">
              {/* Section heading */}
              <div className={`relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[30px] p-7 sm:p-10 md:rounded-[36px] ${glassPanel}`}>
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-rose-300/35 blur-[80px]" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-[2px] w-8"
                      style={{ backgroundColor: BRAND_RED }}
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
                      What makes us different
                    </p>
                  </div>

                  <h2 className="mt-7 max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-5xl md:text-6xl">
                    Designed to
                    <br />
                    move{" "}
                    <span style={{ color: BRAND_RED }}>different.</span>
                  </h2>
                </div>

                <div className="relative mt-10 flex items-center justify-between border-t border-black/[0.08] pt-5">
                  <p className="max-w-[210px] text-xs leading-5 text-black/50">
                    Premium essentials. Distinctive expression. Everyday
                    confidence.
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white/60 shadow-sm backdrop-blur-xl">
                    <ArrowDownRight size={18} />
                  </div>
                </div>
              </div>

              {/* Feature cards */}
              <div className={`rounded-[30px] p-3 sm:p-4 md:rounded-[36px] ${glassPanel}`}>
                <div className="grid h-full gap-3 sm:grid-cols-2">
                  {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.number}
                        className="group relative flex min-h-[175px] flex-col justify-between overflow-hidden rounded-[22px] border border-white/85 bg-white/[0.45] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.75] hover:shadow-[0_18px_40px_rgba(0,0,0,0.07)] sm:p-6"
                      >
                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-200/30 blur-2xl transition-transform duration-500 group-hover:scale-150" />

                        <div className="relative flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white bg-white/70 text-black/75 shadow-sm">
                            <Icon size={19} strokeWidth={1.6} />
                          </div>

                          <span className="text-[10px] tracking-[0.2em] text-black/30">
                            {feature.number}
                          </span>
                        </div>

                        <div className="relative mt-8">
                          <h3 className="text-sm font-semibold tracking-tight sm:text-[15px]">
                            {feature.title}
                          </h3>
                          <p className="mt-2 max-w-xs text-xs leading-5 text-black/55 sm:text-[13px]">
                            {feature.desc}
                          </p>
                        </div>

                        <span
                          className="absolute bottom-0 left-5 h-[2px] w-0 transition-all duration-500 group-hover:w-12 sm:left-6"
                          style={{ backgroundColor: BRAND_RED }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          <section className="px-4 py-5 sm:px-6 md:py-5 lg:px-10">
            <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[30px] border border-white/70 bg-white/[0.42] px-6 py-12 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur-2xl sm:rounded-[36px] sm:px-10 sm:py-16">
              <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-rose-200/50 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-white/90 blur-[90px]" />

              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/45">
                  Your style. Your statement.
                </p>

                <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl md:text-5xl">
                  Find your next{" "}
                  <span style={{ color: BRAND_RED }}>signature fit.</span>
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/55">
                  Discover modern essentials designed to make a statement
                  without trying too hard.
                </p>

                <Link
                  href="/products"
                  className="group mt-7 inline-flex items-center gap-5 rounded-full border border-white/25 px-7 py-3.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(206,0,40,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(206,0,40,0.3)]"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_RED}, #92001d)`,
                  }}
                >
                  Explore the collection
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Block({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/85 bg-white/[0.48] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_10px_30px_rgba(0,0,0,0.035)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.72] hover:shadow-[0_18px_40px_rgba(0,0,0,0.07)] sm:p-6">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/70 text-black/75 shadow-sm">
          <Icon size={20} strokeWidth={1.6} />
        </div>

        <span className="text-[10px] tracking-[0.2em] text-black/30">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-base font-semibold tracking-tight">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-black/60">{text}</p>

      <div
        className="mt-auto pt-6"
        aria-hidden="true"
      >
        <div className="h-px w-full bg-black/[0.07]" />
      </div>
    </div>
  );
}