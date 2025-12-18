"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, Menu, X } from "lucide-react";

import AuthModal from "./auth/AuthModal";


const BRAND_RED = "#CE0028";

const categories = [
  { label: "HOODIE", href: "/hoodies" },
  { label: "T-SHIRT", href: "/t-shirts" },
  { label: "CAP", href: "/caps" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // close menu on route change
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const openAuth = () => {
    setAuthOpen(true);
    setIsMenuOpen(false); // close mobile menu if open
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        <nav className="flex items-center justify-between px-4 py-3 md:grid md:grid-cols-3 md:px-6 md:py-4">
          {/* LEFT */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center rounded-xs p-2 text-black hover:bg-black/5"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              )}
            </button>

            {/* Desktop categories */}
            <div className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-[0.14em] text-black">
              {categories.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative uppercase"
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-category-underline"
                        className="absolute -bottom-1 left-0 h-[2px] w-full"
                        style={{ backgroundColor: BRAND_RED }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CENTER: logo image */}
          <div className="flex items-center justify-center">
            <Link href="/" aria-label="BLTDIF Home" className="relative">
              <Image
                src="/images/Logo.png"
                alt="BLTDIF"
                width={140}
                height={40}
                priority
                className="h-6 w-auto md:h-7 select-none"
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-3 md:gap-5 text-black">
            <button
              aria-label="Account"
              onClick={openAuth}
              className="rounded-xs p-2 hover:bg-black/5"
            >
              <User className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <span className="hidden md:inline-block h-6 w-px bg-black/70" />

            <button
              aria-label="Cart"
              className="rounded-xs p-2 hover:bg-black/5"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="md:hidden border-t border-black/10 bg-white shadow-md"
            >
              <div className="mx-auto max-w-6xl px-4 py-3">
                <nav className="flex flex-col gap-1 text-sm font-medium text-black">
                  {categories.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between rounded-xs px-2 py-2 uppercase tracking-[0.14em] hover:bg-black/5"
                        style={{ color: isActive ? BRAND_RED : undefined }}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span
                            className="h-[2px] w-10 rounded-xs"
                            style={{ backgroundColor: BRAND_RED }}
                          />
                        )}
                      </Link>
                    );
                  })}

                  {/* Optional: auth entry in mobile menu */}
                  <button
                    onClick={openAuth}
                    className="mt-2 flex items-center justify-between rounded-xs px-2 py-2 uppercase tracking-[0.14em] hover:bg-black/5"
                    style={{ color: BRAND_RED }}
                  >
                    <span>ACCOUNT</span>
                    <span className="text-black">→</span>
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* AUTH MODAL */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode="login" />
      
    </>
  );
}
