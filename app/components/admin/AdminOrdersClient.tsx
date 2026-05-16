"use client";

import { useEffect, useMemo, useState } from "react";
import PageHero from "../marketing/PageHero";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

type OrderItem = {
  id: string;
  productName: string;
  sku: string;
  sizeLabel?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string | null;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalAmount: number;
  currencyCode: string;
  orderStatus: string;
  paymentStatus: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  adminNote?: string | null;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  async function loadOrders() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const json = await res.json();

      if (json.success) {
        setOrders(json.orders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const now = new Date();

    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((order) => {
        return (
          order.orderNumber.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.customerEmail.toLowerCase().includes(q) ||
          order.customerPhone?.toLowerCase().includes(q)
        );
      });
    }

    if (orderStatusFilter !== "ALL") {
      result = result.filter(
        (order) => order.orderStatus === orderStatusFilter
      );
    }

    if (paymentStatusFilter !== "ALL") {
      result = result.filter(
        (order) => order.paymentStatus === paymentStatusFilter
      );
    }

    if (dateFilter !== "ALL") {
      result = result.filter((order) => {
        const createdAt = new Date(order.createdAt);
        const diffMs = now.getTime() - createdAt.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === "TODAY") return diffDays < 1;
        if (dateFilter === "7_DAYS") return diffDays <= 7;
        if (dateFilter === "30_DAYS") return diffDays <= 30;

        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "NEWEST") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortBy === "OLDEST") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortBy === "AMOUNT_HIGH") {
        return Number(b.totalAmount) - Number(a.totalAmount);
      }

      if (sortBy === "AMOUNT_LOW") {
        return Number(a.totalAmount) - Number(b.totalAmount);
      }

      return 0;
    });

    return result;
  }, [orders, search, orderStatusFilter, paymentStatusFilter, dateFilter, sortBy]);

  function clearFilters() {
    setSearch("");
    setOrderStatusFilter("ALL");
    setPaymentStatusFilter("ALL");
    setDateFilter("ALL");
    setSortBy("NEWEST");
  }

  function updateLocalOrder(
    orderId: string,
    field: keyof AdminOrder,
    value: string
  ) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
  }

  async function saveOrder(order: AdminOrder) {
    try {
      setSavingId(order.id);

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          orderStatus: order.orderStatus,
          trackingNumber: order.trackingNumber,
          courierName: order.courierName,
          trackingUrl: order.trackingUrl,
          adminNote: order.adminNote,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.error || "Failed to update order.");
        return;
      }

      alert("Order updated successfully.");
      await loadOrders();
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Something went wrong while updating order.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="bg-white">
      <PageHero
        kicker="BLTDIF · ADMIN"
        title="All Orders"
        subtitle="View orders, update statuses, manage shipping details, and notify customers."
        image=""
        primaryCta={{ label: "Dashboard", href: "/admin/dashboard" }}
        secondaryCta={{ label: "Shop", href: "/products" }}
      />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 md:pb-16">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#CE0028]">
            BLTDIF Admin
          </p>

          <p className="mt-2 text-sm text-black/55">
            Showing {filteredOrders.length} of {orders.length} orders.
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-black/10 bg-[#f7f7f7] p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, name, email, phone"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none lg:col-span-2"
            />

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">All Order Status</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">All Payment Status</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="7_DAYS">Last 7 Days</option>
              <option value="30_DAYS">Last 30 Days</option>
            </select>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="AMOUNT_HIGH">Amount High to Low</option>
              <option value="AMOUNT_LOW">Amount Low to High</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-black/50 shadow-sm">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-black/50 shadow-sm">
            No orders matched your filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isOpen = openOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    className="flex w-full cursor-pointer flex-col gap-4 p-5 text-left sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/35">
                        {order.orderNumber}
                      </p>

                      <h2 className="mt-1 text-lg font-black text-black">
                        {order.customerName}
                      </h2>

                      <p className="mt-1 text-sm text-black/55">
                        {order.customerEmail}
                      </p>

                      <p className="mt-1 text-xs text-black/35">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                        {order.paymentStatus}
                      </span>

                      <span className="rounded-full bg-[#CE0028]/10 px-3 py-1 text-xs font-bold text-[#CE0028]">
                        {order.orderStatus}
                      </span>

                      <span className="text-lg font-black text-black">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-black/10 p-5">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl bg-[#f7f7f7] p-4">
                          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-black">
                            Customer & Shipping
                          </h3>

                          <div className="mt-4 space-y-1 text-sm text-black/65">
                            <p>{order.customerPhone || "No phone"}</p>
                            <p>{order.addressLine1}</p>
                            {order.addressLine2 && <p>{order.addressLine2}</p>}
                            <p>
                              {order.city}, {order.state} {order.zipCode}
                            </p>
                            <p>{order.country}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-[#f7f7f7] p-4">
                          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-black">
                            Update Order
                          </h3>

                          <div className="mt-4 grid gap-3">
                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                updateLocalOrder(
                                  order.id,
                                  "orderStatus",
                                  e.target.value
                                )
                              }
                              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                            >
                              {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>

                            <input
                              value={order.courierName || ""}
                              onChange={(e) =>
                                updateLocalOrder(
                                  order.id,
                                  "courierName",
                                  e.target.value
                                )
                              }
                              placeholder="Courier Name"
                              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                            />

                            <input
                              value={order.trackingNumber || ""}
                              onChange={(e) =>
                                updateLocalOrder(
                                  order.id,
                                  "trackingNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Tracking Number"
                              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                            />

                            <input
                              value={order.trackingUrl || ""}
                              onChange={(e) =>
                                updateLocalOrder(
                                  order.id,
                                  "trackingUrl",
                                  e.target.value
                                )
                              }
                              placeholder="Tracking URL"
                              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                            />

                            <textarea
                              value={order.adminNote || ""}
                              onChange={(e) =>
                                updateLocalOrder(
                                  order.id,
                                  "adminNote",
                                  e.target.value
                                )
                              }
                              placeholder="Admin note"
                              rows={3}
                              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => saveOrder(order)}
                              disabled={savingId === order.id}
                              className="cursor-pointer rounded-full bg-[#CE0028] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white disabled:opacity-50"
                            >
                              {savingId === order.id
                                ? "Saving..."
                                : "Save Update"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-black p-4 text-white">
                        <h3 className="text-sm font-black uppercase tracking-[0.18em]">
                          Order Items
                        </h3>

                        <div className="mt-4 space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                            >
                              <div>
                                <p className="font-bold">{item.productName}</p>

                                <p className="text-xs text-white/50">
                                  SKU: {item.sku}
                                  {item.sizeLabel
                                    ? ` · Size: ${item.sizeLabel}`
                                    : ""}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-bold">
                                  Qty: {item.quantity}
                                </p>

                                <p className="text-sm text-white/60">
                                  ₹{item.totalPrice.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}