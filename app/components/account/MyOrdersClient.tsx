"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Package } from "lucide-react";
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

function statusClass(status: string) {
  if (["PAID", "CONFIRMED", "DELIVERED"].includes(status)) {
    return "border-emerald-500/20 bg-emerald-50 text-emerald-700";
  }

  if (["PENDING", "PROCESSING", "PACKED", "SHIPPED"].includes(status)) {
    return "border-amber-500/20 bg-amber-50 text-amber-700";
  }

  if (["FAILED", "CANCELLED", "REFUNDED"].includes(status)) {
    return "border-red-500/20 bg-red-50 text-red-700";
  }

  return "border-black/10 bg-white text-black/60";
}

function canCancelOrder(status: string) {
  return ["PENDING", "CONFIRMED", "PROCESSING"].includes(status);
}

export default function MyOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const userEmail = user?.email;

        if (!userEmail) {
          setLoading(false);
          return;
        }

        setEmail(userEmail);

        const res = await fetch(
          `/api/shop/orders/my-orders?email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
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

      setCancelSuccess("Order cancelled successfully.");
    } catch (error) {
      console.error("Cancel order failed:", error);
      setCancelError("Something went wrong while cancelling the order.");
    } finally {
      setCancellingOrderId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-sm text-black/55">Loading your orders...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="rounded-xl border border-black/10 bg-[#fafafa] p-5">
        <h2 className="text-xl font-semibold text-black">Please log in</h2>
        <p className="mt-2 text-sm text-black/60">
          Log in with the same email used during checkout.
        </p>

        <Link
          href="/login"
          className="mt-4 inline-flex rounded-full bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#CE0028]"
        >
          Login
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-black/10 bg-[#fafafa] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#CE0028]">
          No Orders Found
        </p>

        <h2 className="mt-2 text-xl font-semibold text-black">
          No orders linked to this email.
        </h2>

        <p className="mt-2 text-sm text-black/60">
          Checked orders for <span className="font-medium">{email}</span>.
        </p>

        <Link
          href="/"
          className="mt-4 inline-flex rounded-full bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#CE0028]"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const isOpen = expandedOrderId === order.id;
        const isCancellable = canCancelOrder(order.orderStatus);
        const isCancelling = cancellingOrderId === order.id;

        return (
          <div
            key={order.id}
            className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => {
                setExpandedOrderId(isOpen ? null : order.id);
                setCancelError(null);
                setCancelSuccess(null);
              }}
              className="w-full px-3 py-3 text-left md:px-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#CE0028]">
                    Order
                  </p>

                  <h2 className="mt-1 truncate text-base font-bold text-black md:text-lg">
                    {order.orderNumber}
                  </h2>

                  <p className="mt-0.5 text-xs text-black/50">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {order.items.length} item(s)
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-black">
                    {order.currencyCode} {order.totalAmount}
                  </p>

                  <ChevronDown
                    className={`ml-auto mt-1 h-4 w-4 text-black/45 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusClass(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>

                {order.trackingNumber ? (
                  <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/55">
                    Tracking Added
                  </span>
                ) : (
                  <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                    Awaiting Tracking
                  </span>
                )}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-black/10 bg-[#fafafa] px-3 py-3 md:px-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#CE0028]" />
                      <h3 className="text-sm font-bold text-black">Items</h3>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-[64px_1fr] gap-3 rounded-lg border border-black/10 bg-white p-2.5 md:grid-cols-[72px_1fr_auto]"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-[#f1f1f3] md:h-18 md:w-18">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-black/25">
                                BLTDIF
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-black">
                              {item.productName}
                            </h4>

                            {item.sku && (
                              <p className="mt-0.5 truncate text-[11px] text-black/40">
                                SKU: {item.sku}
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.sizeLabel && (
                                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] text-black/60">
                                  Size: {item.sizeLabel}
                                </span>
                              )}

                              {item.color && (
                                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] text-black/60">
                                  {item.color}
                                </span>
                              )}

                              <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] text-black/60">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-2 flex items-center justify-between border-t border-black/5 pt-2 md:col-span-1 md:block md:border-t-0 md:pt-0 md:text-right">
                            <p className="text-[11px] text-black/40">Total</p>
                            <p className="text-sm font-bold text-black">
                              {order.currencyCode}{" "}
                              {item.totalPrice || order.totalAmount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside className="space-y-3">
                    <div className="rounded-lg border border-black/10 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                        Order Action
                      </p>

                      {isCancellable ? (
                        <>
                          <p className="mt-2 text-sm text-black/60">
                            You can cancel this order before it is shipped.
                          </p>

                          <button
                            type="button"
                            disabled={isCancelling}
                            onClick={() => handleCancelOrder(order.id)}
                            className="mt-3 inline-flex w-full justify-center rounded-full bg-[#CE0028] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isCancelling ? "Cancelling..." : "Cancel Order"}
                          </button>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-black/55">
                          This order cannot be cancelled because its current
                          status is{" "}
                          <span className="font-semibold text-black">
                            {order.orderStatus}
                          </span>
                          .
                        </p>
                      )}

                      {cancelError && (
                        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                          {cancelError}
                        </p>
                      )}

                      {cancelSuccess && (
                        <p className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                          {cancelSuccess}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border border-black/10 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                        Summary
                      </p>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between text-black/60">
                          <span>Subtotal</span>
                          <span>
                            {order.currencyCode}{" "}
                            {order.subtotalAmount || order.totalAmount}
                          </span>
                        </div>

                        <div className="flex justify-between text-black/60">
                          <span>Shipping</span>
                          <span>
                            {order.currencyCode} {order.shippingAmount || "0.00"}
                          </span>
                        </div>

                        <div className="flex justify-between text-black/60">
                          <span>Tax</span>
                          <span>
                            {order.currencyCode} {order.taxAmount || "0.00"}
                          </span>
                        </div>

                        <div className="border-t border-black/10 pt-2">
                          <div className="flex justify-between text-base font-bold text-black">
                            <span>Total</span>
                            <span>
                              {order.currencyCode} {order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="rounded-lg border border-black/10 bg-white p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                          Tracking
                        </p>

                        <p className="mt-2 text-sm text-black/65">
                          {order.courierName || "Courier"}:{" "}
                          <span className="font-semibold text-black">
                            {order.trackingNumber}
                          </span>
                        </p>

                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            className="mt-3 inline-flex w-full justify-center rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#CE0028]"
                          >
                            Track Shipment
                          </a>
                        )}
                      </div>
                    )}

                    {order.addressLine1 && (
                      <div className="rounded-lg border border-black/10 bg-white p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                          Delivery Address
                        </p>

                        <p className="mt-2 text-sm leading-6 text-black/65">
                          <span className="font-semibold text-black">
                            {order.customerName}
                          </span>
                          <br />
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
                        </p>
                      </div>
                    )}
                  </aside>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}