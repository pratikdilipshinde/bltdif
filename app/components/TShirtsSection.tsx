
"use client";

import { useEffect, useState } from "react";
import {
  getCatalogProductsByCategory,
  type CatalogProduct,
} from "../lib/shop-v2";
import ProductCard from "./shop/ProductCard";
import ProductCardSkeleton from "./shop/ProductCardSkeleton";

const PRODUCT_LIMIT = 3;

export default function TShirtsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setIsLoading(true);

        const data = await getCatalogProductsByCategory("tshirts");

        const sortedProducts = [...data].sort(
          (a, b) =>
            Number(a.variants?.[0]?.price || 0) -
            Number(b.variants?.[0]?.price || 0)
        );

        if (isMounted) {
          setProducts(sortedProducts.slice(0, PRODUCT_LIMIT));
        }
      } catch (error) {
        console.error("Failed to fetch T-shirt products:", error);

        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      aria-busy={isLoading}
      className="w-full overflow-hidden bg-[#f0eded] py-8"
    >
      <div className="mx-auto max-w-[1800px]">
        <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-black md:px-8 lg:px-10 xl:px-14 2xl:px-20">
          New T-Shirt
        </p>

        <div
          className="
            flex items-stretch gap-4 overflow-x-auto
            overscroll-x-contain ml-4 md:ml-0 pr-4 pb-3
            snap-x snap-mandatory
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            sm:gap-5 sm:px-8

            md:grid md:grid-cols-2 md:gap-7
            md:overflow-visible md:snap-none

            lg:grid-cols-3 lg:gap-8 lg:px-10
            xl:gap-9 xl:px-14
            2xl:gap-10 2xl:px-20
          "
        >
          {isLoading
            ? Array.from({ length: PRODUCT_LIMIT }).map((_, index) => (
                <div
                  key={`tshirt-skeleton-${index}`}
                  className="
                    w-[78%] min-w-[78%] shrink-0 snap-start
                    sm:w-[46%] sm:min-w-[46%]
                    md:w-auto md:min-w-0 md:shrink
                  "
                >
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="
                    w-[78%] min-w-[78%] shrink-0 snap-start
                    sm:w-[46%] sm:min-w-[46%]
                    md:w-auto md:min-w-0 md:shrink
                    md:min-h-[440px]
                    lg:min-h-[500px]
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