import { Filters, Product, SortKey } from "./types";

export const defaultFilters: Filters = {
  availability: [],
  sizes: [],
  fits: [],
  colors: [],
  priceMin: 0,
  priceMax: 9999,
};

export function getPriceBounds(products: Product[]) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function applyFilters(products: Product[], filters: Filters) {
  return products.filter((p) => {
    if (filters.availability.length && !filters.availability.includes(p.availability)) return false;

    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;

    if (filters.sizes.length) {
      const sizes = p.sizes ?? [];
      if (!sizes.some((s) => filters.sizes.includes(s))) return false;
    }

    if (filters.fits.length) {
      const fit = p.fit;
      if (!fit || !filters.fits.includes(fit)) return false;
    }

    if (filters.colors.length) {
      const colors = p.colors ?? [];
      if (!colors.some((c) => filters.colors.includes(c))) return false;
    }

    return true;
  });
}

export function applySort(products: Product[], sort: SortKey) {
  const items = [...products];

  if (sort === "price_asc") items.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") items.sort((a, b) => b.price - a.price);
  if (sort === "newest") items.sort((a, b) => (a.tag === "New" ? -1 : 1));

  return items;
}

export function activeFiltersCount(filters: Filters, base: Filters) {
  return (
    filters.availability.length +
    filters.sizes.length +
    filters.fits.length +
    filters.colors.length +
    ((filters.priceMin !== base.priceMin || filters.priceMax !== base.priceMax) ? 1 : 0)
  );
}
