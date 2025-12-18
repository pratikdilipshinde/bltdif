"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";

import type { Product } from "../../lib/shop/types";
import { BRAND_RED, PRODUCTS } from "../../lib/shop/catalog";

type Props = {
  product: Product;
};

export default function ProductDetailPage({ product }: Props) {
  const images = useMemo(() => {
    // If you later add product.images[], it will use that.
    const anyP = product as any;
    if (Array.isArray(anyP.images) && anyP.images.length) return anyP.images as string[];
    return [product.image].filter(Boolean);
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] ?? ""
  );

  const similar = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 10);
  }, [product]);

  return (
    <section className="bg-white px-4 py-8 md:py-8">
      <div className="">
        {/* Breadcrumb */}
        <div className="text-xs tracking-[0.22em] uppercase text-black/50">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>{" "}
          <span className="mx-2">›</span>
          <Link href={`/${product.category}`} className="hover:text-black transition">
            {product.category}
          </Link>{" "}
          <span className="mx-2">›</span>
          <span className="text-black/80">{product.name}</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-6">
          {/* LEFT: Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-xs border border-black/10 bg-[#f7f7f7]">
              <div className="absolute left-4 top-4 z-10">
                {product.tag ? (
                  <span className="rounded-xs bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-black shadow">
                    {product.tag}
                  </span>
                ) : null}
              </div>

              <motion.div
                key={images[activeIdx]}
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[360px] w-full md:h-[520px]"
              >
                <Image
                  src={images[activeIdx]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-6 md:p-10 drop-shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                />
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((src, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={src + i}
                    onClick={() => setActiveIdx(i)}
                    className={`
                      relative h-20 w-20 flex-none overflow-hidden rounded-xs border bg-[#f7f7f7]
                      ${active ? "border-black/30" : "border-black/10 hover:border-black/20"}
                    `}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-contain p-2" />
                    {active && (
                      <span
                        className="absolute inset-x-3 bottom-2 h-[2px] rounded-xs"
                        style={{ backgroundColor: BRAND_RED }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.28em] uppercase text-black/50">
                  BLTDIF <span className="text-[#CE0028] font-bold">·</span> {product.category}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-black md:text-4xl">
                  {product.name}
                </h1>
              </div>

              <div className="text-right mt-2">
                <p className="text-3xl font-semibold text-black">${product.price}</p>
                <p className="mt-1 text-xs text-black/55">{product.availability ?? "In Stock"}</p>
              </div>
            </div>

            {/* Mini specs row */}
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-black/70">
              {product.fit ? (
                <span className="rounded-xs border border-black/10 bg-black/[0.03] px-3 py-1">
                  Fit: {product.fit}
                </span>
              ) : null}
              {product.colors?.length ? (
                <span className="rounded-xs border border-black/10 bg-black/[0.03] px-3 py-1">
                  Colors: {product.colors.join(", ")}
                </span>
              ) : null}
              {product.sizes?.length ? (
                <span className="rounded-xs border border-black/10 bg-black/[0.03] px-3 py-1">
                  Sizes: {product.sizes.join(", ")}
                </span>
              ) : null}
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-black/65">
              Premium build, clean silhouette, and a finish that feels expensive. Built for the ones who move different.
            </p>

            {/* Size */}
            {product.sizes?.length ? (
              <div className="mt-6">
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-black/55">
                  Size
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`
                          rounded-xs px-4 py-2 cursor-pointer text-sm font-semibold transition
                          ${active ? "text-white" : "text-black"}
                          border border-black/10 hover:border-black/20
                        `}
                        style={{
                          background: active ? "black" : "transparent",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Qty + Add to cart */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center justify-between rounded-xs border border-black/10 bg-white px-3 py-2 sm:w-[180px]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="rounded-xs p-2 hover:bg-black/5 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 text-black cursor-pointer" />
                </button>

                <span className="text-sm font-semibold text-black">{qty}</span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="rounded-xs p-2 hover:bg-black/5 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 text-black cursor-pointer" />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                className="w-full rounded-xs px-6 py-3 text-sm cursor-pointer font-semibold text-white drop-shadow-md sm:flex-1"
                style={{ background: `black` }}
                onClick={() => {
                  // UI-only for now (you'll wire this to CartContext later)
                  console.log("Add to cart:", { product, qty, selectedSize });
                }}
              >
                Add to cart
              </motion.button>

              <button className="w-full rounded-xs border cursor-pointer border-black/10 px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.03] transition sm:w-auto">
                Buy now
              </button>
            </div>

            {/* Service bullets */}
            <div className="mt-7 grid gap-3 rounded-xs border border-black/10 bg-white p-5">
              <div className="flex items-center gap-3 text-sm text-black/70">
                <Truck className="h-4 w-4" />
                <span>Fast shipping + premium packaging</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-black/70">
                <RotateCcw className="h-4 w-4" />
                <span>Easy returns within 7 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-black/70">
                <ShieldCheck className="h-4 w-4" />
                <span>Quality checked before dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.26em] uppercase text-[#CE0028]">
              Description
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">
              Designed with premium fabric and built for daily wear. Clean branding, modern fit, and a feel that lasts.
            </p>
          </div>

          <div className="rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.26em] uppercase text-[#CE0028]">
              Material & Fit
            </p>
            <ul className="mt-3 space-y-2 text-sm text-black/65">
              <li>• Premium cotton blend</li>
              <li>• Pre-shrunk finishing</li>
              <li>• {product.fit ? `${product.fit} fit` : "Modern relaxed fit"}</li>
            </ul>
          </div>

          <div className="rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.26em] uppercase text-[#CE0028]">
              Care
            </p>
            <ul className="mt-3 space-y-2 text-sm text-black/65">
              <li>• Machine wash cold</li>
              <li>• Do not bleach</li>
              <li>• Dry low / air dry</li>
            </ul>
          </div>
        </div>

        {/* Similar products */}
        {similar.length ? (
          <div className="mt-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.28em] text-black/50 uppercase">
                  More like this
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-black">
                  Similar products
                </h2>
              </div>

              <Link
                href={`/${product.category}`}
                className="rounded-xs border border-black/10 px-5 py-2 text-sm font-semibold text-black hover:bg-black/[0.03] transition"
              >
                View category
              </Link>
            </div>

            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
              {similar.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group relative w-[220px] flex-none overflow-hidden rounded-xs border border-black/10 bg-[#f7f7f7] p-4 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] transition"
                >
                  <div className="absolute left-3 top-3 rounded-xs bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-black">
                    {p.tag ?? "BLTDIF"}
                  </div>

                  <div className="relative h-44 w-full">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain drop-shadow-[0_16px_35px_rgba(0,0,0,0.20)] transition duration-300 group-hover:scale-[1.06]"
                    />
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">{p.name}</p>
                      <p className="mt-1 text-xs text-black/55">Premium fit · BLTDIF</p>
                    </div>
                    <p className="text-sm font-semibold text-black">${p.price}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs tracking-[0.22em] uppercase text-black/45">
                      View
                    </span>
                    <span
                      className="h-[2px] w-10 bg-black/15 transition duration-300 group-hover:w-16"
                      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
