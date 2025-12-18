import { notFound } from "next/navigation";
import ProductDetailPage from "@/app/components/shop/ProductDetailPage";
import { PRODUCTS } from "@/app/lib/shop/catalog"

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return notFound();

  return <ProductDetailPage product={product} />;
}
