import type { Product } from "./types";
import type { DbProductRow } from "./product-db-types";

export function mapDbToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    type: row.type,
    category: row.category,
    description: row.description,
    material: row.material,
    features: row.features,
    care_guide: row.care_guide,
    delivery: row.delivery,
    count: row.count,
    created_at: row.created_at,
    updated_at: row.updated_at,
    price: row.price ?? 0,
    image: row.images?.[0] || row.image_url || "/images/placeholder.jpg",
    availability: row.availability ?? row.count > 0,
  };
}