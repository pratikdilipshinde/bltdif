export function formatPrice(
  amount: number | null | undefined,
  currencyCode = "INR"
): string {
  const safeAmount = amount ?? 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

export function getDisplayPrice(
  variantPrice: number | null | undefined,
  basePrice: number
): number {
  return variantPrice ?? basePrice;
}

export function hasDiscount(
  price: number | null | undefined,
  compareAtPrice: number | null | undefined
): boolean {
  if (price === null || price === undefined) return false;
  if (compareAtPrice === null || compareAtPrice === undefined) return false;

  return compareAtPrice > price;
}

export function getDiscountPercentage(
  price: number | null | undefined,
  compareAtPrice: number | null | undefined
): number | null {
  if (!hasDiscount(price, compareAtPrice)) return null;

  const discount = ((compareAtPrice! - price!) / compareAtPrice!) * 100;
  return Math.round(discount);
}