"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";

const BRAND_RED = "#CE0028";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Hoodies", href: "/hoodies" },
      { label: "T-Shirts", href: "/t-shirts" },
      { label: "Caps", href: "/caps" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About BLTDIF", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/", icon: Instagram },
  { label: "X / Twitter", href: "https://x.com/", icon: Twitter },
  { label: "YouTube", href: "https://youtube.com/", icon: Youtube },
  { label: "Email", href: "mailto:hello@bltdif.com", icon: Mail },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-black/10">
      <div className="px-6 py-6 md:py-6">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" aria-label="BLTDIF Home" className="inline-flex">
              <Image
                src="/images/Logo.png"
                alt="BLTDIF"
                width={160}
                height={44}
                className="h-4 md:h-6 w-auto select-none"
                priority
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/60">
              BLTDIF — Built Different. Premium streetwear engineered for late
              nights, early mornings, and the grind in between.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={s.label}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm hover:border-black/25 transition"
                  >
                    <Icon
                      className="h-5 w-5 text-black/70 transition group-hover:text-black"
                      strokeWidth={1.8}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-black">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-black/65 hover:text-black transition"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-black">
              Drop Alerts
            </p>

            <form
              className="mt-4 flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="h-11 rounded-xs border border-black/12 bg-white px-4 text-sm outline-none focus:border-black/30"
              />
              <button
                type="submit"
                className="h-11 cursor-pointer rounded-xs text-sm font-semibold text-white transition"
                style={{
                  backgroundColor: BRAND_RED,
                  boxShadow: "0 2px 6px rgba(206,0,40,0.25)",
                }}
              >
                Subscribe
              </button>
              <p className="text-[11px] leading-relaxed text-black/45">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-black/10" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-black/55">
            © {year} BLTDIF. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-black/55">
            <Link href="/privacy" className="hover:text-black transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-black transition">
              Terms
            </Link>
            <Link href="/refunds" className="hover:text-black transition">
              Refund Policy
            </Link>

            <span className="hidden md:inline-block h-3 w-px bg-black/20" />

            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: BRAND_RED }}
              />
              Built Different
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
