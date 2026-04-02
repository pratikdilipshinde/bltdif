import { createClient } from "../supabase/client";
import type { Product } from "./types";
import type { DbProductRow } from "./product-db-types";
import { mapDbToProduct } from "./mapDbToProduct";

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return ((data ?? []) as DbProductRow[]).map(mapDbToProduct);
}