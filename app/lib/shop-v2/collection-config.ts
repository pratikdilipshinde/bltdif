export type CollectionConfig = {
  key: string;
  dbCategory: string;
  label: string;
  heroImageDesktop: string;
  heroImageMobile: string;
  heroSubtitle: string;
  comingSoon: boolean;
};

export const CATEGORY_CONFIG: Record<string, CollectionConfig> = {
  caps: {
    key: "caps",
    dbCategory: "caps",
    label: "Caps",
    heroImageDesktop: "/images/version-2-cap-section-desktop.jpg",
    heroImageMobile: "/images/version-2-cap-section-mobile.jpg",
    heroSubtitle: "Built different. Worn daily.",
    comingSoon: false,
  },

  "t-shirts": {
    key: "t-shirts",
    dbCategory: "tshirts",
    label: "T-Shirts",
    heroImageDesktop: "/images/version-2-tee-banner-laptop.jpg",
    heroImageMobile: "/images/version-2-tee-banner-mobile.jpg",
    heroSubtitle: "Premium silhouettes for everyday wear.",
    comingSoon: false,
  },

  hoodies: {
    key: "hoodies",
    dbCategory: "hoodies",
    label: "Hoodies",
    heroImageDesktop: "/images/hoodie-hero-img.png",
    heroImageMobile: "/images/hoodie-hero-img.png",
    heroSubtitle: "Heavyweight pieces landing soon.",
    comingSoon: true,
  },
};

export function getCollectionConfig(slug: string) {
  return CATEGORY_CONFIG[slug] ?? null;
}