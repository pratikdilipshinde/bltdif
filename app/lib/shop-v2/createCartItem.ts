import type { CatalogProduct, CatalogProductVariant } from "./catalog-types";
import type { CartItem } from "@/app/context/CartContext";

export function createCartItem(
  product: CatalogProduct,
  selectedVariant: CatalogProductVariant | null,
  quantity = 1
): CartItem {
  const variant = selectedVariant ?? product.default_variant;

  return {
    id: variant?.id ?? product.id,
    product_id: product.id,
    variant_id: variant?.id ?? undefined,
    product_code: product.product_code,
    sku: variant?.sku ?? product.product_code,
    slug: product.slug,
    name: product.name,
    price: variant?.price ?? product.base_price,
    image: product.image,
    category_code: product.category_code,
    size_label: variant?.size_label ?? null,
    size_code: variant?.size_code ?? null,
    color: variant?.color ?? null,
    max_quantity: variant?.available_quantity,
    quantity,
  };
}