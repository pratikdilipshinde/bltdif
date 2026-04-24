import { notFound } from "next/navigation";
import CollectionPage from "@/app/components/shop/CollectionPage";
import { getCollectionConfig } from "@/app/lib/shop-v2/collection-config";
import ProductDetailPage from "@/app/components/shop/ProductDetailPage";
import {
  getCatalogProductBySlug,
  getCatalogProductsByCategory,
  getSimilarCatalogProducts,
} from "@/app/lib/shop-v2/getCatalogProducts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const collectionConfig = getCollectionConfig(slug);

  if (collectionConfig) {
    return {
      title: `${collectionConfig.label} | BLTDIF`,
      description: `Shop ${collectionConfig.label} from BLTDIF.`,
    };
  }

  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Not Found | BLTDIF",
    };
  }

  return {
    title: product.seo_title ?? `${product.name} | BLTDIF`,
    description:
      product.seo_description ??
      product.short_description ??
      product.description ??
      `Shop ${product.name} from BLTDIF.`,
  };
}

export default async function ProductOrCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const collectionConfig = getCollectionConfig(slug);

  if (collectionConfig) {
    const products = await getCatalogProductsByCategory(
      collectionConfig.dbCategory
    );

    return <CollectionPage categorySlug={slug} products={products} />;
  }

  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarCatalogProducts(
    product.category_code,
    product.id
  );

  return (
    <ProductDetailPage
      product={product}
      similarProducts={similarProducts}
    />
  );
}