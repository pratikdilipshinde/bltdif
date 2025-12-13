export type Product = {
  id: string;
  slug: string;
  name: string;
  tag?: string;
  price: number;
  image: string;
  colorway: string;
  category: "hoodie" | "tshirt" | "jogger" | "accessory";
};

export const products: Product[] = [
  {
    id: "1",
    slug: "night-shift-oversized-hoodie",
    name: "Night Shift Oversized Hoodie",
    tag: "Drop 01",
    price: 79,
    image: "/images/hoodie-1.jpg",
    colorway: "Jet Black / Matte Print",
    category: "hoodie",
  },
  {
    id: "2",
    slug: "bltdif-core-tee",
    name: "BLTDIF Core Tee",
    tag: "Essentials",
    price: 39,
    image: "/images/tee-1.jpg",
    colorway: "Off White / Black",
    category: "tshirt",
  },
  {
    id: "3",
    slug: "build-different-tech-joggers",
    name: "Build Different Tech Joggers",
    price: 69,
    image: "/images/jogger-1.jpg",
    colorway: "Graphite Grey",
    category: "jogger",
  },
  {
    id: "4",
    slug: "minimal-logo-cap",
    name: "Minimal Logo Cap",
    price: 29,
    image: "/images/cap-1.jpg",
    colorway: "Midnight Black",
    category: "accessory",
  },
];
