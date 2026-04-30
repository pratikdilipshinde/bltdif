"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, Menu, X, LogOut } from "lucide-react";

import AuthModal from "./auth/AuthModal";
import { useAuth } from "@/app/providers/AuthProvider";
import { useCart } from "@/app/context/CartContext";

const BRAND_RED = "#CE0028";

const categories = [
  { label: "HOODIE", href: "/products/hoodies" },
  { label: "T-SHIRT", href: "/products/t-shirts" },
  { label: "CAP", href: "/products/caps" },
];

const categorySlugs = categories.map((c) => c.href.split("/")[2]);

export default function Navbar() {
  const pathname = usePathname();

  const pathParts = pathname.split("/");

  const isProductDetailsPage =
    pathname.startsWith("/products/") &&
    pathParts.length === 3 &&
    !categorySlugs.includes(pathParts[2]);

  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const textColor =
    isProductDetailsPage ? "text-black" : isSticky ? "text-black" : "text-white";

  const iconColor =
    isProductDetailsPage ? "text-black" : isSticky ? "text-black" : "text-white";

  const dividerColor =
    isProductDetailsPage ? "bg-black/70" : isSticky ? "bg-black/70" : "bg-white/70";

  useEffect(() => {
    closeMenu();
    setAccountMenuOpen(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!accountMenuRef.current) return;
      if (!accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openAuth = () => {
    setAuthOpen(true);
    setIsMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (loading) return;

    if (!user) {
      openAuth();
      return;
    }

    setAccountMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    setAccountMenuOpen(false);
    setAuthOpen(false);
    closeMenu();
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isSticky
            ? "rgba(255,255,255,1)"
            : "rgba(255,255,255,0)",
          boxShadow: isSticky
            ? "0 1px 0 rgba(0,0,0,0.08)"
            : "0 0px 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed left-0 right-0 top-0 z-50"
      >
        <nav className="flex items-center justify-between px-4 py-2 md:px-6 md:py-2">
          {/* LEFT LOGO */}
          <div className="flex items-center">
            <Link href="/" aria-label="BLTDIF Home" className="relative">
              <div className="relative h-5 w-[80px] md:h-6 md:w-[100px]">
                <Image
                  src={isProductDetailsPage ? "/images/Logo.png" : "/images/Logo-white.png"}
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
            <div className="relative" ref={accountMenuRef}>
              <button
                aria-label={user ? "Account menu" : "Account"}
                onClick={handleAccountClick}
                className={`rounded-xs p-1 md:p-2 transition-colors duration-150 ${iconColor} ${
                  isSticky ? "hover:bg-black/5" : "hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.8} />
              </button>

              <AnimatePresence>
                {user && accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[210px] rounded-xs border border-black/10 bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
                  >
                    <div className="border-b border-black/10 px-3 py-2">
                      <p className="text-[13px] font-semibold text-black">
                        {user.firstname || "BLTDIF User"}
                      </p>
                      <p className="mt-0.5 text-[12px] text-black/55">
                        {user.email}
                      </p>
                    </div>
                    <Link href="/account/profile" 
                          className="mt-2 flex w-full items-center gap-2 rounded-xs px-3 py-2 text-left text-[13px] font-medium text-black transition hover:bg-black/[0.04]">
                      My Profile
                    </Link>

                    <Link
                      href="/account/orders"
                      className="mt-2 flex w-full items-center gap-2 rounded-xs px-3 py-2 text-left text-[13px] font-medium text-black transition hover:bg-black/[0.04]">
                    My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-2 rounded-xs px-3 py-2 text-left text-[13px] font-medium text-black transition hover:bg-black/[0.04]"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span
              className={`hidden h-6 w-px md:inline-block transition-colors duration-150 ${dividerColor}`}
            />

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className={`relative rounded-xs p-1 md:p-2 transition-colors duration-150 ${iconColor} ${
                isSticky ? "hover:bg-black/5" : "hover:bg-white/10"
              }`}
            >
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.8} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#CE0028] px-1 text-[10px] font-semibold leading-none text-white md:h-5 md:min-w-[18px] md:text-[11px]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center rounded-xs p-1 md:hidden transition-colors duration-150 ${iconColor} ${
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
              className="border-t border-black/10 bg-white shadow-md md:hidden"
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

                  <Link
                    href="/cart"
                    onClick={closeMenu}
                    className="mt-2 flex items-center justify-between rounded-xs px-2 py-2 uppercase tracking-[0.14em] hover:bg-black/5"
                  >
                    <span>CART</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        cartCount > 0
                          ? "bg-[#CE0028] text-white"
                          : "bg-black/5 text-black"
                      }`}
                    >
                      {cartCount}
                    </span>
                  </Link>

                  {!loading && !user && (
                    <button
                      onClick={openAuth}
                      className="mt-2 flex items-center justify-between rounded-xs px-2 py-2 uppercase tracking-[0.14em] hover:bg-black/5"
                      style={{ color: BRAND_RED }}
                    >
                      <span>ACCOUNT</span>
                      <span className="text-black">→</span>
                    </button>
                  )}

                  {!loading && user && (
                    <button
                      onClick={handleLogout}
                      className="mt-2 flex items-center justify-between rounded-xs px-2 py-2 uppercase tracking-[0.14em] hover:bg-black/5"
                      style={{ color: BRAND_RED }}
                    >
                      <span>LOGOUT</span>
                      <span className="text-black">→</span>
                    </button>
                  )}
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
        defaultMode="register"
      />
    </>
  );
}