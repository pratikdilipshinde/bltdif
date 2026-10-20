"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import AuthModal from "./auth/AuthModal";
import StoryViewer from "./StoryViewer";

import { useAuth } from "@/app/providers/AuthProvider";
import { useCart } from "@/app/context/CartContext";

const categories = [
  { id: "6c4uk6", label: "HOODIE", href: "/products/hoodies" },
  { id: "tshirt", label: "T-SHIRT", href: "/products/t-shirts" },
  { id: "cap", label: "CAP", href: "/products/caps" },
];

const stories = [
  { id: 1, image: "/images/stories/story1.jpg", alt: "BLTDIF Story 1" },
  { id: 2, image: "/images/stories/story2.jpg", alt: "BLTDIF Story 2" },
  { id: 3, image: "/images/stories/story3.jpg", alt: "BLTDIF Story 3" },
  { id: 4, image: "/images/stories/story4.jpg", alt: "BLTDIF Story 4" },
  { id: 5, image: "/images/stories/story5.jpg", alt: "BLTDIF Story 5" },
  { id: 6, image: "/images/stories/story6.jpg", alt: "BLTDIF Story 6" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  const logoSrc = "/images/Footer-Logo.png";

  const cartCount =
    cartItems?.reduce(
      (total: number, item: any) => total + (item.quantity || 1),
      0
    ) || 0;

  const isCategoryActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  // Scroll detection — unchanged
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close account dropdown when clicking outside — unchanged
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus when route changes — unchanged
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
    setIsStoryViewerOpen(false);
  }, [pathname]);

  // Logout — unchanged
  const handleLogout = async () => {
    try {
      await logout();
      setIsAccountOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`
          fixed left-0 right-0 z-[50] px-3 pt-0 md:px-5 md:pt-0
          transition-[top] duration-500 ease-out
          ${isScrolled ? "top-5" : "top-[36px] md:top-[48px]"}
        `}
      >
        <nav
          className="
            liquid-navbar group/nav
            relative mx-auto flex h-[48px] w-full items-center
            justify-between overflow-visible rounded-[16px]
            border border-white/40
            bg-white/[0.15] px-4
            shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.55)]
            backdrop-blur-xs backdrop-saturate-150
            transition-all duration-500 ease-out
            hover:border-white/60
            hover:bg-white/[0.20]
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.7)]
            md:h-[68px] md:px-6
          "
        >
          {/* SOFT LIQUID GLOW */}
          <div
            className="
              pointer-events-none absolute -top-1/2 left-1/4
              h-full w-1/2 rounded-full
              bg-white/20 blur-xl opacity-70
              transition-all duration-700
              group-hover/nav:translate-x-1/2
              group-hover/nav:opacity-100
            "
          />

          {/* GLASS TOP REFLECTION */}
          <div
            className="
              pointer-events-none absolute inset-x-2 top-0 h-px
              bg-gradient-to-r from-transparent via-white/80 to-transparent
              opacity-80
              md:inset-x-4
            "
          />

          {/* BOTTOM REFLECTION */}
          <div
            className="
              pointer-events-none absolute inset-x-3 bottom-0 h-px
              bg-gradient-to-r from-transparent via-white/30 to-transparent
            "
          />

          {/* LOGO — ALWAYS LEFT */}
          <Link
            href="/"
            aria-label="BLTDIF Home"
            className="
              relative z-10 flex shrink-0 items-center
              transition-opacity duration-200 hover:opacity-90
            "
          >
            <Image
              src={logoSrc}
              alt="BLTDIF"
              width={125}
              height={32}
              priority
              className="h-auto w-[65px] object-contain md:w-[100px]"
            />
          </Link>

          {/* RIGHT SIDE */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* DESKTOP CATEGORY MENU */}
            <div className="hidden items-center gap-1 md:flex">
              {categories.map((category) => {
                const active = isCategoryActive(category.href);

                return (
                  <Link
                    key={category.id}
                    href={category.href}
                    className={`
                      relative flex h-[40px] items-center justify-center
                      rounded-2xl px-3 text-[12px] font-medium
                      tracking-[0.12em] text-black transition-all duration-300
                      ${
                        active
                          ? "bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                          : "hover:bg-white/55"
                      }
                    `}
                  >
                    {category.label}

                    {active && (
                      <motion.span
                        layoutId="navbar-active"
                        className="
                          absolute bottom-[6px] left-1/2 h-[2px] w-3
                          -translate-x-1/2 rounded-xl bg-[#ce0028]
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* DESKTOP DIVIDER */}
            <div className="mx-1 hidden h-7 w-px bg-white/25 md:block" />

            {/* STORY ICON */}
            <button
              type="button"
              aria-label="Open BLTDIF stories"
              aria-haspopup="dialog"
              aria-expanded={isStoryViewerOpen}
              onClick={() => {
                setIsStoryViewerOpen(true);
                setIsAccountOpen(false);
                setIsMobileMenuOpen(false);
              }}
              className="
                relative flex h-[40px] w-[40px] shrink-0
                cursor-pointer items-center justify-center rounded-full
                border border-white/40 bg-white/[0.12] p-[2px]
                shadow-[0_4px_15px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.45)]
                backdrop-blur-xs backdrop-saturate-150
                transition-all duration-500
                hover:scale-105 hover:border-white/60 hover:bg-white/20
                focus:outline-none focus:ring-2 focus:ring-white/60
                focus:ring-offset-2 focus:ring-offset-transparent
              "
            >
              <span
                className="
                  pointer-events-none absolute inset-0 rounded-full
                  bg-gradient-to-tl from-white/80 via-black/80 to-white/80
                  opacity-90
                "
              />

              <span
                className="
                  relative z-10 flex h-full w-full items-center
                  justify-center overflow-hidden rounded-full bg-black
                "
              >
                <Image
                  src="/images/BD-white-logo.png"
                  alt=""
                  width={20}
                  height={20}
                  className="h-full w-full object-contain p-1.5"
                />
              </span>
            </button>

            {/* DESKTOP ACCOUNT ICON */}
            <div ref={accountRef} className="relative hidden md:block">
              <button
                type="button"
                aria-label="Account"
                aria-expanded={isAccountOpen}
                onClick={() => {
                  setIsAccountOpen((prev) => !prev);
                  setIsMobileMenuOpen(false);
                }}
                className="
                  flex h-[40px] w-[40px] items-center justify-center
                  rounded-full border border-white/40 bg-white/[0.15]
                  text-black
                  shadow-[0_4px_15px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.45)]
                  backdrop-blur-xs backdrop-saturate-150
                  transition-all duration-500
                  hover:border-white/60 hover:bg-white/55
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.7)]
                  cursor-pointer
                "
              >
                <User size={17} strokeWidth={1.7} className="text-black" />
              </button>

              {/* DESKTOP ACCOUNT DROPDOWN */}
              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="
                      absolute right-0 top-[60px] w-[215px] overflow-hidden
                      rounded-[18px] border border-white/40
                      bg-white/35 p-2
                      shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)]
                      backdrop-blur-xs backdrop-saturate-150
                    "
                  >
                    {/* DROPDOWN TOP REFLECTION */}
                    <div
                      className="
                        pointer-events-none absolute inset-x-3 top-0 h-px
                        bg-gradient-to-r from-transparent via-white/70 to-transparent
                      "
                    />

                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsAccountOpen(false)}
                          className="
                            flex items-center gap-3 rounded-xl px-3 py-3
                            text-black transition-colors hover:bg-white/55 cursor-pointer
                          "
                        >
                          <LayoutDashboard size={16} strokeWidth={1.7} />
                          <span className="text-[11px] tracking-[0.08em]">
                            DASHBOARD
                          </span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setIsAccountOpen(false)}
                          className="
                            flex items-center gap-3 rounded-xl px-3 py-3
                            text-black transition-colors hover:bg-white/55 cursor-pointer
                          "
                        >
                          <User size={16} strokeWidth={1.7} />
                          <span className="text-[11px] tracking-[0.08em]">
                            PROFILE
                          </span>
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setIsAccountOpen(false)}
                          className="
                            flex items-center gap-3 rounded-xl px-3 py-3
                            text-black transition-colors hover:bg-white/55 cursor-pointer
                          "
                        >
                          <ShoppingBag size={16} strokeWidth={1.7} />
                          <span className="text-[11px] tracking-[0.08em]">
                            ORDERS
                          </span>
                        </Link>

                        <div className="my-1 h-px bg-white/15" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="
                            flex w-full items-center gap-3 rounded-xl
                            px-3 py-3 text-black transition-colors cursor-pointer
                            hover:bg-white/55
                          "
                        >
                          <LogOut size={16} strokeWidth={1.7} />
                          <span className="text-[11px] tracking-[0.08em]">
                            LOGOUT
                          </span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="
                          flex w-full items-center gap-3 rounded-xl
                          px-3 py-3 text-left text-black
                          transition-colors hover:bg-white/55 cursor-pointer
                        "
                      >
                        <User size={16} strokeWidth={1.7} />
                        <span className="text-[11px] tracking-[0.08em]">
                          LOGIN / SIGN UP
                        </span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DESKTOP CART */}
            <Link
              href="/cart"
              data-cart-icon="true"
              aria-label="Shopping cart"
              className="
                relative hidden h-[40px] w-[40px] items-center
                justify-center rounded-full
                border border-white/40 bg-white/[0.15] text-black
                shadow-[0_4px_15px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.45)]
                backdrop-blur-xs backdrop-saturate-150
                transition-all duration-500
                hover:border-white/60 hover:bg-white/55
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.7)]
                md:flex
              "
            >
              <ShoppingBag
                size={17}
                strokeWidth={1.7}
                className="text-black"
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1 flex h-[17px] min-w-[17px]
                    items-center justify-center rounded-full bg-[#CE0028]
                    px-1 text-[8px] font-semibold text-white shadow-md
                  "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsAccountOpen(false);
              }}
              className="
                flex h-[40px] w-[40px] items-center justify-center
                rounded-full border border-white/40 bg-white/[0.15]
                text-black
                shadow-[0_4px_15px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.45)]
                backdrop-blur-xs backdrop-saturate-150
                transition-all duration-500
                hover:border-white/60 hover:bg-white/25
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.7)]
                md:hidden
              "
            >
              {isMobileMenuOpen ? (
                <X size={18} strokeWidth={1.7} className="text-black" />
              ) : (
                <Menu size={18} strokeWidth={1.7} className="text-black" />
              )}
            </button>
          </div>
        </nav>

        {/* MOBILE GLASS MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="
                liquid-navbar group/mobile-menu
                relative mt-2 overflow-hidden rounded-[18px]
                border border-white/40 bg-white/[0.15] p-2
                shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.55)]
                backdrop-blur-xs backdrop-saturate-150
                transition-all duration-500 ease-out
                md:hidden
              "
            >
              {/* MOBILE MENU TOP REFLECTION */}
              <div
                className="
                  pointer-events-none absolute inset-x-3 top-0 h-px
                  bg-gradient-to-r from-transparent via-white/80 to-transparent
                "
              />

              {/* MOBILE MENU SOFT GLOW */}
              <div
                className="
                  pointer-events-none absolute -top-8 left-1/4
                  h-20 w-1/2 rounded-full bg-white/15 blur-2xl
                "
              />

              {/* MOBILE CATEGORIES */}
              <div className="relative z-10">
                {categories.map((category) => {
                  const active = isCategoryActive(category.href);

                  return (
                    <Link
                      key={category.id}
                      href={category.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center justify-between rounded-xl
                        px-4 py-3.5 text-black transition-colors
                        ${active ? "bg-white/20" : "hover:bg-white/10"}
                      `}
                    >
                      <span className="text-[11px] font-medium tracking-[0.12em]">
                        {category.label}
                      </span>

                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </Link>
                  );
                })}

                <div className="my-1 h-px bg-white/20" />

                {/* MOBILE CART */}
                <Link
                  href="/cart"
                  data-cart-icon="true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    flex items-center gap-3 rounded-xl px-4 py-3.5
                    text-black transition-colors hover:bg-white/10
                  "
                >
                  <ShoppingBag size={17} strokeWidth={1.7} />

                  <span className="text-[11px] font-medium tracking-[0.12em]">
                    CART
                  </span>

                  {cartCount > 0 && (
                    <span
                      className="
                        ml-auto flex h-5 min-w-5 items-center justify-center
                        rounded-full bg-[#CE0028] px-1.5 text-[9px]
                        font-semibold text-white
                      "
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* MOBILE ACCOUNT */}
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3 rounded-xl px-4 py-3.5
                        text-black transition-colors hover:bg-white/10
                      "
                    >
                      <User size={17} strokeWidth={1.7} />
                      <span className="text-[11px] font-medium tracking-[0.12em]">
                        ACCOUNT
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex w-full items-center gap-3 rounded-xl px-4 py-3.5
                        text-left text-black transition-colors hover:bg-white/10
                      "
                    >
                      <LogOut size={17} strokeWidth={1.7} />
                      <span className="text-[11px] font-medium tracking-[0.12em]">
                        LOGOUT
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="
                      flex w-full items-center gap-3 rounded-xl px-4 py-3.5
                      text-left text-black transition-colors hover:bg-white/10
                    "
                  >
                    <User size={17} strokeWidth={1.7} />
                    <span className="text-[11px] font-medium tracking-[0.12em]">
                      LOGIN / SIGN UP
                    </span>
                  </button>
                )}
              </div>

              {/* MOBILE MENU BOTTOM REFLECTION */}
              <div
                className="
                  pointer-events-none absolute inset-x-3 bottom-0 h-px
                  bg-gradient-to-r from-transparent via-white/30 to-transparent
                "
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* STORY VIEWER */}
      <StoryViewer
        stories={stories}
        open={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
      />

      {/* AUTH MODAL */}
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}