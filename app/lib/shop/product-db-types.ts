export type DbProductRow = {
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
  price: number | null;
  image_url?: string | null;
  images?: string[] | null;
  availability?: boolean | null;
};