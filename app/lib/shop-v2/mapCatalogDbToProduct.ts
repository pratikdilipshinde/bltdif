import type {
  CatalogProduct,
  CatalogProductImage,
  CatalogProductVariant,
} from "./catalog-types";

import type {
  DbCatalogProductImageRow,
  DbCatalogProductRow,
  DbCatalogProductVariantRow,
} from "./catalog-db-types";

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

function mapImage(row: DbCatalogProductImageRow): CatalogProductImage {
  return {
    id: Number(row.id),
    image_url: row.image_url,
    alt_text: row.alt_text,
    sort_order: row.sort_order ?? 0,
    is_primary: row.is_primary ?? false,
  };
}

function mapVariant(
  row: DbCatalogProductVariantRow,
  fallbackPrice: number
): CatalogProductVariant {
  const stockQuantity = row.stock_quantity ?? 0;
  const reservedQuantity = row.reserved_quantity ?? 0;
  const availableQuantity = Math.max(stockQuantity - reservedQuantity, 0);
  const isActive = row.is_active ?? true;

  return {
    id: Number(row.id),
    sku: row.sku,

    size_id: row.size_id ? Number(row.size_id) : null,
    size_code: row.size?.code ?? null,
    size_label: row.size?.label ?? null,

    color: row.color,
    color_code: row.color_code,

    price:
      row.price !== null && row.price !== undefined
        ? toNumber(row.price)
        : fallbackPrice,

    compare_at_price:
      row.compare_at_price !== null && row.compare_at_price !== undefined
        ? toNumber(row.compare_at_price)
        : null,

    stock_quantity: stockQuantity,
    reserved_quantity: reservedQuantity,
    available_quantity: availableQuantity,
    low_stock_threshold: row.low_stock_threshold ?? 5,

    is_active: isActive,
    is_default: row.is_default ?? false,
    in_stock: isActive && availableQuantity > 0,
  };
}

export function mapCatalogDbToProduct(row: DbCatalogProductRow): CatalogProduct {
  const basePrice = toNumber(row.base_price);

  const images = (row.images ?? [])
    .map(mapImage)
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.sort_order - b.sort_order;
    });

  const variants = (row.variants ?? [])
    .map((variant) => mapVariant(variant, basePrice))
    .filter((variant) => variant.is_active)
    .sort((a, b) => {
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;
      return a.id - b.id;
    });

  const defaultVariant =
    variants.find((variant) => variant.is_default && variant.in_stock) ??
    variants.find((variant) => variant.in_stock) ??
    variants.find((variant) => variant.is_default) ??
    variants[0] ??
    null;

  const image =
    images.find((img) => img.is_primary)?.image_url ??
    images[0]?.image_url ??
    "/images/placeholder.jpg";

  const sizes = [
    ...new Set(
      variants
        .filter((variant) => variant.size_label)
        .sort((a, b) => {
          const aSort = a.size_id ?? 9999;
          const bSort = b.size_id ?? 9999;
          return aSort - bSort;
        })
        .map((variant) => variant.size_label)
        .filter((value): value is string => Boolean(value))
    ),
  ];

  const colors = [
    ...new Set(
      variants
        .map((variant) => variant.color)
        .filter((value): value is string => Boolean(value))
    ),
  ];

  const totalStock = variants.reduce(
    (sum, variant) => sum + variant.available_quantity,
    0
  );

  const availability =
    variants.length > 0 ? variants.some((variant) => variant.in_stock) : true;

  return {
    id: Number(row.id),
    product_code: row.product_code,
    slug: row.slug,
    name: row.name,

    category_id: Number(row.category_id),
    category_code: row.category.code,
    category_name: row.category.name,

    product_type: row.product_type,
    short_description: row.short_description,
    description: row.description,
    material: row.material,
    features: row.features,
    care_guide: row.care_guide,
    delivery_info: row.delivery_info,

    brand: row.brand,
    status: row.status,

    base_price: basePrice,
    compare_at_price:
      row.compare_at_price !== null && row.compare_at_price !== undefined
        ? toNumber(row.compare_at_price)
        : null,
    currency_code: row.currency_code,

    is_featured: row.is_featured ?? false,
    is_new_arrival: row.is_new_arrival ?? false,

    seo_title: row.seo_title,
    seo_description: row.seo_description,

    created_at: row.created_at,
    updated_at: row.updated_at,

    images,
    image,

    variants,
    default_variant: defaultVariant,

    sizes,
    colors,

    total_stock: totalStock,
    availability,
  };
}