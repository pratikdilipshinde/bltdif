import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

const BASE_URL = SITE_URL.replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image/"],
        disallow: [
          "/admin/",
          "/account/",
          "/checkout/",
          "/api/",
          "/forgot-password",
          "/reset-password",
          "/update-password",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}