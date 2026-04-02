"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import type { Product } from "../lib/shop/types";
import ProductCard from "./shop/ProductCard";

type DbProductRow = {
  id: number;
  sku: string;
  name: string;
  type: string;
  category: string;
  description: string | null;
  material: string | null;
  features: string | null;
  care_guide: string | null;
  delivery: string | null;
  count: number;
  price: number | null;
  image_url?: string | null;
  images?: string[] | null;
  availability?: boolean | null;
};

function mapDbToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    type: row.type,
    category: row.category,
    description: row.description,
    material: row.material,
    features: row.features,
    care_guide: row.care_guide,
    delivery: row.delivery,
    count: row.count,
    price: row.price ?? 0,
    image: row.images?.[0] || row.image_url || "/images/placeholder.jpg",
    availability: row.availability ?? row.count > 0,
  };
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Cap")
        .limit(3);

      if (error) {
        console.error(error.message);
        return;
      }

      setProducts((data ?? []).map(mapDbToProduct));
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
              ? "flex flex-wrap justify-center gap-3 md:gap-6 w-full max-w-[1100px]"
              : "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 max-w-[1100px] w-full"
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