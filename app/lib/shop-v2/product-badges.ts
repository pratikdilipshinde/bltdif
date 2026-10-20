
import type { CatalogProduct } from "./catalog-types";

export function getProductBadges(product: CatalogProduct) {
  const variant = product.default_variant;

  // Prefer the selected default variant's pricing.
  // Fall back to product-level pricing when needed.
  const sellingPrice = variant?.price ?? product.base_price;
  const originalPrice =
    variant?.compare_at_price ?? product.compare_at_price;

  const discountPercentage =
    originalPrice != null &&
    originalPrice > sellingPrice &&
    sellingPrice >= 0
      ? Math.round(
          ((originalPrice - sellingPrice) / originalPrice) * 100
        )
      : 0;

  return {
    isLimitedEdition: product.is_limited_edition,
    discountPercentage,
    hasDiscount: discountPercentage > 0,
  };
}