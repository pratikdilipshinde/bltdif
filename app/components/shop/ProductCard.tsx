"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "../../lib/shop/types";
import { BRAND_RED } from "../../lib/shop/catalog";

export default function ProductCard({ product }: { product: Product }) {
  const isOut = product.availability === "Out of Stock";

  return (
    
      <Link
        href={`/products/${product.id}`} // later you can make real product pages
        className="
          group relative block overflow-hidden 
        "
      >
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25 }}>
            <div className="rounded-sm
                border border-black/10 bg-white
                shadow-[0_10px_22px_rgba(0,0,0,0.06)]
                transition hover:-translate-y-[2px]
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                {!!product.tag && (
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-black">
                    {product.tag}
                    </span>
                )}

                <span
                    className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: isOut ? "#777" : BRAND_RED }}
                >
                    {product.availability}
                </span>
                </div>

                <div className="relative aspect-[4/5] w-full bg-[#f7f7f7]">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 transition duration-300 group-hover:scale-[1.04]"
                    sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 95vw"
                />
                </div>
            </div>
        </motion.div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black">{product.name}</p>
              <p className="mt-0.5 text-xs text-black/55">
                {product.fit ? `${product.fit} · ` : ""}
                {product.colors?.[0] ?? "BLTDIF"}
              </p>
            </div>
            <p className="text-sm font-semibold text-black">${product.price}</p>
          </div>

          {product.sizes?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 5).map((s) => (
                <span key={s} className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[11px] text-black/70">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-2 h-[22px]" />
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.22em] uppercase text-black/45">View</span>
            <span className="h-[2px] w-10 bg-black/15 transition-all duration-300 group-hover:w-16 group-hover:bg-[#CE0028]" />
          </div>
        </div>

        {isOut && <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />}
      </Link>
    
  );
}
