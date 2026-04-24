export type CatalogProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type CatalogProductImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type CatalogProductVariant = {
  id: number;
  sku: string;
  size_id: number | null;
  size_code: string | null;
  size_label: string | null;
  color: string | null;
  color_code: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_default: boolean;
  in_stock: boolean;
};

export type CatalogProduct = {
  id: number;
  product_code: string;
  slug: string;
  name: string;

  category_id: number;
  category_code: string;
  category_name: string;

  product_type: string | null;
  short_description: string | null;
  description: string | null;
  material: string | null;
  features: string | null;
  care_guide: string | null;
  delivery_info: string | null;

  brand: string;
  status: CatalogProductStatus;

  base_price: number;
  compare_at_price: number | null;
  currency_code: string;

  is_featured: boolean;
  is_new_arrival: boolean;

  seo_title: string | null;
  seo_description: string | null;

  created_at?: string;
  updated_at?: string;

  images: CatalogProductImage[];
  image: string;

  variants: CatalogProductVariant[];
  default_variant: CatalogProductVariant | null;

  sizes: string[];
  colors: string[];

  total_stock: number;
  availability: boolean;
};

export type CartItem = {
  product_id: number;
  variant_id: number | null;
  sku: string;
  slug: string;
  name: string;
  image: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
};