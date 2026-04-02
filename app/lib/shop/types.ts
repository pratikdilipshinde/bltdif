export type CategoryKey = "hoodies" | "t-shirts" | "caps";

export type Product = {
  id: number;
  sku: string;
  name: string;
  type: string;
  category: string;
  description: string | null;
  material: string | null;
  features: string | null;
  care_guide: string | null;
  delivery: string | null;
  count: number;
  created_at?: string;
  updated_at?: string;
  price: number;
  image: string;
  availability: boolean;
};

export type CategoryConfig = {
  key: CategoryKey;
  label: string;         // HOODIES
  heroImage: string;     // /images/hoodies-hero.jpg
  heroSubtitle: string;
};

export type Filters = {
  availability: Product["availability"][];
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
};

export type SortKey = "featured" | "newest" | "price_asc" | "price_desc";
