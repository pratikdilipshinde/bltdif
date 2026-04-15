"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "../../lib/shop/types";

const BRAND_RED = "#CE0028";

export default function ProductCard({ product }: { product: Product }) {
  const isOut = !product.availability;

  return (
    <Link
      href={`/products/${product.sku}`}
      className="group block"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative"
      >
        {/* Card */}
        <div
          className="
            relative overflow-hidden
            rounded-sm
            bg-white
            border border-black/5
            shadow-sm
            transition-all duration-300
            group-hover:-translate-y-1.5
            group-hover:shadow-xl
          "
        >
          {/* Badge */}
          <div className="absolute left-4 top-4 z-10">
            <span
              className="
                rounded-full
                bg-white/90 backdrop-blur
                px-3 py-1
                text-[10px] tracking-[0.2em] uppercase
                font-medium
                border border-black/10
              "
              style={{ color: isOut ? "#888" : BRAND_RED }}
            >
              {isOut ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-[#f1f1f3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="
                object-contain p-1
                transition duration-500 ease-out
                group-hover:scale-[1.05]
              "
              sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 95vw"
            />

            {/* Premium gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-black">
                  {product.name}
                </p>

                <p className="mt-1 text-xs tracking-wide text-black/50">
                  {product.type}
                </p>
              </div>

              <p className="text-[15px] font-semibold text-black">
                ₹{product.price}
              </p>
            </div>

            {/* Premium CTA */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] tracking-[0.25em] uppercase text-black/40">
                Explore
              </span>

              <div className="flex items-center gap-2">
                <span className="h-[1px] w-8 bg-black/20 transition-all duration-300 group-hover:w-14 group-hover:bg-[#CE0028]" />
                <span className="text-xs text-black/40 transition group-hover:text-[#CE0028]">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Disabled Overlay */}
          {isOut && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
          )}
        </div>
      </motion.div>
    </Link>
  );
}