"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const products = [
  {
    id: "p1",
    name: "Night Shift Tee",
    price: "$39",
    tag: "New",
    image: "/images/tshirt-1-3d.png",
    href: "/products/night-shift-tee",
  },
  {
    id: "p2",
    name: "Oversized Hoodie",
    price: "$79",
    tag: "Drop 01",
    image: "/images/tshirt-1-3d.png",
    href: "/products/oversized-hoodie",
  },
  {
    id: "p3",
    name: "Minimal Cap",
    price: "$29",
    tag: "Essentials",
    image: "/images/tshirt-1-3d.png",
    href: "/products/minimal-cap",
  },
  {
    id: "p4",
    name: "Red Graphic Tee",
    price: "$45",
    tag: "Limited",
    image: "/images/tshirt-1-3d.png", // you already have this
    href: "/products/red-graphic-tee",
  },
];

export default function ProductsSection() {
  return (
    <section className="bg-white px-6 pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] text-black/50 uppercase">
              Featured
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-black">
              Best sellers this week
            </h2>
          </div>

          <Link
            href="/products"
            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-[#111] transition"
          >
            Shop all
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <Link
                href={p.href}
                className="group relative block overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f7] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                {/* tag */}
                <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-black">
                  {p.tag}
                </div>

                {/* product image */}
                <motion.div
                  className="relative h-52 w-full"
                  whileHover={{ y: -6, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition duration-300 group-hover:scale-[1.06]"
                  />
                </motion.div>

                {/* info */}
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs text-black/55">
                      Premium fit · BLTDIF
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-black">{p.price}</p>
                </div>

                {/* hover CTA */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs tracking-[0.22em] uppercase text-black/45">
                    View
                  </span>
                  <span className="h-[2px] w-10 bg-black/20 transition duration-300 group-hover:w-16 group-hover:bg-[#CE0028]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
