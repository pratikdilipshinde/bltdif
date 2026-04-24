import type { CatalogProduct, CatalogProductVariant } from "./catalog-types";

type VariantSelection = {
  sizeLabel?: string | null;
  sizeCode?: string | null;
  color?: string | null;
};

export function getSelectedCatalogVariant(
  product: CatalogProduct,
  selection: VariantSelection
): CatalogProductVariant | null {
  const variants = product.variants ?? [];

  if (variants.length === 0) return null;

  const exactMatch = variants.find((variant) => {
    const sizeLabelMatches = selection.sizeLabel
      ? variant.size_label === selection.sizeLabel
      : true;

    const sizeCodeMatches = selection.sizeCode
      ? variant.size_code === selection.sizeCode
      : true;

    const colorMatches = selection.color
      ? variant.color === selection.color
      : true;

    return sizeLabelMatches && sizeCodeMatches && colorMatches;
  });

  return exactMatch ?? product.default_variant ?? variants[0] ?? null;
}

export function getAvailableSizes(product: CatalogProduct): string[] {
  return [
    ...new Set(
      product.variants
        .filter((variant) => variant.is_active)
        .map((variant) => variant.size_label)
        .filter((value): value is string => Boolean(value))
    ),
  ];
}

export function getAvailableColors(product: CatalogProduct): string[] {
  return [
    ...new Set(
      product.variants
        .filter((variant) => variant.is_active)
        .map((variant) => variant.color)
        .filter((value): value is string => Boolean(value))
    ),
  ];
}