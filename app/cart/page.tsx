"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    cartTotal,
  } = useCart();

  return (
    <div>
      <div className="relative -mt-[56px] h-[220px] w-full md:-mt-[72px] md:h-[300px]">
        <Image
          src="/images/ADD-TO-CART-bg.jpg"
          alt="Cart Banner"
          fill
          priority
          className="object-cover"
        />

        

        {/* <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[56px] text-center text-white md:pt-[72px]">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            BLTDIF
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Your Cart
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Review your selected products
          </p>
        </div> */}
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <Link
              href="/caps"
              className="mt-4 inline-block rounded-xl bg-black px-6 py-3 text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="h-9 w-9 rounded-lg border"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="h-9 w-9 rounded-lg border"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-medium text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="mt-4 flex items-center justify-between">
                <span>Total</span>
                <span className="text-lg font-bold">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-xl bg-black px-6 py-3 text-center text-white"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}