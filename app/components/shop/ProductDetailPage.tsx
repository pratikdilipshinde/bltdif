"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

import type { Product } from "../../lib/shop/types";

type ProductDetail = Product & {
  images?: string[];
};

type Props = {
  product: ProductDetail;
  similarProducts: ProductDetail[];
};

function toBullets(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split("\n")
    .map((item) => item.replace(/^\*\s?/, "").trim())
    .filter(Boolean);
}

export default function ProductDetailPage({
  product,
  similarProducts,
}: Props) {
  const { addToCart } = useCart();

  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length) {
      return product.images;
    }
    return [product.image].filter(Boolean);
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const featureList = toBullets(product.features);
  const materialList = toBullets(product.material);
  const careList = toBullets(product.care_guide);
  const deliveryList = toBullets(product.delivery);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: String(product.id ?? product.sku),
        name: product.name,
        price: Number(product.price),
        image: product.image,
      });
    }
  };

  return (
    <section className="bg-white">
      {/* HERO SECTION */}
      <div className="relative -mt-[56px] h-[300px] w-full md:-mt-[72px] md:h-[380px]">
        <Image
          src="/images/supportive-bg.jpg"
          alt={product.name}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[56px] text-center text-white md:pt-[72px]">
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">
            BLTDIF <span className="font-bold text-[#CE0028]">·</span>{" "}
            {product.category}
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-white/75">{product.sku}</p>
          <p className="mt-4 text-xl font-semibold text-white md:text-2xl">
            ₹{product.price}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-4 py-8 md:py-10">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-black/50">
            <Link href="/" className="transition hover:text-black">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${product.category.toLowerCase()}s`}
              className="transition hover:text-black"
            >
              {product.category}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-black/80">{product.name}</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-6">
            <div>
              <div className="relative overflow-hidden rounded-xs border border-black/10 bg-[#f1f1f3]">
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
                    className="object-contain p-6 md:p-10"
                  />
                </motion.div>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((src, i) => {
                  const active = i === activeIdx;
                  return (
                    <button
                      key={`${src}-${i}`}
                      onClick={() => setActiveIdx(i)}
                      className={`relative h-20 w-20 flex-none overflow-hidden rounded-xs border bg-[#f7f7f7] ${
                        active
                          ? "border-black/30"
                          : "border-black/10 hover:border-black/20"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                      {active && (
                        <span className="absolute inset-x-3 bottom-2 h-[2px] rounded-xs bg-[#CE0028]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-black/50">
                    BLTDIF <span className="font-bold text-[#CE0028]">·</span>{" "}
                    {product.category}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-black md:text-4xl">
                    {product.name}
                  </h1>
                  <p className="mt-2 text-sm text-black/50">{product.type}</p>
                </div>

                <div className="mt-2 text-right">
                  <p className="text-3xl font-semibold text-black">
                    ₹{product.price}
                  </p>
                  <p className="mt-1 text-xs text-black/55">
                    {product.availability ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-black/65">
                {product.description || "Premium build and elevated everyday wear."}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center justify-between rounded-xs border border-black/10 bg-white px-3 py-2 sm:w-[180px]">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="rounded-xs p-2 transition hover:bg-black/5"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 cursor-pointer text-black" />
                  </button>

                  <span className="text-sm font-semibold text-black">{qty}</span>

                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="rounded-xs p-2 transition hover:bg-black/5"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 cursor-pointer text-black" />
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  className="w-full cursor-pointer rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white drop-shadow-md sm:flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.availability}
                >
                  Add to cart
                </motion.button>

                {/* <button
                  className="w-full cursor-pointer rounded-xs border border-black/10 px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.03] sm:w-auto"
                  disabled={!product.availability}
                >
                  Buy now
                </button> */}
              </div>

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

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            <div className="rounded-xs border border-black/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
                Description
              </p>
              <p className="mt-3 text-sm leading-relaxed text-black/65">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="rounded-xs border border-black/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
                Material
              </p>
              <ul className="mt-3 space-y-2 text-sm text-black/65">
                {materialList.length ? (
                  materialList.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No material information available</li>
                )}
              </ul>
            </div>

            <div className="rounded-xs border border-black/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
                Features
              </p>
              <ul className="mt-3 space-y-2 text-sm text-black/65">
                {featureList.length ? (
                  featureList.map((item) => <li key={item}>• {item}</li>)
                ) : (
                  <li>• No feature information available</li>
                )}
              </ul>
            </div>

            <div className="rounded-xs border border-black/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
                Care & Delivery
              </p>
              <ul className="mt-3 space-y-2 text-sm text-black/65">
                {careList.map((item) => (
                  <li key={`care-${item}`}>• {item}</li>
                ))}
                {deliveryList.map((item) => (
                  <li key={`delivery-${item}`}>• {item}</li>
                ))}
                {!careList.length && !deliveryList.length && (
                  <li>• No care or delivery information available</li>
                )}
              </ul>
            </div>
          </div>

          {similarProducts.length ? (
            <div className="mt-14">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-black/50">
                    More like this
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-black md:text-3xl">
                    Similar products
                  </h2>
                </div>

                <Link
                  href={`/${product.category.toLowerCase()}s`}
                  className="rounded-xs border border-black/10 px-5 py-2 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
                >
                  View category
                </Link>
              </div>

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                {similarProducts.map((p) => {
                  const isOut = !p.availability;

                  return (
                    <Link
                      key={p.id}
                      href={`/products/${p.sku}`}
                      className="group block w-[210px] flex-none"
                    >
                      <div
                        className="
                          relative overflow-hidden rounded-sm
                          border border-black/6 bg-white
                          shadow-[0_6px_22px_rgba(0,0,0,0.05)]
                          transition-all duration-300
                          group-hover:-translate-y-1
                          group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)]
                        "
                      >
                        {/* Badge */}
                        <div className="absolute left-3 top-3 z-10">
                          <span
                            className="rounded-full border border-black/10 bg-white/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] backdrop-blur"
                            style={{ color: isOut ? "#8a8a8a" : "#CE0028" }}
                          >
                            {isOut ? "Out" : "In Stock"}
                          </span>
                        </div>

                        {/* Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-[#f1f1f3]">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain p-4 transition duration-500 ease-out group-hover:scale-[1.05]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>

                        {/* Content */}
                        <div className="p-3.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-black">
                                {p.name}
                              </p>
                              <p className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-black/40">
                                {p.type}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-semibold text-black">
                              ₹{p.price}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.24em] text-black/40">
                              Explore
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="h-[1px] w-7 bg-black/20 transition-all duration-300 group-hover:w-12 group-hover:bg-[#CE0028]" />
                              <span className="text-[11px] text-black/35 transition-colors duration-300 group-hover:text-[#CE0028]">
                                →
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Out of stock overlay */}
                        {isOut && (
                          <div className="absolute inset-0 bg-white/65 backdrop-blur-[1.5px]" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}