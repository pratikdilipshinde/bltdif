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
        .limit(3); // ✅ only 3 cards

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
      {/* Header */}
      <div className="text-center mt-8">
        <p className="text-sm tracking-[0.28em] uppercase text-black/50">
          FEATURED CAPS
        </p>
      </div>

      {/* Grid */}
      <div className="mt-8 flex justify-center">
        <div
          className="
            grid grid-cols-2 gap-3
            md:grid-cols-3 md:gap-6
            max-w-[1100px] w-full
          "
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}