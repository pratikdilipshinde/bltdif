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
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const textColor = isSticky ? "text-black" : "text-white";
  const iconColor = isSticky ? "text-black" : "text-white";
  const dividerColor = isSticky ? "bg-black/70" : "bg-white/70";

  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = () => {
    setAuthOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isSticky ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
          boxShadow: isSticky
            ? "0 1px 0 rgba(0,0,0,0.08)"
            : "0 0px 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <nav className="flex items-center justify-between px-4 py-2 md:px-6 md:py-2">
          {/* LEFT LOGO */}
          <div className="flex items-center">
            <Link href="/" aria-label="BLTDIF Home" className="relative">
              <div className="relative h-5 w-[80px] md:h-6 md:w-[100px]">
                <Image
                  src="/images/logo-white.png"
                  alt="BLTDIF White Logo"
                  fill
                  priority
                  className={`object-contain select-none transition-opacity duration-150 ${
                    isSticky ? "opacity-0" : "opacity-100"
                  }`}
                />
                <Image
                  src="/images/Logo.png"
                  alt="BLTDIF Red Logo"
                  fill
                  priority
                  className={`object-contain select-none transition-opacity duration-300 ${
                    isSticky ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Desktop menu */}
            <div
              className={`hidden md:flex items-center gap-7 text-[13px] font-medium tracking-[0.14em] transition-colors duration-150 ${textColor}`}
            >
              {categories.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative uppercase transition-colors duration-150"
                    style={{ color: isActive ? BRAND_RED : undefined }}
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

            {/* Account */}
            <button
              aria-label="Account"
              onClick={openAuth}
              className={`rounded-xs p-1 md:p-2 transition-colors duration-150 ${iconColor} ${
                isSticky ? "hover:bg-black/5" : "hover:bg-white/10"
              }`}
            >
              <User className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.8} />
            </button>

            <span
              className={`hidden md:inline-block h-6 w-px transition-colors duration-150 ${dividerColor}`}
            />

            {/* Cart */}
            <button
              aria-label="Cart"
              className={`rounded-xs p-1 md:p-2 transition-colors duration-150 ${iconColor} ${
                isSticky ? "hover:bg-black/5" : "hover:bg-white/10"
              }`}
            >
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.8} />
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
              className={`md:hidden inline-flex items-center justify-center rounded-xs p-1 transition-colors duration-150 ${iconColor} ${
                isSticky ? "hover:bg-black/5" : "hover:bg-white/10"
              }`}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" strokeWidth={1.8} />
              ) : (
                <Menu className="h-4 w-4" strokeWidth={1.8} />
              )}
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
              <div className="px-4 py-3">
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
      </motion.header>

      <div className="h-[56px] md:h-[72px]" />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode="login"
      />
    </>
  );
}