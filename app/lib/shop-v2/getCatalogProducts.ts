import { createClient } from "../supabase/client";
import type { CatalogProduct } from "./catalog-types";
import type { DbCatalogProductRow } from "./catalog-db-types";
import { mapCatalogDbToProduct } from "./mapCatalogDbToProduct";

const CATALOG_PRODUCT_SELECT = `
  id,
  product_code,
  slug,
  name,
  category_id,
  product_type,
  short_description,
  description,
  material,
  features,
  care_guide,
  delivery_info,
  brand,
  status,
  base_price,
  compare_at_price,
  currency_code,
  is_featured,
  is_new_arrival,
  seo_title,
  seo_description,
  created_at,
  updated_at,
  category:catalog_categories!inner (
    id,
    code,
    name,
    sort_order,
    is_active
  ),
  images:catalog_product_images (
    id,
    image_url,
    alt_text,
    sort_order,
    is_primary
  ),
  variants:catalog_product_variants (
    id,
    sku,
    size_id,
    color,
    color_code,
    price,
    compare_at_price,
    stock_quantity,
    reserved_quantity,
    low_stock_threshold,
    is_active,
    is_default,
    size:catalog_sizes (
      id,
      code,
      label,
      sort_order,
      is_active
    )
  )
`;

function mapRows(data: unknown): CatalogProduct[] {
  return ((data ?? []) as DbCatalogProductRow[]).map(mapCatalogDbToProduct);
}

function mapRow(data: unknown): CatalogProduct | null {
  if (!data) return null;
  return mapCatalogDbToProduct(data as DbCatalogProductRow);
}

export async function getAllCatalogProducts(): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching catalog products:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getCatalogProductsByCategory(
  categoryCode: string
): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .eq("category.code", categoryCode)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching catalog products by category:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getFeaturedCatalogProducts(): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .eq("is_featured", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching featured catalog products:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getNewArrivalCatalogProducts(): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .eq("is_new_arrival", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching new arrival catalog products:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<CatalogProduct | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching catalog product by slug:", error.message);
    return null;
  }

  return mapRow(data);
}

export async function getCatalogProductByProductCode(
  productCode: string
): Promise<CatalogProduct | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("product_code", productCode)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching catalog product by code:", error.message);
    return null;
  }

  return mapRow(data);
}

export async function getCatalogProductBySku(
  sku: string
): Promise<CatalogProduct | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .eq("variants.sku", sku)
    .maybeSingle();

  if (error) {
    console.error("Error fetching catalog product by SKU:", error.message);
    return null;
  }

  return mapRow(data);
}

export async function getSimilarCatalogProducts(
  categoryCode: string,
  currentProductId: number,
  limit = 4
): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.is_active", true)
    .eq("category.code", categoryCode)
    .neq("id", currentProductId)
    .limit(limit);

  if (error) {
    console.error("Error fetching similar catalog products:", error.message);
    return [];
  }

  return mapRows(data);
}