import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";
import { prisma } from "./lib/prisma";

const BASE_URL = SITE_URL.replace(/\/+$/, "");

/*
 * Update these dates only when the page receives a meaningful content,
 * structured-data, or internal-linking change.
 */
const PAGE_LAST_UPDATED = {
  home: new Date("2026-07-30"),
  products: new Date("2026-07-30"),
  caps: new Date("2026-07-30"),
  tshirts: new Date("2026-07-30"),
  about: new Date("2026-07-30"),
  contact: new Date("2026-07-30"),
  faq: new Date("2026-07-30"),
  sizeGuide: new Date("2026-07-30"),
  shipping: new Date("2026-07-30"),
  returns: new Date("2026-07-30"),
  privacy: new Date("2026-07-30"),
  terms: new Date("2026-07-30"),
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: PAGE_LAST_UPDATED.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: PAGE_LAST_UPDATED.products,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/products/caps`,
      lastModified: PAGE_LAST_UPDATED.caps,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products/t-shirts`,
      lastModified: PAGE_LAST_UPDATED.tshirts,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: PAGE_LAST_UPDATED.about,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: PAGE_LAST_UPDATED.contact,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: PAGE_LAST_UPDATED.faq,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/size-guide`,
      lastModified: PAGE_LAST_UPDATED.sizeGuide,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: PAGE_LAST_UPDATED.shipping,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${BASE_URL}/returns`,
      lastModified: PAGE_LAST_UPDATED.returns,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: PAGE_LAST_UPDATED.privacy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: PAGE_LAST_UPDATED.terms,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const products = await prisma.catalogProduct.findMany({
      where: {
        status: "ACTIVE",
        category: {
          isActive: true,
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((product) => Boolean(product.slug))
      .map((product) => ({
        url: `${BASE_URL}/products/${encodeURIComponent(product.slug)}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to generate product sitemap:", error);

    // Keep the sitemap available even if the database is temporarily down.
    return staticRoutes;
  }
}