"use client";

import Image from "next/image";
import Link from "next/link";

import type { CatalogProduct } from "../../lib/shop-v2";
import ProductCard from "./ProductCard";
import { CATEGORY_CONFIG } from "../../lib/shop-v2/collection-config";

export default function CollectionPage({
  categorySlug,
  products = [],
}: {
  categorySlug: string;
  products: CatalogProduct[];
}) {
  const config = CATEGORY_CONFIG[categorySlug];

  if (!config) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-semibold text-black">
          Category not found
        </h1>

        <Link
          href="/products"
          className="mt-4 inline-block text-sm font-semibold text-black underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  // ✅ SORT PRODUCTS BY LOWEST PRICE (FROM VARIANTS)
  const sortedProducts = [...products].sort(
    (a, b) =>
      Number(a.variants?.[0]?.price || 0) -
      Number(b.variants?.[0]?.price || 0)
  );

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative -mt-[56px] h-[60vh] min-h-[420px] w-full overflow-hidden md:-mt-[72px] md:h-[65vh]">
        <Image
          src={config.heroImage}
          alt={`${config.label} hero`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute bottom-6 left-4 z-10 md:left-6">
          <div className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            {/* <span className="mx-2">›</span>

            <Link href="/products" className="transition hover:text-white">
              Products
            </Link> */}

            <span className="mx-2">›</span>

            <span className="text-white/80">{config.label}</span>
          </div>
        </div>
      </section>

      {/* COMING SOON */}
      {config.comingSoon ? (
        <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/COMING-SOON-linear-text.png"
              alt={`${config.label} coming soon`}
              width={1400}
              height={400}
              priority
              className="hidden w-full object-contain md:block"
            />

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
        <section className="bg-white px-4 py-5 md:px-5 lg:px-8 xl:px-10 2xl:px-14">
          <div className="mx-auto max-w-[1800px]">
            {/* HEADER */}
            <div className="mb-5 flex flex-col gap-2 border-b border-black/10 pb-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CE0028]">
                  Shop Collection
                </p>

                <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[-0.04em] text-black md:text-3xl">
                  {config.label}
                </h2>
              </div>

              <p className="text-sm text-black/50">
                {sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* EMPTY STATE */}
            {sortedProducts.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-xs border border-black/10 bg-[#f7f5f1] px-4 text-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                    No products found
                  </p>

                  <p className="mt-2 text-sm text-black/50">
                    Products will appear here once they are available.
                  </p>
                </div>
              </div>
            ) : (
              /* PRODUCT GRID */
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-9 2xl:gap-10">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="
                      w-full
                      sm:min-h-[440px]
                      lg:min-h-[500px]
                      xl:min-h-[500px]
                      2xl:min-h-[660px]
                      min-[2560px]:min-h-[760px]
                      min-[3840px]:min-h-[900px]
                    "
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}