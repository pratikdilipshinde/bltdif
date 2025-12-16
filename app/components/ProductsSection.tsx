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
    image: "/images/tshirt-2-3d.png",
    href: "/products/night-shift-tee",
  },
  {
    id: "p2",
    name: "Oversized Hoodie",
    price: "$79",
    tag: "Drop 01",
    image: "/images/hoodie-back-3d.png",
    href: "/products/oversized-hoodie",
  },
  {
    id: "p3",
    name: "Minimal Cap",
    price: "$29",
    tag: "Essentials",
    image: "/images/cap-1-3d.png",
    href: "/products/minimal-cap",
  },
  {
    id: "p4",
    name: "Red Graphic Tee",
    price: "$45",
    tag: "Limited",
    image: "/images/tshirt-1-3d.png",
    href: "/products/red-graphic-tee",
  },
];

export default function ProductsSection() {
  return (
    <section className="bg-white pb-14 md:pb-20">
      <div className="mx-4 ">
        <div className="relative text-center">
          <div className="mb-4">
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

        
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
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
                className="group relative block overflow-hidden bg-white"
              >
                {/* tag */}
                <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold tracking-[0.18em] uppercase text-black">
                  {p.tag}
                </div>

                {/* product image (bigger) */}
                <motion.div
                  className="relative bg-[#f7f7f7] h-60 mb-[-5%] w-full md:h-[360px]"
                  whileHover={{ y: -8, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain rounded-[5px] border border-black/10 drop-shadow-[0_22px_45px_rgba(0,0,0,0.22)] transition duration-300 group-hover:scale-[1.06]"
                  />
                </motion.div>

                {/* info */}
                <div className="mt-5 px-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-black">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs text-black/55">
                      Premium fit · BLTDIF
                    </p>
                  </div>
                  <p className="text-base font-semibold text-black">{p.price}</p>
                </div>

                {/* hover CTA */}
                <div className="my-2 px-3 flex items-center justify-between">
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
