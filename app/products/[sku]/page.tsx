import { notFound } from "next/navigation";
import ProductDetailPage from "@/app/components/shop/ProductDetailPage";
import {
  getProductBySku,
  getSimilarProducts,
} from "@/app/lib/shop/product-detail-db";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;

  const product = await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category, product.id);

  return (
    <ProductDetailPage
      product={product}
      similarProducts={similarProducts}
    />
  );
}