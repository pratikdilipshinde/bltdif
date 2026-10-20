"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/shop-v2/formatPrice";
import { metaPixelEvent } from "../lib/metaPixel";
import AnnouncementBar from "../components/AnnouncementBar";

const glassPanel =
  "border border-white/70 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_8px_30px_rgba(0,0,0,0.045)] backdrop-blur-2xl";

const glassButton =
  "border border-white/80 bg-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_3px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:bg-white/75";

export default function CartPageClient() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    cartTotal,
  } = useCart();

  const handleInitiateCheckout = () => {
    metaPixelEvent("InitiateCheckout", {
      value: Number(cartTotal),
      currency: "INR",
      num_items: cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      content_ids: cartItems.map((item) => String(item.id)),
      content_type: "product",
    });
  };

  return (
    <>
      <AnnouncementBar />

      <main className="relative min-h-screen overflow-hidden bg-[#f4f3f0] pt-15 text-black md:pt-25">
        {/* Ambient glass background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-white/80 blur-[100px]" />
          <div className="absolute -right-24 top-[28rem] h-96 w-96 rounded-full bg-[#CE0028]/[0.045] blur-[120px]" />
          <div className="absolute left-1/3 top-[55rem] h-72 w-72 rounded-full bg-white/70 blur-[100px]" />
        </div>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-5 md:py-5">
          {/* PAGE HEADING */}
          {/* <div className="mb-8 md:mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#CE0028] md:text-xs">
              BLTDIF / Your Selection
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              Shopping Bag
            </h1>

            <p className="mt-2 text-sm text-black/50">
              Your selected pieces, all in one place.
            </p>
          </div> */}

          {cartItems.length === 0 ? (
            /* EMPTY CART */
            <div
              className={`mx-auto max-w-xl rounded-[28px] p-8 text-center md:p-12 ${glassPanel}`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-white/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_6px_20px_rgba(0,0,0,0.06)]">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/55">
                Start adding BLTDIF pieces to your cart and they will
                appear here.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-[#CE0028] hover:shadow-xl"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* CART WITH ITEMS */
            <div className="grid gap-7 lg:grid-cols-[1.8fr_0.9fr] lg:gap-8">
              {/* PRODUCTS */}
              <div className="min-w-0 space-y-4">
                <div className="hidden grid-cols-[1.4fr_0.5fr_0.45fr_0.4fr] border-b border-black/10 px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45 md:grid">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span className="text-right">Subtotal</span>
                  <span />
                </div>

                {cartItems.map((item) => {
                  const variantText = [
                    item.size_label
                      ? `Size: ${item.size_label}`
                      : null,
                    item.color ? `Color: ${item.color}` : null,
                    item.sku ? `SKU: ${item.sku}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <article
                      key={item.id}
                      className={`grid gap-4 rounded-[22px] p-4 transition duration-300 hover:border-white hover:bg-white/[0.62] md:grid-cols-[1.4fr_0.5fr_0.45fr_0.4fr] md:items-center md:p-5 ${glassPanel}`}
                    >
                      {/* PRODUCT */}
                      <div className="flex min-w-0 gap-4">
                        <Link
                          href={
                            item.slug
                              ? `/products/${item.slug}`
                              : "/products"
                          }
                          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-white/80 bg-white/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-contain p-1.5 transition-transform duration-500 hover:scale-105"
                          />
                        </Link>

                        <div className="min-w-0 py-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#CE0028]">
                            {item.category_code ?? "BLTDIF"}
                          </p>

                          <Link
                            href={
                              item.slug
                                ? `/products/${item.slug}`
                                : "/products"
                            }
                            className="mt-1 block text-sm font-semibold leading-5 text-black transition hover:text-[#CE0028] md:text-base"
                          >
                            {item.name}
                          </Link>

                          {variantText && (
                            <p className="mt-2 text-[11px] leading-5 text-black/50">
                              {variantText}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-semibold text-black">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* QUANTITY */}
                      <div className="flex items-center justify-between md:justify-start">
                        <span className="text-xs text-black/50 md:hidden">
                          Quantity
                        </span>

                        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/90 bg-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_3px_10px_rgba(0,0,0,0.035)] backdrop-blur-xl">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item.id)}
                            className="flex h-9 w-9 items-center justify-center transition hover:bg-white/80 active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-9 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQty(item.id)}
                            className="flex h-9 w-9 items-center justify-center transition hover:bg-white/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={
                              item.max_quantity
                                ? item.quantity >= item.max_quantity
                                : false
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* SUBTOTAL */}
                      <div className="flex items-center justify-between md:block">
                        <span className="text-xs text-black/50 md:hidden">
                          Subtotal
                        </span>

                        <p className="text-base font-semibold text-black md:text-right">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg py-1 text-xs font-semibold text-black/45 transition hover:text-[#CE0028] md:ml-auto md:justify-self-end"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* ORDER SUMMARY */}
              <aside
                className={`h-fit rounded-[26px] p-6 md:p-7 lg:sticky lg:top-24 ${glassPanel}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#CE0028]">
                  BLTDIF / Order
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Checkout Details
                </h2>

                <p className="mt-1 text-sm text-black/45">
                  Review your selection before proceeding.
                </p>

                <div className="mt-6 space-y-4 border-y border-white/90 py-5">
                  {/* ITEMS */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">Items</span>

                    <span className="font-semibold tabular-nums">
                      {cartItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </span>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">Subtotal</span>

                    <span className="font-semibold">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className="pb-1 text-sm font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-semibold tracking-tight">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* CHECKOUT */}
                <Link
                  href="/checkout"
                  onClick={handleInitiateCheckout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition duration-300 hover:bg-[#CE0028] hover:shadow-[0_8px_24px_rgba(206,0,40,0.2)] active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {/* CONTINUE SHOPPING */}
                <Link
                  href="/"
                  className={`mt-3 flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold ${glassButton}`}
                >
                  Continue Shopping
                </Link>

                <div className="mt-5 flex gap-2 rounded-xl border border-white/80 bg-white/30 p-3.5">
                  <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-black/45" />

                  <p className="text-[11px] leading-5 text-black/50">
                    Your selected variant, size, color, SKU, and quantity
                    are saved in the cart for checkout.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
    </>
  );
}