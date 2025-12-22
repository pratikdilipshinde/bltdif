"use client";

import { useState } from "react";
import PageHero from "../components/marketing/PageHero";
import Image from "next/image";

const faqs = [
  {
    q: "Do you restock items?",
    a: "Some drops may restock based on demand, but limited items may not return. If it’s labeled Limited, assume it won’t restock.",
  },
  {
    q: "How do I choose my size?",
    a: "Use our Size Guide. If you like a relaxed fit, go true-to-size. For oversized looks, size up depending on the item.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "If your order hasn’t shipped yet, contact us ASAP. Once shipped, changes aren’t possible.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cards and supported checkout options depending on your region (connect later).",
  },
  {
    q: "How do returns work?",
    a: "Returns are accepted within the window as long as items are unworn with tags. See Returns & Exchanges for full details.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · HELP"
        title="FAQ"
        subtitle="Quick answers about sizing, shipping, orders, and returns."
        image="/images/faq-hero.jpg"
      />

      {/* image strip */}
      <section className="mx-auto max-w-7xl px-4 -mt-10 md:-mt-14 relative z-10">
        <div className="grid gap-3 md:grid-cols-3">
          {["/images/photo-1.jpg", "/images/photo-3.jpg", "/images/photo-5.jpg"].map((src) => (
            <div key={src} className="relative h-[160px] md:h-[300px] overflow-hidden rounded-sm border border-black/10 bg-black/[0.02]">
              <Image src={src} alt="BLTDIF" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* accordion */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.28em] uppercase text-black/45">Support</p>
          <h2 className="mt-3 text-3xl font-semibold text-black">Frequently asked questions</h2>
          <p className="mt-3 text-sm text-black/60">
            Can’t find what you need? Visit Contact.
          </p>
        </div>

        <div className="mt-8 divide-y divide-black/10 rounded-sm border border-black/10">
          {faqs.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <button
                key={idx}
                onClick={() => setOpen(isOpen ? null : idx)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between gap-4 px-5 py-5">
                  <p className="text-sm font-semibold text-black">{item.q}</p>
                  <span className="text-black/50 text-lg">{isOpen ? "—" : "+"}</span>
                </div>
                {isOpen ? (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-black/70">{item.a}</p>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
