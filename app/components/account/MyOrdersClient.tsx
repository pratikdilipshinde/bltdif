"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Package, Truck } from "lucide-react";
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

export default function MyOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="rounded-xs border border-black/10 bg-white p-8">
        <p className="text-sm text-black/55">Loading your orders...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="rounded-xs border border-black/10 bg-[#fafafa] p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-black">Please log in</h2>
        <p className="mt-3 text-sm text-black/60">
          Log in with the same email used during checkout to view your orders.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CE0028]"
        >
          Login
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xs border border-black/10 bg-[#fafafa] p-8 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">
          No Orders Found
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-black">
          You have not placed any orders with this email.
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/60">
          We checked orders for <span className="font-medium">{email}</span>.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CE0028]"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const isOpen = expandedOrderId === order.id;

        return (
          <div
            key={order.id}
            className="overflow-hidden rounded-xs border border-black/10 bg-white transition hover:border-black/25"
          >
            <button
              type="button"
              onClick={() => setExpandedOrderId(isOpen ? null : order.id)}
              className="w-full p-5 text-left md:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CE0028]">
                    Order
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-black">
                    {order.orderNumber}
                  </h2>

                  <p className="mt-1 text-sm text-black/50">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClass(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-5 md:min-w-[180px] md:justify-end">
                  <div className="md:text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
                      Total
                    </p>

                    <p className="mt-2 text-lg font-semibold text-black">
                      {order.currencyCode} {order.totalAmount}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 text-black/45 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-black/10 pt-4">
                <div className="flex flex-col gap-2 text-sm text-black/55 md:flex-row md:items-center md:justify-between">
                  <p>{order.items.length} item(s)</p>

                  {order.trackingNumber ? (
                    <p>
                      {order.courierName || "Tracking"}:{" "}
                      <span className="font-medium text-black">
                        {order.trackingNumber}
                      </span>
                    </p>
                  ) : (
                    <p>Tracking will appear once shipped.</p>
                  )}
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-black/10 bg-[#fafafa] p-5 md:p-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#CE0028]" />
                      <h3 className="text-lg font-semibold text-black">
                        Items in this order
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid gap-4 rounded-xs border border-black/10 bg-white p-4 md:grid-cols-[88px_1fr_auto] md:items-center"
                        >
                          <div className="relative h-24 w-full overflow-hidden rounded-xs bg-[#f1f1f3] md:w-22">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-black/25">
                                BLTDIF
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-black">
                              {item.productName}
                            </h4>

                            {item.sku && (
                              <p className="mt-1 text-xs text-black/45">
                                SKU: {item.sku}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.sizeLabel && (
                                <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60">
                                  Size: {item.sizeLabel}
                                </span>
                              )}

                              {item.color && (
                                <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60">
                                  Color: {item.color}
                                </span>
                              )}

                              <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-xs text-black/45">Total</p>
                            <p className="mt-1 text-sm font-semibold text-black">
                              {order.currencyCode}{" "}
                              {item.totalPrice || order.totalAmount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside className="space-y-4">
                    <div className="rounded-xs border border-black/10 bg-white p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
                        Order Summary
                      </p>

                      <div className="mt-4 space-y-3 text-sm">
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

                        {/* <div className="flex justify-between text-black/60">
                          <span>Discount</span>
                          <span>
                            - {order.currencyCode}{" "}
                            {order.discountAmount || "0.00"}
                          </span>
                        </div> */}

                        <div className="border-t border-black/10 pt-4">
                          <div className="flex justify-between text-base font-semibold text-black">
                            <span>Total</span>
                            <span>
                              {order.currencyCode} {order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="rounded-xs border border-black/10 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#CE0028]" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
                          Shipping
                        </p>
                      </div>

                      {order.trackingNumber ? (
                        <div className="mt-4 text-sm text-black/65">
                          <p>
                            Courier:{" "}
                            <span className="font-semibold text-black">
                              {order.courierName || "Courier Partner"}
                            </span>
                          </p>
                          <p className="mt-2">
                            Tracking:{" "}
                            <span className="font-semibold text-black">
                              {order.trackingNumber}
                            </span>
                          </p>

                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              className="mt-4 inline-flex rounded-xs bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CE0028]"
                            >
                              Track Shipment
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm leading-relaxed text-black/60">
                          Tracking details will be added once your order is
                          packed and shipped.
                        </p>
                      )}
                    </div> */}

                    {order.addressLine1 && (
                      <div className="rounded-xs border border-black/10 bg-white p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
                          Delivery Address
                        </p>

                        <p className="mt-4 text-sm leading-7 text-black/65">
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