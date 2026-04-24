export type CollectionConfig = {
  key: string;
  dbCategory: string;
  label: string;
  heroImage: string;
  heroSubtitle: string;
  comingSoon: boolean;
};

export const CATEGORY_CONFIG: Record<string, CollectionConfig> = {
  caps: {
    key: "caps",
    dbCategory: "caps",
    label: "Caps",
    heroImage: "/images/cap-hero-img.png",
    heroSubtitle: "Built different. Worn daily.",
    comingSoon: false,
  },
  "t-shirts": {
    key: "t-shirts",
    dbCategory: "tshirts",
    label: "T-Shirts",
    heroImage: "/images/tshirts-hero-img.jpg",
    heroSubtitle: "Premium silhouettes for everyday wear.",
    comingSoon: false,
  },
  hoodies: {
    key: "hoodies",
    dbCategory: "hoodies",
    label: "Hoodies",
    heroImage: "/images/hoodie-hero-img.png",
    heroSubtitle: "Heavyweight pieces landing soon.",
    comingSoon: true,
  },
};

export function getCollectionConfig(slug: string) {
  return CATEGORY_CONFIG[slug] ?? null;
}