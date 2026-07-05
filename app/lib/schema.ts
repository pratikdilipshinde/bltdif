import { SITE_NAME, SITE_URL } from "./seo";

type ProductSchemaInput = {
  name: string;
  description?: string | null;
  images?: string[];
  sku?: string | null;
  productUrl: string;
  price: number;
  currency?: string;
  inStock?: boolean;
};

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/Logo.png`,
    description:
      "BLTDIF is a premium streetwear and performance-inspired apparel brand built around the idea of being Built Different.",
    slogan: "Built Different",
    sameAs: [],
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Official BLTDIF store for premium streetwear, caps, t-shirts, hoodies, and performance-inspired apparel.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function createProductSchema({
  name,
  description,
  images = [],
  sku,
  productUrl,
  price,
  currency = "INR",
  inStock = true,
}: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      description ||
      `Shop ${name} from BLTDIF. Premium streetwear built different.`,
    image: images,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    sku: sku || name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${productUrl}`,
      priceCurrency: currency,
      price: Number(price || 0),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}