
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Package,
  Truck,
  MapPin,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

import { createClient } from "@/app/lib/supabase/client";

type OrderItem = {
  id: string;
  productName: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice?: string;
  totalPrice?: string;
  sizeLabel?: string | null;
  color?: string | null;
  sku?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: string;
  subtotalAmount?: string;
  shippingAmount?: string;
  discountAmount?: string;
  taxAmount?: string;
  currencyCode: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  items: OrderItem[];
};

const glassPanel =
  "border border-white/75 bg-white/[0.48] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_10px_35px_rgba(0,0,0,0.045)] backdrop-blur-2xl";

const glassInner =
  "border border-white/80 bg-white/[0.52] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_18px_rgba(0,0,0,0.025)] backdrop-blur-xl";

function formatMoney(currency: string, amount?: string) {
  const value = Number(amount ?? 0);

  return `${currency} ${
    Number.isFinite(value) ? value.toFixed(2) : "0.00"
  }`;
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: string) {
  const normalized = status.toUpperCase();

  if (
    ["PAID", "CONFIRMED", "DELIVERED", "SUCCESS", "COMPLETED"].includes(
      normalized
    )
  ) {
    return "border-emerald-500/20 bg-emerald-50/80 text-emerald-700";
  }

  if (
    ["PENDING", "PROCESSING", "PACKED", "SHIPPED"].includes(normalized)
  ) {
    return "border-amber-500/20 bg-amber-50/80 text-amber-700";
  }

  if (
    ["FAILED", "CANCELLED", "REFUNDED"].includes(normalized)
  ) {
    return "border-red-500/20 bg-red-50/80 text-red-700";
  }

  return "border-black/10 bg-white/65 text-black/60";
}

function canCancelOrder(status: string) {
  return ["PENDING", "CONFIRMED", "PROCESSING"].includes(
    status.toUpperCase()
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] ${statusClass(
        status
      )}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function LoadingState() {
  return (
    <div className={`rounded-[26px] p-6 md:p-8 ${glassPanel}`}>
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/70">
          <Package className="size-5 animate-pulse text-black/45" />
        </div>

        <div className="flex-1">
          <div className="h-3 w-32 animate-pulse rounded-full bg-black/[0.08]" />
          <div className="mt-3 h-2.5 w-48 max-w-full animate-pulse rounded-full bg-black/[0.05]" />
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-2xl border border-white/70 bg-white/35"
          />
        ))}
      </div>

      <p className="mt-5 text-xs font-medium text-black/45">
        Loading your BLTDIF orders...
      </p>
    </div>
  );
}

