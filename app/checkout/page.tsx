"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/providers/AuthProvider";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState("");

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName:
          prev.fullName ||
          [user.firstname, user.lastname].filter(Boolean).join(" ") ||
          prev.fullName,
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!cartItems.length) return "Your cart is empty.";
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.addressLine1.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state.trim()) return "State is required.";
    if (!form.postalCode.trim()) return "Postal code is required.";
    if (!form.country.trim()) return "Country is required.";
    if (!scriptLoaded) return "Payment SDK is still loading. Please try again.";
    return "";
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const createOrderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: cartItems,
        }),
      });

      const createOrderData = await createOrderRes.json();

      if (!createOrderRes.ok) {
        throw new Error(createOrderData.error || "Failed to create order.");
      }

      const options = {
        key: createOrderData.keyId,
        amount: createOrderData.amount,
        currency: createOrderData.currency,
        name: "BLTDIF",
        description: `Order for ${totalItems} item${totalItems > 1 ? "s" : ""}`,
        image: "/images/Logo.png",
        order_id: createOrderData.orderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: [
            form.addressLine1,
            form.addressLine2,
            form.city,
            form.state,
            form.postalCode,
            form.country,
          ]
            .filter(Boolean)
            .join(", "),
        },
        theme: {
          color: "#CE0028",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              customer: form,
              items: cartItems,
              amount: createOrderData.amount,
              currency: createOrderData.currency,
              internalOrderId: createOrderData.internalOrderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            setError(verifyData.error || "Payment verification failed.");
            return;
          }

          clearCart();
          router.push(`/checkout/success?order=${createOrderData.internalOrderId}`);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(
          response?.error?.description || "Payment failed. Please try again."
        );
        setLoading(false);
      });

      rzp.open();
      setLoading(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <section className="bg-white px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-xs border border-black/10 p-8 text-center">
          <h1 className="text-2xl font-semibold text-black">Your cart is empty</h1>
          <p className="mt-3 text-black/60">
            Add products to your cart before checkout.
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="mt-6 rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Go to cart
          </button>
        </div>
      </section>
    );
  }

  return (
  <>
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      onLoad={() => setScriptLoaded(true)}
    />

    <section className="bg-white">
      {/* 🔥 HERO SECTION */}
      <div className="relative -mt-[56px] h-[240px] w-full md:-mt-[72px] md:h-[320px]">
        <Image
          src="/images/PAYMENT-CHECKOUT-bg.jpg"
          alt="Checkout Banner"
          fill
          priority
          className="object-cover"
        />


      </div>

      {/* 🔽 ORIGINAL CONTENT */}
      <div className="px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-black/45">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-black md:text-4xl">
              Shipping & Payment
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <form
              onSubmit={handleCheckout}
              className="rounded-xs border border-black/10 bg-white p-5 md:p-7"
            >
              <h2 className="text-lg font-semibold text-black">
                Delivery details
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
              </div>

              <div className="mt-4 grid gap-4">
                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="Address line 1"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
                <input
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Address line 2 (optional)"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="rounded-xs border border-black/10 px-4 py-3 text-sm text-black outline-none focus:border-black/30"
                />
              </div>

              {error ? (
                <p className="mt-4 text-sm font-medium text-[#CE0028]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>
            </form>

            <aside className="h-fit rounded-xs border border-black/10 bg-[#fafafa] p-5 md:p-7">
              <h2 className="text-lg font-semibold text-black">
                Order summary
              </h2>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-black/10 pb-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-black/55">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-black">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-black/65">Items</span>
                <span className="text-sm font-medium text-black">
                  {totalItems}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-black/65">Total</span>
                <span className="text-xl font-semibold text-black">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  </>
);
}