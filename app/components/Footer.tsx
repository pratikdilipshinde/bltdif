"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";

const BRAND_RED = "#CE0028";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Hoodies", href: "/products/hoodies" },
      { label: "T-Shirts", href: "/products/t-shirts" },
      { label: "Caps", href: "/products/caps" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About BLTDIF", href: "/about" },
      { label: "Contact", href: "/contact" },
      // { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      // { label: "Size Guide", href: "/size-guide" },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bltdif.co?igsh=MWQxeHJ4ZmI0cTFqbQ==",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1DmzXGPKMG/?mibextid=wwXIfr",
    icon: FaFacebookF,
  },
  {
    label: "Threads",
    href: "https://threads.net/",
    icon: SiThreads,
  },
  {
    label: "X",
    href: "https://x.com/BLTDIF?s=20",
    icon: FaXTwitter,
  },
  // {
  //   label: "YouTube",
  //   href: "https://youtube.com/",
  //   icon: FaYoutube,
  // },
  {
    label: "Email",
    href: "mailto:support@bltdif.in",
    icon: MdOutlineMail,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-white">
      {/* soft background accents */}
      {/* <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-16 top-0 h-40 w-40 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: BRAND_RED }}
        />
        <div
          className="absolute -right-10 bottom-0 h-40 w-40 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: BRAND_RED }}
        />
      </div> */}

      <div className="relative px-6 py-10 md:px-10 md:py-10 lg:px-14">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-5">
            <Link href="/" aria-label="BLTDIF Home" className="inline-flex">
              <Image
                src="/images/Footer-Logo.png"
                alt="BLTDIF"
                width={170}
                height={50}
                className="h-5 w-auto select-none md:h-6"
                priority
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-black/60 md:text-[15px]">
              BLTDIF — Built Different. Premium streetwear engineered for late
              nights, early mornings, and the grind in between.
            </p>

            {/* Socials */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                const isExternal =
                  s.href.startsWith("http") || s.href.startsWith("mailto:");

                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={s.label}
                    className="
                      group relative inline-flex h-11 w-11 items-center justify-center
                      rounded-full border border-black/10 bg-white
                      text-black/70 shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                      transition-all duration-300
                      hover:-translate-y-0.5 hover:border-transparent hover:text-white
                      hover:shadow-[0_0_20px_rgba(206,0,40,0.35),0_8px_30px_rgba(206,0,40,0.18)]
                    "
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)",
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(135deg, #CE0028 0%, #9f001f 100%)",
                      }}
                    />
                    <Icon className="relative z-10 text-[18px] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-7 lg:col-span-7 grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black">
                  {col.title}
                </p>

                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="
                          group inline-block text-sm text-black/65 transition duration-300
                          hover:text-black
                        "
                      >
                        <span className="relative">
                          {l.label}
                          <span
                            className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: BRAND_RED }}
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs tracking-[0.08em] text-black/50">
            © {year} BLTDIF. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs tracking-[0.08em] text-black/50">
            <Link href="/privacy" className="transition hover:text-black">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-black">
              Terms & Conditions
            </Link>
            {/* <Link href="/refunds" className="transition hover:text-black">
              Refund Policy
            </Link> */}

            <span className="hidden h-3 w-px bg-black/20 md:inline-block" />

            <span className="inline-flex items-center gap-2 text-black/60">
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