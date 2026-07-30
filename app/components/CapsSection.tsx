"use client";

import { useEffect, useState } from "react";
import {
  getCatalogProductsByCategory,
  type CatalogProduct,
} from "../lib/shop-v2";
import ProductCard from "./shop/ProductCard";
import ProductCardSkeleton from "./shop/ProductCardSkeleton";

const PRODUCT_LIMIT = 3;

export default function CapsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setIsLoading(true);

        // Start both tasks at the same time
        const [data] = await Promise.all([
          getCatalogProductsByCategory("caps"), // Use "caps" in CapsSection
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        const sortedProducts = [...data].sort(
          (a, b) =>
            Number(a.variants?.[0]?.price || 0) -
            Number(b.variants?.[0]?.price || 0)
        );

        if (isMounted) {
          setProducts(sortedProducts.slice(0, PRODUCT_LIMIT));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);

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
      className="bg-white px-4 pb-8 md:px-8 lg:px-10 xl:px-14 2xl:px-20"
    >
      <div className="mx-auto max-w-[1800px]">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-black">
          Featured Caps
        </p>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-9 2xl:gap-10">
          {isLoading
            ? Array.from({ length: PRODUCT_LIMIT }).map((_, index) => (
                <ProductCardWrapper key={`cap-skeleton-${index}`}>
                  <ProductCardSkeleton />
                </ProductCardWrapper>
              ))
            : products.map((product) => (
                <ProductCardWrapper key={product.id}>
                  <ProductCard product={product} />
                </ProductCardWrapper>
              ))}
        </div>
      </div>
    </section>
  );
}

function ProductCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
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
      {children}
    </div>
  );
}