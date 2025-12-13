"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "../data/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] shadow-[0_0_40px_rgba(15,23,42,0.4)]"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        {/* Image mock or gradient */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950" />
          {/* You can replace this with <Image /> using next/image later */}
          <div className="relative flex h-full items-center justify-center">
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
              BLTDIF
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
          {product.tag && (
            <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
              {product.tag}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1 px-3.5 pb-3.5 pt-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-orange-300">
              {product.name}
            </h3>
            <span className="text-xs font-semibold text-white">
              ${product.price}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">{product.colorway}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            <span>{product.category}</span>
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px]">
              View details
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
