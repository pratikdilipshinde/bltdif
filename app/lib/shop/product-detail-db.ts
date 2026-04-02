import { createClient } from "@/app/lib/supabase/server";
import type { Product } from "./types";

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
  created_at?: string;
  updated_at?: string;
  price: number | null;
  image_url?: string | null;
  images?: string[] | null;
  availability?: boolean | null;
};

export type ProductDetail = Product & {
  images?: string[];
};

function mapDbToProduct(row: DbProductRow): ProductDetail {
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
    created_at: row.created_at,
    updated_at: row.updated_at,
    price: row.price ?? 0,
    image: row.images?.[0] || row.image_url || "/images/placeholder.jpg",
    images: row.images ?? (row.image_url ? [row.image_url] : ["/images/placeholder.jpg"]),
    availability: row.availability ?? row.count > 0,
  };
}

export async function getProductBySku(sku: string): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)
    .single();

  if (error || !data) {
    console.error("Error fetching product by sku:", error?.message);
    return null;
  }

  return mapDbToProduct(data as DbProductRow);
}

export async function getSimilarProducts(
  category: string,
  currentId: number
): Promise<ProductDetail[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentId)
    .limit(8);

  if (error || !data) {
    console.error("Error fetching similar products:", error?.message);
    return [];
  }

  return (data as DbProductRow[]).map(mapDbToProduct);
}