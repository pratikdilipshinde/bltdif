
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Truck, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "@/app/context/CartContext";
import type { CatalogProduct } from "@/app/lib/shop-v2/catalog-types";
import { createCartItem } from "@/app/lib/shop-v2/createCartItem";
import { formatPrice } from "@/app/lib/shop-v2/formatPrice";
import { metaPixelEvent } from "@/app/lib/metaPixel";
import ProductCard from "./ProductCard";
import AnnouncementBar from "../AnnouncementBar";

type Props = {
  product: CatalogProduct;
  similarProducts: CatalogProduct[];
};

type FlyingItem = {
  id: number;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

function toBullets(value: string | null | undefined): string[] {
  if (!value) return [];

  return value
    .split("\n")
    .map((item) => item.replace(/^\s*(?:[-*•]+|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

export default function ProductDetailPage({
  product,
  similarProducts,
}: Props) {
  const { addToCart } = useCart();

  const galleryRef = useRef<HTMLDivElement>(null);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const flightIdRef = useRef(0);

  const [flyingItem, setFlyingItem] = useState<FlyingItem | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(
    product.default_variant
  );

  // Derive the gallery from the current product.
  const images = useMemo(() => {
    const productImages = product.images?.length
      ? product.images.map((img) => img.image_url)
      : [product.image];

    return productImages.filter(
      (src): src is string => typeof src === "string" && src.length > 0
    );
  }, [product.images, product.image]);

  const safeActiveIdx = Math.min(
    Math.max(activeIdx, 0),
    Math.max(images.length - 1, 0)
  );

  const activeImage = images[safeActiveIdx] ?? product.image;

  // MOBILE PHOTO SWIPE
  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;

      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    },
    []
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchStartX.current === null || touchStartY.current === null) {
        return;
      }

      const touch = event.changedTouches[0];

      if (!touch) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Handle deliberate horizontal gestures without blocking vertical scroll.
      if (
        Math.abs(deltaX) >= 45 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2 &&
        images.length > 1
      ) {
        if (deltaX < 0) {
          setActiveIdx((current) =>
            Math.min(current + 1, images.length - 1)
          );
        } else {
          setActiveIdx((current) => Math.max(current - 1, 0));
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    },
    [images.length]
  );

  const showSizeGuide =
    product.category_code === "tshirts" ||
    product.category_code === "t-shirts" ||
    product.category_name?.toLowerCase().includes("t-shirt") ||
    product.product_type?.toLowerCase().includes("t-shirt");

  const price = selectedVariant?.price ?? product.base_price;

  const compareAtPrice =
    selectedVariant?.compare_at_price ?? product.compare_at_price;

  const maxQty = Math.max(
    0,
    selectedVariant?.available_quantity ?? 99
  );

  const isOut =
    product.variants.length > 0
      ? !selectedVariant?.in_stock
      : !product.availability;

  const featureList = useMemo(
    () => toBullets(product.features),
    [product.features]
  );

  const materialList = useMemo(
    () => toBullets(product.material),
    [product.material]
  );

  const careList = useMemo(
    () => toBullets(product.care_guide),
    [product.care_guide]
  );

  const variants = useMemo(
    () =>
      [...product.variants].sort(
        (a, b) => (a.size_id ?? 999) - (b.size_id ?? 999)
      ),
    [product.variants]
  );

  const infoSections = useMemo(
    () => [
      {
        key: "features",
        title: "Product details",
        items: featureList,
        empty: "No additional product details available.",
      },
      {
        key: "material",
        title: "Material",
        items: materialList,
        empty: "No material information available.",
      },
      {
        key: "care",
        title: "Care instructions",
        items: careList,
        empty: "No care information available.",
      },
    ],
    [featureList, materialList, careList]
  );

  // ADD TO CART + FLYING PRODUCT ANIMATION
  const handleAddToCart = useCallback(() => {
    if (isOut || qty < 1 || qty > maxQty) return;

    const button = addToCartButtonRef.current;
    const cartIcon = document.querySelector<HTMLElement>(
      '[data-cart-icon="true"]'
    );

    // Capture positions before updating the cart.
    if (button && cartIcon) {
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      setFlyingItem({
        id: ++flightIdRef.current,
        image: activeImage,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      });
    }

    addToCart(createCartItem(product, selectedVariant, qty));

    metaPixelEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: Number(price) * qty,
      currency: "INR",
    });

    toast.success("Added to cart 🛒", {
      style: {
        background: "rgba(255, 255, 255, 0.18)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.55)",
        borderRadius: "16px",
        color: "#111",
        padding: "12px 18px",
        fontSize: "13px",
        fontWeight: "500",
        boxShadow:
          "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      duration: 2500,
    });
  }, [
    activeImage,
    addToCart,
    isOut,
    maxQty,
    price,
    product,
    qty,
    selectedVariant,
  ]);

  const handleBuyNow = useCallback(() => {
    if (isOut || qty < 1 || qty > maxQty) return;

    addToCart(createCartItem(product, selectedVariant, qty));
    window.location.href = "/checkout";
  }, [addToCart, isOut, maxQty, product, qty, selectedVariant]);

  return (
    <>
      <AnnouncementBar />

      {/* FLYING PRODUCT IMAGE */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            key={flyingItem.id}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: flyingItem.endX - flyingItem.startX,
              y: flyingItem.endY - flyingItem.startY,
              scale: 0.18,
              opacity: 0.2,
              rotate: 12,
            }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              setFlyingItem((current) =>
                current?.id === flyingItem.id ? null : current
              );
            }}
            style={{
              position: "fixed",
              left: flyingItem.startX - 25,
              top: flyingItem.startY - 32,
              width: 50,
              height: 64,
              zIndex: 99999,
              pointerEvents: "none",
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
            className="overflow-hidden rounded-md border border-white/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          >
            <Image
              src={flyingItem.image}
              alt=""
              fill
              sizes="50px"
              className="object-cover"
              loading="eager"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="min-h-screen w-full overflow-x-clip bg-[#eeeeee] pt-15 text-black md:pt-22">
        <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-5 md:px-8 lg:px-10 xl:px-14">
          {/* BREADCRUMB */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-2 overflow-hidden text-[10px] uppercase tracking-[0.12em] text-black/45 sm:text-xs"
          >
            <Link href="/" className="shrink-0 hover:text-black">
              Home
            </Link>

            <span>/</span>

            <Link
              href="/products/t-shirts"
              className="truncate hover:text-black"
            >
              {product.category_name}
            </Link>

            <span>/</span>

            <span className="truncate text-black/70">{product.name}</span>
          </nav>

          {/* PRODUCT LAYOUT */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,0.95fr)] lg:items-stretch lg:gap-3 xl:gap-4">
            {/* LEFT COLUMN: MAIN IMAGE + MOBILE THUMBNAILS */}
            <div className="min-w-0">
              <div
                className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-md bg-[#e8e3df]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${safeActiveIdx}-${activeImage}`}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      priority={safeActiveIdx === 0}
                      loading={safeActiveIdx === 0 ? "eager" : "lazy"}
                      fetchPriority={safeActiveIdx === 0 ? "high" : "auto"}
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      className="object-cover"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* MOBILE PHOTO COUNTER */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-3 py-1 text-[10px] text-white backdrop-blur-sm lg:hidden">
                    {safeActiveIdx + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* MOBILE / TABLET THUMBNAILS */}
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
                {images.map((src, i) => (
                  <button
                    key={`${src}-mobile-${i}`}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`View product photo ${i + 1}`}
                    aria-pressed={safeActiveIdx === i}
                    className={`relative h-[76px] w-[64px] shrink-0 overflow-hidden rounded-sm border bg-white transition sm:h-[88px] sm:w-[74px] ${
                      safeActiveIdx === i
                        ? "border-black"
                        : "border-black/10 opacity-75"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} photo ${i + 1}`}
                      fill
                      sizes="(min-width: 640px) 74px, 64px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* MIDDLE COLUMN: DESKTOP IMAGE SCROLL CONTAINER */}
            <div
              ref={galleryRef}
              id="product-image-gallery"
              className="hidden min-w-0 flex-col gap-4 lg:flex lg:h-[calc(100vh-140px)] lg:max-h-[850px] lg:min-h-[550px] lg:overscroll-contain lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {images.slice(1).map((src, index) => {
                const i = index + 1;

                return (
                  <button
                    key={`${src}-desktop-${i}`}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`View product photo ${i + 1}`}
                    aria-pressed={safeActiveIdx === i}
                    className="relative block aspect-[4/5] w-full shrink-0 overflow-hidden rounded-md bg-[#e8e3df] transition hover:opacity-90"
                  >
                    <Image
                      src={src}
                      alt={`${product.name} photo ${i + 1}`}
                      fill
                      sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 32vw, 100vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </button>
                  );
                })}
            </div>

            {/* RIGHT COLUMN: PRODUCT DETAILS */}
            <div className="min-w-0 lg:sticky lg:top-6">
              {/* PRODUCT NAME + PRICE — LIQUID GLASS */}
              <div className="group/info relative isolate overflow-hidden rounded-[15px] border border-white/60 bg-white/[0.38] px-[13px] py-[12px] shadow-[0_4px_16px_rgba(30,50,65,0.06),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-out hover:bg-white/[0.46]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-white/65 via-white/10 to-sky-100/20"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[8%] top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/20"
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="truncate text-[18px] font-semibold leading-[1.15] tracking-[-0.02em] text-black">
                      {product.name}
                    </h1>

                    <p className="relative mt-[6px] truncate text-[10px] font-normal leading-none tracking-[0.01em] text-black/60">
                      {product.product_type ?? product.category_name}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[17px] font-semibold leading-none tracking-[-0.02em] text-black">
                      {formatPrice(price, product.currency_code)}
                    </p>

                    {compareAtPrice != null && compareAtPrice > price && (
                      <p className="mt-1 text-[10px] leading-none text-black/40 line-through">
                        {formatPrice(compareAtPrice, product.currency_code)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SIZE SELECTOR — LIQUID GLASS */}
              {variants.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium">Size</p>

                    {showSizeGuide && (
                      <button
                        type="button"
                        onClick={() => setShowSizeChart(true)}
                        className="cursor-pointer text-[10px] text-black/55 underline underline-offset-4"
                      >
                        Size guide
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {variants.map((variant) => {
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
                          className={`group/size relative isolate flex h-10 min-w-[56px] items-center justify-center overflow-hidden rounded-full border px-4 text-[11px] font-medium backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-out ${
                            active
                              ? "border-black bg-black text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                              : "border-white/60 bg-white/[0.30] text-black shadow-[0_3px_12px_rgba(30,50,65,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-black hover:bg-black hover:text-white"
                          } ${
                            !variant.in_stock
                              ? "cursor-not-allowed opacity-30"
                              : "cursor-pointer"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-opacity duration-300 ${
                              active
                                ? "opacity-0"
                                : "bg-gradient-to-br from-white/70 via-white/10 to-sky-100/20 opacity-100 group-hover/size:opacity-0"
                            }`}
                          />

                          <span className="relative block h-[1.2em] overflow-hidden">
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={variant.size_label ?? "One Size"}
                                initial={{ y: "-110%" }}
                                animate={{ y: "0%" }}
                                exit={{ y: "110%" }}
                                transition={{
                                  duration: 0.22,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="block whitespace-nowrap"
                              >
                                {variant.size_label ?? "One Size"}
                              </motion.span>
                            </AnimatePresence>

                            <motion.span
                              aria-hidden="true"
                              initial={false}
                              animate={{ y: "110%" }}
                              whileHover={{ y: "0%" }}
                              className="pointer-events-none absolute inset-0 block whitespace-nowrap"
                            >
                              {variant.size_label ?? "One Size"}
                            </motion.span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUANTITY + PURCHASE BUTTONS */}
              <div className="mt-4 grid grid-cols-[110px_minmax(0,1fr)_98px] items-center gap-2">
                {/* QUANTITY CONTROL */}
                <div className="relative isolate flex h-11 items-center justify-between overflow-hidden rounded-full border border-white/70 bg-white/[0.38] px-2 shadow-[0_4px_16px_rgba(30,50,65,0.05),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl backdrop-saturate-150">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-white/65 via-white/10 to-sky-100/20"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[12%] top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
                  />

                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[14px] transition-colors hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="relative min-w-3 text-center text-[11px] font-medium">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    disabled={qty >= maxQty}
                    aria-label="Increase quantity"
                    className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[14px] transition-colors hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* ADD TO CART — LIQUID GLASS + FLY ANIMATION */}
                <motion.button
                  ref={addToCartButtonRef}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={isOut || maxQty < 1}
                  className="relative isolate flex h-11 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/[0.42] px-2 text-[11px] font-medium text-black shadow-[0_4px_16px_rgba(30,50,65,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-out hover:border-white/90 hover:bg-white/[0.68] hover:shadow-[0_6px_20px_rgba(30,50,65,0.08),inset_0_1px_1px_rgba(255,255,255,1)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-white/70 via-white/10 to-sky-100/20"
                  />

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[12%] top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
                  />

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ring-1 ring-inset ring-white/20"
                  />

                  <span className="relative whitespace-nowrap">
                    Add to cart
                  </span>
                </motion.button>

                {/* BUY NOW */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyNow}
                  disabled={isOut || maxQty < 1}
                  className="flex h-11 cursor-pointer items-center justify-center rounded-full bg-black px-2 text-[11px] font-medium text-white transition-colors duration-200 hover:bg-[#CE0028] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* DELIVERY BENEFITS */}
              <div className="mt-5 space-y-4 px-0.5">
                <div className="flex items-center gap-3 text-[#555]">
                  <Truck
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />
                  <span className="text-[12px]">Fast Shipping</span>
                </div>

                <div className="flex items-center gap-3 text-[#555]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="1.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                  </svg>

                  <span className="text-[12px]">
                    Easy Returns within 7 day
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#555]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16v12H4z" />
                    <path d="M4 8h16" />
                    <path d="m8 17 2.5 2.5L16 14" />
                  </svg>

                  <span className="text-[12px]">
                    Quality checked before dispatched
                  </span>
                </div>
              </div>

              {/* PRODUCT DETAILS ACCORDION — LIQUID GLASS */}
              <div className="group/accordion relative isolate mt-3 overflow-hidden rounded-[15px] border border-white/60 bg-white/[0.38] shadow-[0_4px_16px_rgba(30,50,65,0.06),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:bg-white/[0.46]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-white/65 via-white/10 to-sky-100/20"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[8%] top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/20"
                />

                {infoSections.map((item, i) => {
                  const isOpen = openInfo === item.key;

                  return (
                    <div
                      key={item.key}
                      className={`relative ${i ? "border-t border-white/50" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenInfo(isOpen ? null : item.key)
                        }
                        aria-expanded={isOpen}
                        className={`flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors duration-300 ${
                          isOpen
                            ? "bg-white/[0.18]"
                            : "hover:bg-white/[0.25]"
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black">
                          {item.title}
                        </span>

                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{
                            duration: 0.25,
                            ease: "easeInOut",
                          }}
                          className="flex shrink-0 items-center justify-center text-black/65"
                        >
                          <ChevronDown size={15} strokeWidth={1.7} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: {
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              },
                              opacity: { duration: 0.2 },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-3.5 pb-4 pt-1 text-[11px] leading-relaxed text-black/65">
                              {item.items.length > 0 ? (
                                <ul className="space-y-2">
                                  {item.items.map((text, j) => (
                                    <li
                                      key={`${item.key}-${j}`}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="mt-[2px] text-black/40">
                                        •
                                      </span>
                                      <span>{text}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>{item.empty}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIMILAR PRODUCTS */}
          {similarProducts.length > 0 && (
            <section className="mt-8 border-t border-black/[0.06] pt-5 sm:mt-10">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-sm font-semibold sm:text-base">
                  Similar Products
                </h2>

                <Link
                  href="/products/t-shirts"
                  className="text-[10px] text-black/55 underline underline-offset-4 hover:text-black sm:text-xs"
                >
                  View all
                </Link>
              </div>

              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:snap-none">
                {similarProducts.map((item) => (
                  <div
                    key={item.id}
                    className="w-[68%] min-w-[68%] shrink-0 snap-start sm:w-[42%] sm:min-w-[42%] lg:w-auto lg:min-w-0"
                  >
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIZE CHART MODAL */}
        <AnimatePresence>
          {showSizeChart && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeChart(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                onClick={(event) => event.stopPropagation()}
                className="relative max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#CE0028]">
                      BLTDIF
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      T-Shirt Size Guide
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSizeChart(false)}
                    aria-label="Close size guide"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xl text-white hover:bg-[#CE0028]"
                  >
                    ×
                  </button>
                </div>

                <Image
                  src="/images/TEE-SIZE-GUIDE.png"
                  alt="BLTDIF T-shirt size guide"
                  width={2048}
                  height={577}
                  loading="lazy"
                  sizes="(min-width: 768px) 90vw, 100vw"
                  className="hidden h-auto w-full object-contain md:block"
                />

                <Image
                  src="/images/TEE-SIZE-GUIDE-mobile.png"
                  alt="BLTDIF mobile T-shirt size guide"
                  width={1120}
                  height={1372}
                  loading="lazy"
                  sizes="(min-width: 768px) 90vw, 100vw"
                  className="block h-auto w-full object-contain md:hidden"
                />

                <p className="mt-3 text-center text-[10px] leading-relaxed text-black/45">
                  Measurements are approximate and may vary slightly.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
