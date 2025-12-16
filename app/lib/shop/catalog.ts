import { CategoryConfig, Product } from "./types";

export const BRAND_RED = "#CE0028";

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  hoodies: {
    key: "hoodies",
    label: "Hoodies",
    heroImage: "/images/hoodies-hero.jpg",
    heroSubtitle: "Heavyweight fits. Minimal branding. Maximum presence.",
  },
  "t-shirts": {
    key: "t-shirts",
    label: "T-Shirts",
    heroImage: "/images/tshirts-hero.jpg",
    heroSubtitle: "Clean silhouettes. Premium hand-feel. Built different.",
  },
  caps: {
    key: "caps",
    label: "Caps",
    heroImage: "/images/caps-hero.jpg",
    heroSubtitle: "Minimal caps designed to stand out quietly.",
  },
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    category: "t-shirts",
    name: "Red Graphic Tee",
    price: 45,
    tag: "Drop 01",
    image: "/images/tshirt-1-3d.png",
    availability: "In Stock",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red"],
    fit: "Oversized",
  },
  {
    id: "p2",
    category: "t-shirts",
    name: "Creator Black Tee",
    price: 39,
    tag: "New",
    image: "/images/tshirt-2-3d.png",
    availability: "Low Stock",
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    fit: "Relaxed",
  },
  {
    id: "p3",
    category: "hoodies",
    name: "The Shadow Knows Hoodie",
    price: 89,
    tag: "Drop 01",
    image: "/images/hoodie-back-3d.png",
    availability: "In Stock",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Taupe"],
    fit: "Oversized",
  },
  {
    id: "p4",
    category: "caps",
    name: "Built Different Cap",
    price: 29,
    tag: "Essentials",
    image: "/images/cap-1-3d.png",
    availability: "In Stock",
    colors: ["Cream", "Burgundy"],
  },
];
