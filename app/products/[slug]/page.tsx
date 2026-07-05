import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionPage from "@/app/components/shop/CollectionPage";
import JsonLd from "@/app/components/JsonLd";
import { createProductSchema } from "@/app/lib/schema";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/app/lib/seo";
import { getCollectionConfig } from "@/app/lib/shop-v2/collection-config";
import ProductDetailPage from "@/app/components/shop/ProductDetailPage";
import {
  getCatalogProductBySlug,
  getCatalogProductsByCategory,
  getSimilarCatalogProducts,
} from "@/app/lib/shop-v2/getCatalogProducts";

type ProductOrCollectionPageProps = {
  params: Promise<{ slug: string }>;
};

function absoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;

  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function buildProductDescription(product: {
  name: string;
  short_description?: string | null;
  description?: string | null;
  category_name?: string | null;
}) {
  return (
    product.short_description ||
    product.description ||
    `Shop ${product.name} from BLTDIF. Premium ${product.category_name || "streetwear"} built different.`
  );
}

export async function generateMetadata({
  params,
}: ProductOrCollectionPageProps): Promise<Metadata> {
  const { slug } = await params;

  const collectionConfig = getCollectionConfig(slug);

  if (collectionConfig) {
    const title = `${collectionConfig.label} | ${SITE_NAME}`;
    const description = `Shop BLTDIF ${collectionConfig.label.toLowerCase()} designed for premium streetwear styling, everyday comfort, and a Built Different mindset.`;
    const url = `${SITE_URL}/products/${slug}`;
    const image = absoluteUrl(collectionConfig.heroImageDesktop);

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "website",
        url,
        siteName: SITE_NAME,
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: `${SITE_NAME} ${collectionConfig.label}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  }

  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: `Product Not Found | ${SITE_NAME}`,
      description: `The product you are looking for is not available on ${SITE_NAME}.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.seo_title || `${product.name} | ${SITE_NAME}`;
  const description =
    product.seo_description || buildProductDescription(product);
  const url = `${SITE_URL}/products/${product.slug}`;

  const primaryImage =
    product.images?.find((image) => image.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    product.image ||
    DEFAULT_OG_IMAGE;

  const image = absoluteUrl(primaryImage);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductOrCollectionPage({
  params,
}: ProductOrCollectionPageProps) {
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

  const primaryImage =
    product.images?.find((image) => image.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    product.image ||
    DEFAULT_OG_IMAGE;

  const productImages =
    product.images?.length
      ? product.images.map((image) => absoluteUrl(image.image_url))
      : [absoluteUrl(primaryImage)];

  const selectedVariant = product.default_variant || product.variants?.[0];

  const price = Number(selectedVariant?.price || product.base_price || 0);

  const sku = selectedVariant?.sku || product.product_code;

  const inStock =
    product.availability ||
    product.variants?.some((variant) => variant.in_stock) ||
    false;

  const productSchema = createProductSchema({
    name: product.name,
    description:
      product.seo_description ||
      product.short_description ||
      product.description ||
      `Shop ${product.name} from BLTDIF.`,
    images: productImages,
    sku,
    productUrl: `/products/${product.slug}`,
    price,
    currency: product.currency_code || "INR",
    inStock,
  });

  return (
    <>
      <JsonLd data={productSchema} />

      <ProductDetailPage
        product={product}
        similarProducts={similarProducts}
      />
    </>
  );
}