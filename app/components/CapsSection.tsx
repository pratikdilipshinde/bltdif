"use client";

import { useEffect, useState } from "react";
import {
  getCatalogProductsByCategory,
  type CatalogProduct,
} from "../lib/shop-v2";
import ProductCard from "./shop/ProductCard";

export default function CapsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
        const data = await getCatalogProductsByCategory("caps");
      
        const sortedProducts = [...data].sort(
        (a, b) =>
            Number(a.variants?.[0]?.price || 0) -
            Number(b.variants?.[0]?.price || 0)
        );

        setProducts(sortedProducts.slice(0, 3));
    }

    fetchProducts();
  }, []);

  return (
    <section className="bg-white px-4 pb-8 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
      <div className="mx-auto max-w-[1800px]">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-black">
          Featured Caps
        </p>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-9 2xl:gap-10">
          {products.map((product) => (
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
      </div>
    </section>
  );
}