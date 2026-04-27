"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "@/app/context/CartContext";
import type { CatalogProduct } from "@/app/lib/shop-v2/catalog-types";
import { createCartItem } from "@/app/lib/shop-v2/createCartItem";
import { formatPrice } from "@/app/lib/shop-v2/formatPrice";
import ProductCard from "./ProductCard";

type Props = {
  product: CatalogProduct;
  similarProducts: CatalogProduct[];
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
    if (product.images?.length) {
      return product.images.map((img) => img.image_url);
    }

    return [product.image].filter(Boolean);
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [qty, setQty] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.default_variant
  );

  const isFirstImage = activeIdx === 0;
  const isLastImage = activeIdx === images.length - 1;

  const showSizeGuide =
    product.category_code === "tshirts" ||
    product.category_code === "t-shirts" ||
    product.category_name?.toLowerCase().includes("t-shirt") ||
    product.product_type?.toLowerCase().includes("t-shirt");

  const goToImage = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= images.length || nextIdx === activeIdx) {
      return;
    }

    setDirection(nextIdx > activeIdx ? 1 : -1);
    setActiveIdx(nextIdx);
  };

  const goNext = () => goToImage(activeIdx + 1);
  const goPrev = () => goToImage(activeIdx - 1);

  const price = selectedVariant?.price ?? product.base_price;

  const compareAtPrice =
    selectedVariant?.compare_at_price ?? product.compare_at_price;

  const maxQty = selectedVariant?.available_quantity ?? 99;

  const isOut =
    product.variants.length > 0
      ? !selectedVariant?.in_stock
      : !product.availability;

  const featureList = toBullets(product.features);
  const materialList = toBullets(product.material);
  const careList = toBullets(product.care_guide);
  const deliveryList = toBullets(product.delivery_info);

  const handleAddToCart = () => {
    if (isOut) return;

    addToCart(createCartItem(product, selectedVariant, qty));

    toast.success("Added to cart 🛒", {
      style: {
        border: "1px solid #000",
        padding: "12px 16px",
        fontSize: "13px",
      },
    });
  };

  return (
    <section className="w-full overflow-x-hidden bg-white">
      {/* HERO SECTION */}
      {/* <div className="relative -mt-[56px] h-[260px] w-full overflow-hidden md:-mt-[72px] md:h-[380px]">
        <Image
          src="/images/supportive-bg.jpg"
          alt={product.name}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 flex min-w-0 flex-col items-center justify-center px-4 pt-[56px] text-center text-white md:pt-[72px]">
          <p className="max-w-full text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-xs md:tracking-[0.28em]">
            BLTDIF <span className="font-bold text-[#CE0028]">·</span>{" "}
            {product.category_name}
          </p>

          <h1 className="mt-3 max-w-full break-words px-2 text-2xl font-semibold leading-tight sm:text-3xl md:max-w-4xl md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-3 text-sm text-white/75">
            {product.product_type ?? product.category_name}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <p className="text-xl font-semibold text-white md:text-2xl">
              {formatPrice(price, product.currency_code)}
            </p>

            {compareAtPrice && compareAtPrice > price && (
              <p className="text-sm text-white/50 line-through md:text-base">
                {formatPrice(compareAtPrice, product.currency_code)}
              </p>
            )}
          </div>
        </div>
      </div> */}

      {/* MAIN CONTENT */}
      <div className="mx-auto w-full max-w-[1800px] overflow-x-hidden px-4 py-6 sm:px-5 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        {/* Breadcrumb */}
        <div className="min-w-0 break-words text-[10px] uppercase tracking-[0.18em] text-black/50 sm:text-xs sm:tracking-[0.22em]">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>

          <span className="mx-2">›</span>

          <Link
            href={`/products/${product.category_code}`}
            className="transition hover:text-black"
          >
            {product.category_name}
          </Link>
        </div>

        <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-8 xl:gap-10">
          {/* IMAGE GALLERY */}
          <div className="w-full min-w-0 overflow-hidden">
            <div className="relative w-full min-w-0 overflow-hidden rounded-xs border border-black/10 bg-[#f1f1f3]">
              <div
                className="
                  relative aspect-square w-full min-w-0 overflow-hidden
                  max-h-[520px]
                  sm:max-h-[620px]
                  md:max-h-[720px]
                  lg:max-h-[760px]
                  xl:max-h-[820px]
                  2xl:max-h-[900px]
                "
              >
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  <motion.div
                    key={activeIdx}
                    custom={direction}
                    initial={{ x: direction > 0 ? "100%" : "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: direction > 0 ? "-100%" : "100%" }}
                    transition={{
                      x: { type: "spring", stiffness: 420, damping: 38 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                      const swipeDistance = 60;

                      if (info.offset.x < -swipeDistance && !isLastImage) {
                        goNext();
                      }

                      if (info.offset.x > swipeDistance && !isFirstImage) {
                        goPrev();
                      }
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  >
                    <Image
                      src={images[activeIdx] ?? product.image}
                      alt={product.name}
                      fill
                      priority
                      sizes="(min-width: 1536px) 45vw, (min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    disabled={isFirstImage}
                    onClick={goPrev}
                    className={`
                      absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2
                      items-center justify-center rounded-full
                      text-xl leading-none text-white backdrop-blur-md transition
                      sm:left-4 sm:h-11 sm:w-11 sm:text-2xl
                      ${
                        isFirstImage
                          ? "cursor-not-allowed bg-black/20 opacity-35"
                          : "bg-black/65 hover:bg-black"
                      }
                    `}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    disabled={isLastImage}
                    onClick={goNext}
                    className={`
                      absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2
                      items-center justify-center rounded-full
                      text-xl leading-none text-white backdrop-blur-md transition
                      sm:right-4 sm:h-11 sm:w-11 sm:text-2xl
                      ${
                        isLastImage
                          ? "cursor-not-allowed bg-black/20 opacity-35"
                          : "bg-black/65 hover:bg-black"
                      }
                    `}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex w-full max-w-full gap-3 overflow-x-auto overflow-y-hidden pb-2">
                {images.map((src, i) => {
                  const active = i === activeIdx;

                  return (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => goToImage(i)}
                      className="flex flex-none flex-col items-center"
                      aria-label={`View image ${i + 1}`}
                    >
                      <div
                        className={`
                          relative h-16 w-16 overflow-hidden rounded-xs border bg-[#f1f1f3]
                          sm:h-20 sm:w-20 md:h-24 md:w-24
                          ${
                            active
                              ? "border-black"
                              : "border-black/10 hover:border-black/30"
                          }
                        `}
                      >
                        <Image
                          src={src}
                          alt={`${product.name} ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <span
                        className={`
                          mt-1 h-[2px] bg-[#CE0028] transition-all duration-300
                          ${active ? "w-full opacity-100" : "w-0 opacity-0"}
                        `}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="w-full min-w-0 overflow-hidden">
            <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-black/50 sm:text-xs md:tracking-[0.28em]">
                  BLTDIF <span className="font-bold text-[#CE0028]">·</span>{" "}
                  {/* {product.category_name} */}
                </p>

                <h1 className="mt-2 max-w-full break-words text-2xl font-semibold leading-tight text-black sm:text-3xl md:text-4xl">
                  {product.name}
                </h1>

                <p className="mt-2 text-sm text-black/50">
                  {product.product_type ?? product.category_name}
                </p>
              </div>

              <div className="min-w-0 shrink-0 text-left md:text-right">
                <p className="text-xs text-black/55">
                  {isOut ? "Out of Stock" : "In Stock"}
                </p>

                <p className="mt-1 whitespace-nowrap text-2xl font-semibold text-black md:text-3xl">
                  {formatPrice(price, product.currency_code)}
                </p>

                {compareAtPrice && compareAtPrice > price && (
                  <p className="mt-1 text-sm text-black/35 line-through">
                    {formatPrice(compareAtPrice, product.currency_code)}
                  </p>
                )}
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-black/65">
              {product.description ||
                "Premium build and elevated everyday wear."}
            </p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mt-7">
                <div className="flex min-w-0 items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/50">
                    Select Size
                  </p>

                  {showSizeGuide && (
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="
                        relative shrink-0 text-xs font-semibold uppercase tracking-[0.16em]
                        text-[#CE0028]
                        after:absolute after:left-0 after:-bottom-[2px]
                        after:h-[1px] after:w-0 after:bg-[#CE0028]
                        after:transition-all after:duration-300
                        hover:after:w-full
                      "
                    >
                      Size Chart
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[...product.variants]
                    .sort((a, b) => {
                      const aOrder = a.size_id ?? 999;
                      const bOrder = b.size_id ?? 999;
                      return aOrder - bOrder;
                    })
                    .map((variant) => {
                      const active = selectedVariant?.id === variant.id;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          disabled={!variant.in_stock}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setQty(1);
                          }}
                          className={`rounded-xs border px-4 py-2 text-sm font-semibold transition ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-black/10 bg-white text-black hover:border-black/30"
                          } ${
                            !variant.in_stock
                              ? "cursor-not-allowed opacity-35"
                              : "cursor-pointer"
                          }`}
                        >
                          {variant.size_label ?? "One Size"}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-full items-center justify-between rounded-xs border border-black/10 bg-white px-3 py-2 sm:w-[180px]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="rounded-xs p-2 transition hover:bg-black/5"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4 cursor-pointer text-black" />
                </button>

                <span className="text-sm font-semibold text-black">{qty}</span>

                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="rounded-xs p-2 transition hover:bg-black/5"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4 cursor-pointer text-black" />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: isOut ? 0 : -1 }}
                className={`w-full rounded-xs px-6 py-3 text-sm font-semibold transition sm:flex-1 ${
                  isOut
                    ? "cursor-not-allowed bg-black/15 text-black/35"
                    : "cursor-pointer bg-black text-white drop-shadow-md hover:bg-[#CE0028]"
                }`}
                onClick={handleAddToCart}
                disabled={isOut}
              >
                {isOut ? "Out of Stock" : "Add to cart"}
              </motion.button>
            </div>

            {/* Service Info */}
            <div className="mt-7 grid gap-3 rounded-xs border border-black/10 bg-white p-5">
              <div className="flex min-w-0 items-center gap-3 text-sm text-black/70">
                <Truck className="h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">
                  Fast shipping + premium packaging
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-3 text-sm text-black/70">
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">
                  Easy returns within 7 days
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-3 text-sm text-black/70">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">
                  Quality checked before dispatch
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS CARDS */}
        <div className="mt-12 grid min-w-0 grid-cols-1 gap-6 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {/* <div className="min-w-0 rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
              Description
            </p>

            <p className="mt-3 break-words text-sm leading-relaxed text-black/65">
              {product.description || "No description available."}
            </p>
          </div> */}

          <div className="min-w-0 rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
              Material
            </p>

            <ul className="mt-3 space-y-2 text-sm text-black/65">
              {materialList.length ? (
                materialList.map((item) => (
                  <li key={item} className="break-words">
                    • {item}
                  </li>
                ))
              ) : (
                <li>• No material information available</li>
              )}
            </ul>
          </div>

          <div className="min-w-0 rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
              Care
            </p>

            <ul className="mt-3 space-y-2 text-sm text-black/65">
              {careList.map((item) => (
                <li key={`care-${item}`} className="break-words">
                  • {item}
                </li>
              ))}

              {!careList.length && (
                <li>• No delivery information available</li>
              )}
            </ul>
          </div>

          <div className="min-w-0 rounded-xs border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
              Delivery
            </p>

            <ul className="mt-3 space-y-2 text-sm text-black/65">
              

              {deliveryList.map((item) => (
                <li key={`delivery-${item}`} className="break-words">
                  • {item}
                </li>
              ))}

              {!deliveryList.length && (
                <li>• No delivery information available</li>
              )}
            </ul>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="mt-14 w-full min-w-0 overflow-hidden">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.28em] text-black/50">
                  More like this
                </p>

                <h2 className="mt-2 break-words text-2xl font-semibold text-black md:text-3xl">
                  Similar products
                </h2>
              </div>

              {/* <Link
                href={`/products/${product.category_code}`}
                className="w-full rounded-xs border border-black/10 px-5 py-2 text-center text-sm font-semibold text-black transition hover:bg-black/[0.03] sm:w-auto"
              >
                View category
              </Link> */}
            </div>

            <div className="mt-6 grid min-w-0 grid-cols-1 gap-7 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-9 2xl:gap-10">
              {similarProducts.map((product) => (
                <div key={product.id} className="w-full min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SIZE CHART MODAL */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div
            className="fixed inset-0 z-[9999] flex w-full items-center justify-center overflow-x-hidden bg-black/70 px-3 backdrop-blur-sm sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeChart(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-black/10 px-4 py-4 md:px-7">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#CE0028]">
                    BLTDIF
                  </p>

                  <h3 className="mt-1 break-words text-lg font-semibold text-black md:text-2xl">
                    T-Shirt Size Guide
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSizeChart(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xl leading-none text-white transition hover:bg-[#CE0028] md:h-10 md:w-10"
                  aria-label="Close size chart"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[78vh] overflow-auto bg-white p-3">
                <Image
                  src="/images/TEE-SIZE-GUIDE.png"
                  alt="BLTDIF T-Shirt Size Guide"
                  width={2048}
                  height={577}
                  className="h-auto w-full rounded-xl object-contain"
                  priority
                />

                <p className="mt-2 text-center text-xs leading-relaxed text-black/50">
                  Measurements are approximate and may vary slightly due to
                  garment construction and fabric behavior.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}