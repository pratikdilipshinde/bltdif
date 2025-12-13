"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BRAND_RED = "#CE0028";

const categories = [
  {
    title: "Hoodies",
    href: "/hoodies",
    desc: "Heavyweight. Oversized. Built for late nights.",
    meta: "DROP READY",
  },
  {
    title: "T-Shirts",
    href: "/t-shirts",
    desc: "Clean silhouettes with premium hand-feel.",
    meta: "BEST SELLER",
  },
  {
    title: "Caps",
    href: "/caps",
    desc: "Minimal branding. Maximum presence.",
    meta: "ESSENTIAL",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* CENTERED TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="text-xs tracking-[0.32em] uppercase text-black/45">
            Categories
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
            Shop the essentials
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-black/55">
            Clean drops. Premium fits. Built around your grind.
          </p>
        </motion.div>

        {/* CARDS */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {categories.map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
            >
              <Link
                href={c.href}
                className="
                  group relative block overflow-hidden rounded-3xl
                  border border-black/10 bg-white
                  p-7 md:p-8
                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                  transition
                  hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]
                "
              >
                {/* subtle red glow on hover */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: `${BRAND_RED}22` }}
                />

                {/* top meta */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-black/45">
                    {c.meta}
                  </span>

                  <motion.span
                    whileHover={{ rotate: 10 }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/80 transition group-hover:border-black/25"
                  >
                    →
                  </motion.span>
                </div>

                {/* main title */}
                <h3 className="mt-6 text-2xl font-semibold text-black">
                  {c.title}
                </h3>

                {/* description */}
                <p className="mt-2 text-sm leading-relaxed text-black/60">
                  {c.desc}
                </p>

                {/* underline accent */}
                <div className="mt-7 flex items-center gap-3">
                  <span className="text-xs tracking-[0.26em] uppercase text-black/45">
                    Explore
                  </span>

                  <span className="relative h-[2px] w-12 overflow-hidden rounded-full bg-black/15">
                    <motion.span
                      className="absolute left-0 top-0 h-full w-full"
                      style={{ backgroundColor: BRAND_RED }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
