import { CategoryConfig, Product } from "./types";

export const BRAND_RED = "#CE0028";

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  hoodies: {
    key: "hoodies",
    label: "Hoodies",
    heroImage: "/images/hoodie-hero-img.png",
    heroSubtitle: "Heavyweight fits. Minimal branding. Maximum presence.",
  },
  "t-shirts": {
    key: "t-shirts",
    label: "T-Shirts",
    heroImage: "/images/tshirts-hero-img.jpg",
    heroSubtitle: "Clean silhouettes. Premium hand-feel. Built different.",
  },
  caps: {
    key: "caps",
    label: "Caps",
    heroImage: "/images/cap-hero-img.png",
    heroSubtitle: "Minimal caps designed to stand out quietly.",
  },
};

