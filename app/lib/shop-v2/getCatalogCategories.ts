import { createClient } from "../supabase/client";

export type CatalogCategory = {
  id: number;
  code: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_categories")
    .select("id, code, name, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching catalog categories:", error.message);
    return [];
  }

  return (data ?? []) as CatalogCategory[];
}