"use client";

import Link from "next/link";
import { PRODUCTS } from "../lib/shop/catalog";
import ProductCard from "./shop/ProductCard";

export default function ProductsSection() {
  // 🔴 Only Drop 01 products
  const drop01Products = PRODUCTS.filter(
    (product) => product.tag === "Drop 01"
  );

  return (
    <section className="bg-white pb-10">
      <div className="mx-4">
        {/* Header */}
        <div className="relative text-center">
          <div className="mb-6 mt-[-5px]">
            <p className="text-xs tracking-[0.28em] text-black/50 uppercase">
              FEATURED
            </p>
          </div>

          <Link
            href="/products"
            className="
              rounded-full border border-black/60 bg-white text-black/60
              px-6 md:px-8 py-3 text-xs md:text-sm font-semibold tracking-[0.18em]
              transition hover:-translate-y-0.5 hover:border-[#CE0028] hover:text-[#CE0028]
            "
          >
            SHOP ALL
          </Link>
        </div>

        {/* Product grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {drop01Products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
