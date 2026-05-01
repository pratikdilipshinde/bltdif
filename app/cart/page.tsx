"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/shop-v2/formatPrice";

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, cartTotal } =
    useCart();

  return (
    <main className="bg-[#f7f5f1] text-black">
      <section className="relative -mt-[56px] h-[240px] w-full overflow-hidden md:-mt-[72px] md:h-[340px]">
        <Image
          src="/images/ADD-TO-CART-bg.jpg"
          alt="Cart Banner"
          fill
          priority
          className="object-cover"
        />

      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {cartItems.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-xs border border-black/10 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>

            <p className="mt-2 text-sm leading-6 text-black/55">
              Start adding BLTDIF pieces to your cart and they will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xs bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#CE0028]"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_0.9fr]">
            <div className="space-y-4">
              <div className="hidden border-b border-black/10 pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-black/45 md:grid md:grid-cols-[1.4fr_0.5fr_0.45fr_0.4fr]">
                <span>Product</span>
                <span>Quantity</span>
                <span className="text-right">Subtotal</span>
                <span />
              </div>

              {cartItems.map((item) => {
                const variantText = [
                  item.size_label ? `Size: ${item.size_label}` : null,
                  item.color ? `Color: ${item.color}` : null,
                  item.sku ? `SKU: ${item.sku}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={item.id}
                    className="grid gap-4 rounded-xs border border-black/10 bg-white p-4 md:grid-cols-[1.4fr_0.5fr_0.45fr_0.4fr] md:items-center"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={item.slug ? `/products/${item.slug}` : "/products"}
                        className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xs bg-[#f1f1f3]"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </Link>

                      <div className="min-w-0 py-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#CE0028]">
                          {item.category_code ?? "BLTDIF"}
                        </p>

                        <Link
                          href={
                            item.slug ? `/products/${item.slug}` : "/products"
                          }
                          className="mt-1 block text-base font-semibold text-black transition hover:text-[#CE0028]"
                        >
                          {item.name}
                        </Link>

                        {variantText && (
                          <p className="mt-2 text-xs leading-5 text-black/50">
                            {variantText}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-semibold text-black">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-fit items-center rounded-xs border border-black/10 bg-white">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="flex h-10 w-10 items-center justify-center transition hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="flex h-10 w-10 items-center justify-center transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                        disabled={
                          item.max_quantity
                            ? item.quantity >= item.max_quantity
                            : false
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-left text-base font-semibold text-black md:text-right">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-black/45 transition hover:text-[#CE0028] md:ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-xs border border-black/10 bg-white p-6 lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#CE0028]">
                Order Summary
              </p>

              <h2 className="mt-2 text-2xl font-semibold">Checkout Details</h2>

              <div className="mt-6 space-y-4 border-y border-black/10 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/55">Items</span>
                  <span className="font-semibold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/55">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* <div className="flex items-center justify-between text-sm">
                  <span className="text-black/55">Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div> */}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-2xl font-semibold">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CE0028]"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="mt-3 flex w-full items-center justify-center rounded-xs border border-black/10 px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Continue Shopping
              </Link>

              <p className="mt-5 text-xs leading-5 text-black/45">
                Your selected variant, size, color, SKU, and quantity are saved
                in the cart for checkout.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}