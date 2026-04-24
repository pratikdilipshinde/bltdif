export type DbCatalogCategoryRow = {
  id: number;
  code: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export type DbCatalogSizeRow = {
  id: number;
  code: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

export type DbCatalogProductImageRow = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type DbCatalogProductVariantRow = {
  id: number;
  sku: string;
  size_id: number | null;
  color: string | null;
  color_code: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_default: boolean;
  size: DbCatalogSizeRow | null;
};

export type DbCatalogProductRow = {
  id: number;
  product_code: string;
  slug: string;
  name: string;

  category_id: number;
  category: DbCatalogCategoryRow;

  product_type: string | null;
  short_description: string | null;
  description: string | null;
  material: string | null;
  features: string | null;
  care_guide: string | null;
  delivery_info: string | null;

  brand: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";

  base_price: number;
  compare_at_price: number | null;
  currency_code: string;

  is_featured: boolean;
  is_new_arrival: boolean;

  seo_title: string | null;
  seo_description: string | null;

  created_at?: string;
  updated_at?: string;

  images?: DbCatalogProductImageRow[] | null;
  variants?: DbCatalogProductVariantRow[] | null;
};