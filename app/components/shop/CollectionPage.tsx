"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { getProductsByCategory } from "../../lib/shop/getProducts";
import type { Product } from "../../lib/shop/types";

type CategoryConfig = {
  key: string;
  label: string;
  heroImage: string;
  heroSubtitle: string;
};

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  caps: {
    key: "caps",
    label: "Caps",
    heroImage: "/images/cap-hero-img.png",
    heroSubtitle: "Built different. Worn daily.",
  },
  "t-shirts": {
    key: "t-shirts",
    label: "T-Shirts",
    heroImage: "/images/tshirts-hero-img.jpg",
    heroSubtitle: "New silhouettes arriving soon.",
  },
  hoodies: {
    key: "hoodies",
    label: "Hoodies",
    heroImage: "/images/hoodie-hero-img.png",
    heroSubtitle: "Heavyweight pieces landing soon.",
  },
};

import ProductCard from "./ProductCard";

export default function CollectionPage({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const config = CATEGORY_CONFIG[categorySlug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isComingSoon =
    categorySlug === "t-shirts" || categorySlug === "hoodies";

  useEffect(() => {
    async function loadProducts() {
      if (isComingSoon) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const categoryMap: Record<string, string> = {
        caps: "Cap",
        "t-shirts": "T-Shirt",
        hoodies: "Hoodie",
      };

      const dbCategory = categoryMap[categorySlug];
      const data = await getProductsByCategory(dbCategory);

      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, [categorySlug, isComingSoon]);

  const filteredProducts = useMemo(() => products, [products]);

  if (!config) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Category not found</h1>
        <Link href="/" className="mt-4 inline-block underline">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-[65vh] w-full overflow-hidden -mt-[56px] md:-mt-[72px]">
        <Image
          src={config.heroImage}
          alt={`${config.label} hero`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white sm:text-4xl md:text-6xl">
              {config.label}
            </h1>
            <p className="mt-3 text-sm text-white/80 md:text-base">
              {config.heroSubtitle}
            </p> */}
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-4 z-10 md:left-6">
          <div className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-white/80">{config.label}</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {isComingSoon ? (
        <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="overflow-hidden rounded-2xl">

            {/* Desktop Image */}
            <Image
              src="/images/COMING-SOON-linear-text.png"
              alt={`${config.label} coming soon`}
              width={1400}
              height={400}
              priority
              className="hidden w-full object-contain md:block"
            />

            {/* Mobile Image */}
            <Image
              src="/images/coming-soon-home.png"
              alt={`${config.label} coming soon`}
              width={700}
              height={700}
              priority
              className="block w-full object-contain md:hidden"
            />

          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-2 py-10">
          {loading ? (
            <div className="py-10 text-center text-black/60">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-10 text-center text-black/60">
              No products found.
            </div>
          ) : (
            <div
              className={
                filteredProducts.length < 4
                  ? "flex flex-wrap justify-center gap-4 md:gap-6"
                  : "grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4"
              }
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={
                    filteredProducts.length < 4
                      ? "w-[48%] md:w-[280px] xl:w-[290px]"
                      : "w-full"
                  }
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}