function EmptyState({
  email,
  loggedOut = false,
}: {
  email?: string;
  loggedOut?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] p-7 md:p-12 ${glassPanel}`}>
      <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-[#CE0028]/[0.045] blur-[75px]" />

      <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-[22px] border border-white/80 bg-white/55 shadow-lg backdrop-blur-xl">
          {loggedOut ? (
            <CreditCard className="size-7 text-black/65" />
          ) : (
            <ShoppingBag className="size-7 text-black/65" />
          )}
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#CE0028]">
          {loggedOut ? "Account Required" : "Your Order History"}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black md:text-3xl">
          {loggedOut ? "Please log in" : "Nothing here just yet"}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-black/55">
          {loggedOut
            ? "Log in to your BLTDIF account to view your purchases and track your deliveries."
            : "Your orders will appear here once you make your first BLTDIF purchase."}
        </p>

        {email && (
          <p className="mt-3 rounded-full border border-white/80 bg-white/55 px-4 py-2 text-xs text-black/55">
            Account: <span className="font-semibold text-black">{email}</span>
          </p>
        )}

        <Link
          href={loggedOut ? "/login" : "/products"}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-[#CE0028] active:scale-[0.98]"
        >
          {loggedOut ? "Login to Account" : "Explore Collection"}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export default function MyOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );

  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      try {
        setLoading(true);
        setFetchError(null);

        const supabase = createClient();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        const userEmail = user?.email;

        if (!userEmail) {
          if (active) setEmail("");
          return;
        }

        if (active) setEmail(userEmail);

        const res = await fetch(
          `/api/shop/orders/my-orders?email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Unable to load your orders.");
        }

        if (active) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        if (active) {
          setFetchError(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading your orders."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  async function handleCancelOrder(orderId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);
      setCancelError(null);
      setCancelSuccess(null);

      const res = await fetch("/api/shop/orders/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setCancelError(data.error || "Unable to cancel order.");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderStatus: "CANCELLED",
              }
            : order
        )
      );

      setCancelSuccess("Your order has been cancelled successfully.");
    } catch (error) {
      console.error("Cancel order failed:", error);
      setCancelError("Something went wrong while cancelling the order.");
    } finally {
      setCancellingOrderId(null);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!email) {
    return <EmptyState loggedOut />;
  }

  if (fetchError) {
    return (
      <div className={`rounded-[26px] p-6 md:p-8 ${glassPanel}`}>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#CE0028]">
            <XCircle className="size-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-black">
              Unable to load orders
            </h2>

            <p className="mt-1 text-sm text-black/55">{fetchError}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#CE0028]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyState email={email} />;
  }

  const activeOrders = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED", "REFUNDED"].includes(
        order.orderStatus.toUpperCase()
      )
  ).length;

  return (
    <div className="space-y-6">

      {/* ORDER OVERVIEW */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className={`rounded-[22px] p-4 md:p-5 ${glassPanel}`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45 md:text-[10px]">
              Total Orders
            </p>

            <ShoppingBag className="size-4 text-black/35" />
          </div>

          <p className="mt-3 text-2xl font-semibold tabular-nums text-black md:text-3xl">
            {orders.length}
          </p>
        </div>

        <div className={`rounded-[22px] p-4 md:p-5 ${glassPanel}`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45 md:text-[10px]">
              In Progress
            </p>

            <Truck className="size-4 text-black/35" />
          </div>

          <p className="mt-3 text-2xl font-semibold tabular-nums text-black md:text-3xl">
            {activeOrders}
          </p>
        </div>

        <div className={`col-span-2 rounded-[22px] p-4 md:col-span-1 md:p-5 ${glassPanel}`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45 md:text-[10px]">
              Account
            </p>

            <CheckCircle2 className="size-4 text-emerald-600/70" />
          </div>

          <p className="mt-3 truncate text-sm font-semibold text-black">
            {email}
          </p>
        </div>
      </div>

      {/* ORDER LIST HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#CE0028]">
            Your Purchases
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-black md:text-2xl">
            Order History
          </h2>
        </div>

        <p className="text-xs text-black/45">
          Select an order to view details
        </p>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isOpen = expandedOrderId === order.id;
          const isCancellable = canCancelOrder(order.orderStatus);
          const isCancelling = cancellingOrderId === order.id;

          return (
            <article
              key={order.id}
              className={`relative overflow-hidden rounded-[24px] transition-all duration-300 md:rounded-[28px] ${
                isOpen
                  ? "border border-white/90 bg-white/[0.62] shadow-[0_15px_45px_rgba(0,0,0,0.065)] backdrop-blur-2xl"
                  : glassPanel
              }`}
            >
              {/* Subtle glass highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white" />

              {/* ORDER HEADER */}
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setExpandedOrderId(isOpen ? null : order.id);
                  setCancelError(null);
                  setCancelSuccess(null);
                }}
                className="relative w-full p-4 text-left transition-colors hover:bg-white/20 md:p-6"
              >
                <div className="flex items-start justify-between gap-3 md:gap-6">
                  <div className="flex min-w-0 items-start gap-3 md:gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white/65 shadow-sm md:size-12">
                      <Package className="size-5 text-black/65" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#CE0028]">
                        Order Number
                      </p>

                      <h3 className="mt-1 truncate text-sm font-bold text-black md:text-base">
                        {order.orderNumber}
                      </h3>

                      <p className="mt-1 text-[11px] text-black/45 md:text-xs">
                        {formatDate(order.createdAt)}
                        {" · "}
                        {order.items.length} product
                        {order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums text-black md:text-lg">
                      {formatMoney(order.currencyCode, order.totalAmount)}
                    </p>

                    <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-medium text-black/40">
                      <span className="hidden md:inline">
                        {isOpen ? "Hide details" : "View details"}
                      </span>

                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 pl-0 md:pl-16">
                  <StatusBadge status={order.orderStatus} />
                  <StatusBadge status={order.paymentStatus} />

                  {order.trackingNumber ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/60 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-black/55">
                      <Truck className="size-3" />
                      Tracking Added
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                      <Clock3 className="size-3" />
                      Awaiting Tracking
                    </span>
                  )}
                </div>
              </button>

              {/* EXPANDED DETAILS */}
              {isOpen && (
                <div className="relative border-t border-white/90 bg-white/[0.16] p-4 md:p-6">
                  <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

                    {/* LEFT: PRODUCTS */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#CE0028]">
                            Order Details
                          </p>

                          <h4 className="mt-1 text-base font-semibold text-black">
                            Your Items
                          </h4>
                        </div>

                        <span className="rounded-full border border-white/90 bg-white/60 px-3 py-1.5 text-[10px] font-semibold text-black/50">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          items
                        </span>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className={`grid grid-cols-[76px_1fr] gap-3 rounded-[20px] p-3 md:grid-cols-[88px_1fr_auto] md:items-center md:gap-4 ${glassInner}`}
                          >
                            {/* PRODUCT IMAGE */}
                            <div className="relative size-[76px] overflow-hidden rounded-xl border border-white/80 bg-[#efeeeb] md:size-[88px]">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  fill
                                  sizes="(max-width: 768px) 76px, 88px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-wider text-black/25">
                                  BLTDIF
                                </div>
                              )}
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="min-w-0">
                              <h5 className="line-clamp-2 text-sm font-semibold leading-snug text-black">
                                {item.productName}
                              </h5>

                              {item.sku && (
                                <p className="mt-1 truncate text-[10px] text-black/35">
                                  SKU: {item.sku}
                                </p>
                              )}

                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.sizeLabel && (
                                  <span className="rounded-full border border-white/90 bg-white/65 px-2.5 py-1 text-[10px] text-black/60">
                                    Size: {item.sizeLabel}
                                  </span>
                                )}

                                {item.color && (
                                  <span className="rounded-full border border-white/90 bg-white/65 px-2.5 py-1 text-[10px] text-black/60">
                                    {item.color}
                                  </span>
                                )}

                                <span className="rounded-full border border-white/90 bg-white/65 px-2.5 py-1 text-[10px] text-black/60">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>

                            {/* ITEM PRICE */}
                            <div className="col-span-2 flex items-center justify-between border-t border-white/80 pt-2 md:col-span-1 md:block md:border-t-0 md:pt-0 md:text-right">
                              <p className="text-[10px] text-black/40">
                                Item Total
                              </p>

                              <p className="text-sm font-bold text-black">
                                {formatMoney(
                                  order.currencyCode,
                                  item.totalPrice
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT: ORDER INFORMATION */}
                    <aside className="space-y-4">

                      {/* ORDER ACTION */}
                      <div className={`rounded-[20px] p-4 ${glassInner}`}>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                          Order Actions
                        </p>

                        {/* {isCancellable ? (
                          <>
                            <p className="mt-3 text-xs leading-relaxed text-black/55">
                              Need to change your mind? You can cancel this
                              order before it moves further through fulfilment.
                            </p>

                            <button
                              type="button"
                              disabled={isCancelling}
                              onClick={() => handleCancelOrder(order.id)}
                              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#CE0028]/15 bg-[#CE0028]/[0.06] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#CE0028] transition-all duration-300 hover:bg-[#CE0028] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isCancelling
                                ? "Cancelling Order..."
                                : "Cancel Order"}
                            </button>
                          </>
                        ) : ( */}
                          <p className="mt-3 text-xs leading-relaxed text-black/55">
                            This order cannot currently be cancelled. Current
                            status:{" "}
                            <span className="font-semibold text-black">
                              {order.orderStatus}
                            </span>
                            .
                          </p>
                        {/* )} */}

                        {/* {cancelError && (
                          <p
                            role="alert"
                            className="mt-3 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-xs font-medium text-red-700"
                          >
                            {cancelError}
                          </p>
                        )}

                        {cancelSuccess && (
                          <p
                            role="status"
                            className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2.5 text-xs font-medium text-emerald-700"
                          >
                            {cancelSuccess}
                          </p>
                        )} */}
                      </div>

                      {/* PRICE SUMMARY */}
                      <div className={`rounded-[20px] p-4 ${glassInner}`}>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                          Payment Summary
                        </p>

                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between gap-3 text-xs">
                            <span className="text-black/50">Subtotal</span>
                            <span className="font-medium text-black">
                              {formatMoney(
                                order.currencyCode,
                                order.subtotalAmount
                              )}
                            </span>
                          </div>

                          {Number(order.discountAmount ?? 0) > 0 && (
                            <div className="flex justify-between gap-3 text-xs">
                              <span className="text-emerald-700">
                                Discount
                              </span>
                              <span className="font-semibold text-emerald-700">
                                −
                                {formatMoney(
                                  order.currencyCode,
                                  order.discountAmount
                                )}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between gap-3 text-xs">
                            <span className="text-black/50">Shipping</span>
                            <span className="font-medium text-black">
                              {formatMoney(
                                order.currencyCode,
                                order.shippingAmount
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3 text-xs">
                            <span className="text-black/50">Tax</span>
                            <span className="font-medium text-black">
                              {formatMoney(
                                order.currencyCode,
                                order.taxAmount
                              )}
                            </span>
                          </div>

                          <div className="border-t border-white/90 pt-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold text-black">
                                Total Paid
                              </span>

                              <span className="text-base font-bold text-black">
                                {formatMoney(
                                  order.currencyCode,
                                  order.totalAmount
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TRACKING */}
                      {order.trackingNumber && (
                        <div className={`rounded-[20px] p-4 ${glassInner}`}>
                          <div className="flex items-center gap-2">
                            <Truck className="size-4 text-[#CE0028]" />

                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/45">
                              Shipment Tracking
                            </p>
                          </div>

                          <p className="mt-3 text-xs text-black/50">
                            {order.courierName || "Courier"}
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-black">
                            {order.trackingNumber}
                          </p>

                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#CE0028]"
                            >
                              Track Shipment
                              <ArrowUpRight className="size-3.5" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* DELIVERY ADDRESS */}
                      {order.addressLine1 && (
                        <div className={`rounded-[20px] p-4 ${glassInner}`}>
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-[#CE0028]" />

                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/45">
                              Delivery Address
                            </p>
                          </div>

                          <div className="mt-3 text-xs leading-6 text-black/55">
                            <p className="font-semibold text-black">
                              {order.customerName}
                            </p>

                            {order.addressLine1}
                            <br />

                            {order.addressLine2 && (
                              <>
                                {order.addressLine2}
                                <br />
                              </>
                            )}

                            {order.city}, {order.state} {order.zipCode}
                            <br />
                            {order.country}
                          </div>
                        </div>
                      )}
                    </aside>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* BOTTOM SHOPPING LINK */}
      {/* <div className="flex justify-center pt-3">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/45 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-black/65 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-black hover:text-white"
        >
          Explore More Products
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div> */}
    </div>
  );
}
