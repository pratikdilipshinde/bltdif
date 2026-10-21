import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";
import MetaPixel from "./components/MetaPixel";
import { Manrope, Geist } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import JsonLd from "./components/JsonLd";
import { createOrganizationSchema, createWebsiteSchema } from "./lib/schema";
import { Analytics } from "@vercel/analytics/next";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "./lib/seo";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

// export const metadata: Metadata = {
//   title: "BLTDIF | Built Different",
//   description:
//     "Modern streetwear and performance apparel by Build Different (BLTDIF).",
// };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: DEFAULT_DESCRIPTION,

  keywords: [
    "BLTDIF",
    "Built Different",
    "Built Different streetwear",
    "BLTDIF streetwear",
    "premium streetwear",
    "streetwear brand",
    "caps",
    "streetwear caps",
    "t-shirts",
    "oversized t-shirts",
    "performance apparel",
    "urban fashion",
    "Indian streetwear brand",
  ],

  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "BLTDIF | Built Different Heavyweight Oversized Hoodies, Tshirts and Caps",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
      </head>

      <body className="min-h-screen bg-black text-neutral-100">
        <JsonLd data={createOrganizationSchema()} />
        <JsonLd data={createWebsiteSchema()} />
        
        <MetaPixel />

        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              

              <main className="flex-1">
                {children}
              </main>

              <Toaster position="top-center" />
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}