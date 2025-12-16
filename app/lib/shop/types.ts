export type CategoryKey = "hoodies" | "t-shirts" | "caps";

export type Product = {
  id: string;
  category: CategoryKey;
  name: string;
  price: number;
  tag?: string; // New / Drop 01 / Essentials / Limited
  image: string;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  sizes?: string[]; // t-shirts/hoodies
  colors?: string[]; // all
  fit?: "Oversized" | "Relaxed" | "Regular"; // hoodies/t-shirts
  material?: string; // optional
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
  fits: NonNullable<Product["fit"]>[];
  colors: string[];
  priceMin: number;
  priceMax: number;
};

export type SortKey = "featured" | "newest" | "price_asc" | "price_desc";
