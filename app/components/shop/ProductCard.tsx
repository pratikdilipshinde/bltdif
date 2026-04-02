"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "../../lib/shop/types";
import { BRAND_RED } from "../../lib/shop/catalog";

export default function ProductCard({ product }: { product: Product }) {
  const isOut = !product.availability;

  return (
    <Link
      href={`/products/${product.sku}`} // ✅ use SKU (important)
      className="group relative block overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
      >
        <div
          className="
            rounded-xs
            border border-black/5 bg-[#f1f1f3]
            shadow
            transition hover:-translate-y-[2px]
            hover:drop-shadow-md
          "
        >
          {/* Availability Badge */}
          <div className="absolute left-3 top-3 z-10 bg-[#f1f1f3]">
            <span
              className="rounded-xs bg-white/95 px-2.5 py-1 text-[9px] md:text-[10px] font-medium tracking-[0.18em] uppercase"
              style={{ color: isOut ? "#777" : BRAND_RED }}
            >
              {isOut ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2 transition duration-300 group-hover:scale-[1.04]"
              sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 95vw"
            />
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">
                  {product.name}
                </p>

                <p className="mt-0.5 text-xs text-black/55">
                  {product.type} · BLTDIF
                </p>
              </div>

              <p className="text-sm font-semibold text-black">
                ₹{product.price}
              </p>
            </div>

            {/* View CTA */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] tracking-[0.22em] uppercase text-black/45">
                View
              </span>

              <span className="h-[2px] w-10 bg-black/15 transition-all duration-300 group-hover:w-16 group-hover:bg-[#CE0028]" />
            </div>
          </div>

          {/* Disabled Overlay */}
          {isOut && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
          )}
        </div>
      </motion.div>
    </Link>
  );
}