import Image from "next/image";
import Link from "next/link";

const BRAND_RED = "#CE0028";

export default function PageHero({
  kicker,
  title,
  subtitle,
  image,
  primaryCta,
  secondaryCta,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* background image */}
      <div className="absolute inset-0 bg-[#CE0028]">
        {/* <div className="bg-[]">

        </div> */}
        {/* <Image src={color} alt={title} fill className="object-cover object-top-left" priority /> */}
        
        <div className="absolute inset-0 bg-black/0" />
        {/* <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(206,0,40,0.35), transparent 50%)",
          }}
        /> */}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 md:pt-36 pb-0 mb-0">
        {/* <p className="text-[11px] font-semibold tracking-[0.30em] uppercase text-white/75">
          {kicker}
        </p> */}
        <h1 className="mt-4 mb-[-2.3%] md:mb-[-1.3%] text-4xl md:text-7xl tracking-[0.28rem] font-semibold align-text-bottom text-white leading-tight">
          {title}
        </h1>
        {/* <p className="mt-4 max-w-2xl text-sm md:text-[15px] leading-relaxed text-white/80">
          {subtitle}
        </p> */}

        {/* {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta ? (
              <Link
                href={primaryCta.href}
                className="rounded-xs px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
                style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
              >
                {primaryCta.label}
              </Link>
            ) : null}

            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="rounded-xs border border-white/25 bg-white/10 px-6 py-3 text-[12px] font-semibold text-white hover:bg-white/15 transition"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        )} */}
      </div>
    </section>
  );
}
