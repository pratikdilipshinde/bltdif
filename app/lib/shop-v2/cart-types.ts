export type CatalogCartItem = {
  id: number; // use variant id as cart id
  product_id: number;
  variant_id: number;
  product_code: string;
  sku: string;
  slug: string;
  name: string;
  image: string;
  category_code: string;
  size_label: string | null;
  size_code: string | null;
  color: string | null;
  price: number;
  quantity: number;
  max_quantity: number;
};