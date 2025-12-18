"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND_RED, PRODUCTS } from "../../lib/shop/catalog";

export default function SimilarProductsCarousel({
  currentId,
  category,
}: {
  currentId: string;
  category: string;
}) {
  const items = PRODUCTS.filter((p) => p.category === category && p.id !== currentId).slice(0, 10);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.28em] uppercase text-black/50">More</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-black">Similar products</h2>
        </div>

        <Link
          href={`/${category}`}
          className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-black/[0.02] transition"
        >
          View category
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {items.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: idx * 0.03 }}
              className="w-[240px] sm:w-[260px]"
            >
              <Link
                href={`/products/${p.id}`}
                className="group block overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f7] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)] transition"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.20)] transition duration-300 group-hover:scale-[1.06]"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-black">{p.name}</p>
                    <p className="mt-1 text-xs text-black/55">BLTDIF · Premium</p>
                  </div>
                  <p className="text-sm font-semibold text-black">${p.price}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs tracking-[0.22em] uppercase text-black/45">View</span>
                  <span
                    className="h-[2px] w-10 bg-black/20 transition duration-300 group-hover:w-16"
                    style={{ backgroundColor: `${BRAND_RED}55` }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
