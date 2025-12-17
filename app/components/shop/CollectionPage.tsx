"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import { CATEGORY_CONFIG, PRODUCTS, BRAND_RED } from "../../lib/shop/catalog";
import { Filters, SortKey } from "../../lib/shop/types";
import {
  applyFilters,
  applySort,
  defaultFilters,
  getPriceBounds,
  activeFiltersCount,
} from "../../lib/shop/filterSort";

import ProductCard from "./ProductCard";
import FilterModal from "./FilterModal";
import SortDropdown from "./SortDropdown";

export default function CollectionPage({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const config = CATEGORY_CONFIG[categorySlug];

  // fallback if someone hits invalid URL
  if (!config) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Category not found</h1>
        <Link className="mt-4 inline-block underline" href="/">
          Go home
        </Link>
      </div>
    );
  }

  const categoryProducts = useMemo(
    () => PRODUCTS.filter((p) => p.category === config.key),
    [config.key]
  );

  const bounds = useMemo(
    () => getPriceBounds(categoryProducts),
    [categoryProducts]
  );

  const baseFilters: Filters = useMemo(
    () => ({ ...defaultFilters, priceMin: bounds.min, priceMax: bounds.max }),
    [bounds.min, bounds.max]
  );

  const [filters, setFilters] = useState<Filters>(baseFilters);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  // Keep filters aligned when category changes (simple)
  useMemo(() => setFilters(baseFilters), [categorySlug, baseFilters]);

  const filtered = useMemo(() => {
    const f = applyFilters(categoryProducts, filters);
    return applySort(f, sort);
  }, [categoryProducts, filters, sort]);

  const count = activeFiltersCount(filters, baseFilters);

  console.log("categorySlug:", categorySlug);
  console.log("available keys:", Object.keys(CATEGORY_CONFIG));

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={config.heroImage}
          alt={`${config.label} hero`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-4xl uppercase md:text-6xl font-bold tracking-[0.18em] text-white">
              {config.label}
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/80">
              {config.heroSubtitle}
            </p>
          </motion.div>
        </div>


        <div className="absolute bottom-5 left-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="text-white/60">›</span>
            <span className="font-semibold">{config.label}</span>
          </div>
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-row gap-4 justify-between md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:border-black/20"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {count > 0 && (
                <span
                  className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white"
                  style={{ backgroundColor: BRAND_RED }}
                >
                  {count}
                </span>
              )}
            </button>

            {count > 0 && (
              <button
                onClick={() => setFilters(baseFilters)}
                className="text-sm font-semibold text-black/60 hover:text-black"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse md:flex-row items-end md:items-center justify-end gap-1 md:gap-3 md:justify-end">
            <p className="text-sm text-black/60 pr-2">
              Showing{" "}
              <span className="font-semibold text-black">
                {filtered.length}
              </span>{" "}
              items
            </p>

            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-2 pb-10">
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Filter Modal (reused for all) */}
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categoryKey={config.key}
        products={categoryProducts}
        base={baseFilters}
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(baseFilters)}
      />
    </div>
  );
}
