"use client";

import { useEffect, useState } from "react";
import {
  getCatalogProductsByCategory,
  type CatalogProduct,
} from "../lib/shop-v2";
import ProductCard from "./shop/ProductCard";

export default function ProductsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getCatalogProductsByCategory("caps");
      setProducts(data.slice(0, 3));
    }

    fetchProducts();
  }, []);

  return (
    <section className="bg-white pb-12">
      <div className="mt-8 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-black/50">
          FEATURED CAPS
        </p>
      </div>

      <div className="mt-8 flex justify-center px-2">
        <div
          className={
            products.length < 4
              ? "flex w-full max-w-[1100px] flex-wrap justify-center gap-3 md:gap-6"
              : "grid w-full max-w-[1100px] grid-cols-2 gap-3 md:grid-cols-3 md:gap-6"
          }
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={
                products.length < 4
                  ? "w-[48%] md:w-[280px] xl:w-[290px]"
                  : "w-full"
              }
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}