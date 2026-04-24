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

export async function getCatalogProductByCode(
  productCode: string
): Promise<CatalogProduct | null> {
  const supabase = createClient();

  const decodedProductCode = decodeURIComponent(productCode);

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("product_code", decodedProductCode)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (error) {
    console.error("Error fetching catalog product by product_code:", error.message);
    return null;
  }

  console.log("productCode from URL:", decodedProductCode);
  console.log("product from DB:", data);

  if (!data) return null;

  return mapCatalogDbToProduct(data as unknown as DbCatalogProductRow);
}

export async function getSimilarCatalogProducts(
  categoryCode: string,
  currentProductId: number
): Promise<CatalogProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(CATALOG_PRODUCT_SELECT)
    .eq("status", "ACTIVE")
    .eq("category.code", categoryCode)
    .neq("id", currentProductId)
    .limit(8);

  if (error) {
    console.error("Error fetching similar catalog products:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as DbCatalogProductRow[]).map(
    mapCatalogDbToProduct
  );
}