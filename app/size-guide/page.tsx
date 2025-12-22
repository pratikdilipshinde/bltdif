import Image from "next/image";
import Link from "next/link";
import PageHero from "../components/marketing/PageHero";

const BRAND_RED = "#CE0028";

export const metadata = { title: "Size Guide · BLTDIF" };

const SIZE_ROWS = [
  { size: "S", chest: "36–38", length: "26–27", shoulder: "16–17" },
  { size: "M", chest: "39–41", length: "27–28", shoulder: "17–18" },
  { size: "L", chest: "42–44", length: "28–29", shoulder: "18–19" },
  { size: "XL", chest: "45–47", length: "29–30", shoulder: "19–20" },
  { size: "XXL", chest: "48–50", length: "30–31", shoulder: "20–21" },
];

export default function SizeGuidePage() {
  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · FIT"
        title="Size Guide"
        subtitle="Choose the fit you want — regular, relaxed, or oversized. Use these measurements as a reference."
        image="/images/size-hero.jpg"
        primaryCta={{ label: "Shop T-Shirts", href: "/t-shirts" }}
        secondaryCta={{ label: "Shop Hoodies", href: "/hoodies" }}
      />

      {/* Fit tips */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-black/45">Fit Tips</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black leading-tight">
              Pick your fit — <span style={{ color: BRAND_RED }}>intentional.</span>
            </h2>

            <div className="mt-6 space-y-4">
              <Tip title="Regular Fit" desc="True-to-size for a clean everyday silhouette." />
              <Tip title="Relaxed Fit" desc="Slightly more room through chest and body." />
              <Tip title="Oversized Fit" desc="Size up or choose items labeled Oversized for the streetwear drape." />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-sm px-6 py-3 text-[12px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                style={{ background: `linear-gradient(135deg, ${BRAND_RED}, #8B001C)` }}
              >
                Ask about sizing
              </Link>
              <Link
                href="/returns"
                className="rounded-sm border border-black/15 bg-white px-6 py-3 text-[12px] font-semibold text-black hover:bg-black/[0.02] transition"
              >
                Returns & Exchanges
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-sm border border-black/10 bg-black/[0.02]">
            <div className="relative h-[360px] md:h-[520px]">
              <Image src="/images/photo-3.jpg" alt="Fit" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Size table */}
      <section className="w-full border-y border-black/10 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs tracking-[0.28em] uppercase text-black/45">Measurements (inches)</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">T-Shirts & Hoodies</h2>
              <p className="mt-3 text-sm text-black/60 leading-relaxed max-w-2xl">
                Measurements can vary slightly by style and drop. If you’re between sizes, choose based on your desired fit.
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-sm border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-black/[0.02]">
                  <tr className="border-b border-black/10">
                    <Th>Size</Th>
                    <Th>Chest</Th>
                    <Th>Length</Th>
                    <Th>Shoulder</Th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_ROWS.map((r) => (
                    <tr key={r.size} className="border-b border-black/10 last:border-b-0">
                      <Td strong>{r.size}</Td>
                      <Td>{r.chest}</Td>
                      <Td>{r.length}</Td>
                      <Td>{r.shoulder}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 text-[12px] text-black/60 leading-relaxed">
              <span className="font-semibold" style={{ color: BRAND_RED }}>
                Tip:
              </span>{" "}
              For an oversized look, size up or choose products labeled “Oversized”.
            </div>
          </div>
        </div>
      </section>

      {/* How to measure */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <How title="Chest" desc="Measure around the fullest part of your chest." />
          <How title="Length" desc="Measure from shoulder seam down to hem." />
          <How title="Shoulder" desc="Measure across the back from shoulder seam to seam." />
        </div>
      </section>
    </main>
  );
}

function Tip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND_RED }} />
        <p className="text-sm font-semibold text-black">{title}</p>
      </div>
      <p className="mt-2 text-sm text-black/65 leading-relaxed">{desc}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-[12px] font-semibold tracking-[0.18em] uppercase text-black/55">
      {children}
    </th>
  );
}

function Td({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <td className={`px-5 py-4 text-sm ${strong ? "font-semibold text-black" : "text-black/70"}`}>
      {children}
    </td>
  );
}

function How({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-6">
      <p className="text-sm font-semibold text-black">{title}</p>
      <p className="mt-2 text-sm text-black/65 leading-relaxed">{desc}</p>
    </div>
  );
}
