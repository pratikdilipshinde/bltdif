"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../marketing/PageHero";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Package,
  ShoppingBag,
  Clock3,
  Truck,
  MapPin,
  UserRound,
  CreditCard,
  ExternalLink,
  Save,
  LoaderCircle,
  CalendarDays,
  Hash,
  Phone,
  PackageCheck,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import AnnouncementBar from "../AnnouncementBar";

const BRAND_RED = "#CE0028";

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

const glassPanel =
  "border border-white/80 bg-white/55 shadow-[0_6px_24px_rgba(15,23,42,0.035)] backdrop-blur-xl";

const fieldClass =
  "w-full rounded-xl border border-black/[0.07] bg-white/65 px-3.5 py-2.5 text-[12px] text-black outline-none transition placeholder:text-black/35 hover:border-black/15 focus:border-[#CE0028]/40 focus:bg-white focus:ring-2 focus:ring-[#CE0028]/[0.05]";

function formatMoney(amount: number, currencyCode = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  } catch {
    return `₹${(Number(amount) || 0).toLocaleString("en-IN")}`;
  }
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Unknown date";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrderStatusStyle(status: string) {
  switch (status) {
    case "DELIVERED":
      return "border-emerald-200/80 bg-emerald-50/80 text-emerald-700";
    case "SHIPPED":
      return "border-sky-200/80 bg-sky-50/80 text-sky-700";
    case "PROCESSING":
    case "PACKED":
      return "border-violet-200/80 bg-violet-50/80 text-violet-700";
    case "CONFIRMED":
      return "border-blue-200/80 bg-blue-50/80 text-blue-700";
    case "CANCELLED":
    case "REFUNDED":
      return "border-rose-200/80 bg-rose-50/80 text-rose-700";
    default:
      return "border-amber-200/80 bg-amber-50/80 text-amber-700";
  }
}

function getPaymentStatusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "border-emerald-200/80 bg-emerald-50/80 text-emerald-700";
    case "FAILED":
    case "REFUNDED":
      return "border-rose-200/80 bg-rose-50/80 text-rose-700";
    default:
      return "border-black/[0.08] bg-black/[0.035] text-black/55";
  }
}

function StatusBadge({
  status,
  payment = false,
}: {
  status: string;
  payment?: boolean;
}) {
  const dotColor =
    status === "PAID" || status === "DELIVERED"
      ? "bg-emerald-500"
      : status === "CANCELLED" ||
          status === "REFUNDED" ||
          status === "FAILED"
        ? "bg-rose-500"
        : status === "SHIPPED"
          ? "bg-sky-500"
          : "bg-current opacity-60";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
        payment
          ? getPaymentStatusStyle(status)
          : getOrderStatusStyle(status)
      }`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white bg-white/80 text-black/65 shadow-sm">
        <Icon size={15} strokeWidth={1.8} />
      </div>

      <div>
        <h3 className="text-[13px] font-semibold tracking-tight text-black">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-[11px] leading-relaxed text-black/45">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

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

  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setLoadError("");

      const res = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unable to load orders.");
      }

      setOrders(Array.isArray(json.orders) ? json.orders : []);
    } catch (error) {
      console.error("Failed to load orders:", error);

      setLoadError(
        error instanceof Error ? error.message : "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    let result = [...orders];

    if (search.trim()) {
      const q = search.trim().toLowerCase();

      result = result.filter((order) =>
        [
          order.orderNumber,
          order.customerName,
          order.customerEmail,
          order.customerPhone ?? "",
        ].some((value) => value.toLowerCase().includes(q))
      );
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
        const createdAt = new Date(order.createdAt).getTime();

        if (Number.isNaN(createdAt) || createdAt > now) return false;

        if (dateFilter === "TODAY") {
          const today = new Date();
          const date = new Date(createdAt);

          return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          );
        }

        const age = now - createdAt;

        if (dateFilter === "7_DAYS") {
          return age <= 7 * 24 * 60 * 60 * 1000;
        }

        if (dateFilter === "30_DAYS") {
          return age <= 30 * 24 * 60 * 60 * 1000;
        }

        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "NEWEST") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (sortBy === "OLDEST") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
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
  }, [
    orders,
    search,
    orderStatusFilter,
    paymentStatusFilter,
    dateFilter,
    sortBy,
  ]);

  const stats = useMemo(() => {
    const revenue = filteredOrders.reduce(
      (sum, order) =>
        order.paymentStatus === "PAID"
          ? sum + Number(order.totalAmount || 0)
          : sum,
      0
    );

    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter(
        (order) =>
          order.orderStatus === "PENDING" ||
          order.orderStatus === "CONFIRMED"
      ).length,
      shipping: filteredOrders.filter(
        (order) =>
          order.orderStatus === "PROCESSING" ||
          order.orderStatus === "PACKED" ||
          order.orderStatus === "SHIPPED"
      ).length,
      revenue,
    };
  }, [filteredOrders]);

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
      setNotice("");

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

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update order.");
      }

      setNotice(`Order ${order.orderNumber} updated successfully.`);
      await loadOrders();
    } catch (error) {
      console.error("Failed to save order:", error);

      setNotice(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating order."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f6] text-black">
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-48 h-80 w-80 rounded-full bg-[#CE0028]/[0.045] blur-[100px]" />
        <div className="absolute -right-40 top-[35rem] h-96 w-96 rounded-full bg-slate-300/25 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.12) 0.6px, transparent 0.6px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10">
        <AnnouncementBar />
        {/* <PageHero
          kicker="BLTDIF · ADMIN"
          title="All Orders"
          subtitle="Manage customer orders, fulfilment, and shipping."
          image=""
          primaryCta={{ label: "Dashboard", href: "/admin/dashboard" }}
          secondaryCta={{ label: "Shop", href: "/products" }}
        /> */}

        <section className="mx-auto max-w-[1320px] px-4 pb-12 pt-20 md:pt-25 sm:px-6 lg:px-8 ">
          {/* Page heading */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white bg-white/65 px-3 py-1.5 shadow-sm backdrop-blur-xl">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: BRAND_RED }}
                />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/55">
                  Order management
                </span>
              </div>

              <h1 className="text-xl font-semibold tracking-[-0.045em] sm:text-2xl lg:text-2xl">
                Orders<span style={{ color: BRAND_RED }}>.</span>
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-5 text-black/50 sm:text-sm">
                Review orders and manage fulfilment from one workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadOrders()}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/80 bg-white/65 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/70 backdrop-blur-xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw
                size={13}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Compact statistics */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              {
                label: "Filtered orders",
                value: stats.total.toLocaleString("en-IN"),
                icon: ShoppingBag,
                detail: `Of ${orders.length} total`,
                accent: "bg-black/[0.04] text-black/70",
              },
              {
                label: "Awaiting progress",
                value: stats.pending.toLocaleString("en-IN"),
                icon: Clock3,
                detail: "Pending or confirmed",
                accent: "bg-amber-50 text-amber-700",
              },
              {
                label: "In fulfilment",
                value: stats.shipping.toLocaleString("en-IN"),
                icon: Truck,
                detail: "Processing to shipped",
                accent: "bg-sky-50 text-sky-700",
              },
              {
                label: "Paid revenue",
                value: formatMoney(stats.revenue),
                icon: CreditCard,
                detail: "Filtered paid orders",
                accent: "bg-emerald-50 text-emerald-700",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.035)] backdrop-blur-xl transition duration-300 hover:bg-white/75"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/45 sm:text-[10px]">
                      {stat.label}
                    </p>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${stat.accent}`}
                    >
                      <Icon size={15} strokeWidth={1.8} />
                    </div>
                  </div>

                  <p className="mt-3 break-words text-xl font-semibold tracking-tight sm:text-2xl">
                    {stat.value}
                  </p>

                  <p className="mt-1.5 text-[10px] text-black/40">
                    {stat.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className={`${glassPanel} mb-5 rounded-2xl p-4 sm:p-5`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <SectionHeading
                icon={SlidersHorizontal}
                title="Filter orders"
                subtitle="Search and refine your order list."
              />

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-black/50 transition hover:bg-black/[0.04] hover:text-black"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Order, customer, email..."
                  aria-label="Search orders"
                  className={`${fieldClass} pl-10`}
                />
              </div>

              <select
                aria-label="Filter by order status"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className={fieldClass}
              >
                <option value="ALL">All order statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by payment status"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className={fieldClass}
              >
                <option value="ALL">All payment statuses</option>
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by order date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={fieldClass}
              >
                <option value="ALL">Any date</option>
                <option value="TODAY">Today</option>
                <option value="7_DAYS">Last 7 days</option>
                <option value="30_DAYS">Last 30 days</option>
              </select>

              <select
                aria-label="Sort orders"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={fieldClass}
              >
                <option value="NEWEST">Newest first</option>
                <option value="OLDEST">Oldest first</option>
                <option value="AMOUNT_HIGH">Highest amount</option>
                <option value="AMOUNT_LOW">Lowest amount</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-3">
              <p className="text-[11px] text-black/45">
                Showing{" "}
                <span className="font-semibold text-black">
                  {filteredOrders.length}
                </span>{" "}
                of {orders.length} orders
              </p>

              <div className="flex flex-wrap gap-1.5">
                {orderStatusFilter !== "ALL" && (
                  <span className="rounded-full border border-[#CE0028]/15 bg-[#CE0028]/[0.06] px-2.5 py-1 text-[9px] font-bold text-[#CE0028]">
                    {orderStatusFilter}
                  </span>
                )}

                {paymentStatusFilter !== "ALL" && (
                  <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[9px] font-bold text-black/60">
                    PAYMENT: {paymentStatusFilter}
                  </span>
                )}

                {dateFilter !== "ALL" && (
                  <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[9px] font-bold text-black/60">
                    {dateFilter.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Inline feedback */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                role="status"
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-white bg-white/75 p-3.5 shadow-sm backdrop-blur-xl"
              >
                {notice.includes("successfully") ? (
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                ) : (
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-[#CE0028]"
                  />
                )}

                <p className="flex-1 text-xs leading-5 text-black/70">
                  {notice}
                </p>

                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss message"
                  className="rounded-md p-1 text-black/40 hover:bg-black/5"
                >
                  <X size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          {loading ? (
            <div className={`${glassPanel} rounded-2xl px-6 py-16 text-center`}>
              <LoaderCircle
                size={22}
                className="mx-auto animate-spin text-[#CE0028]"
              />

              <p className="mt-4 text-sm font-semibold">Loading orders</p>

              <p className="mt-1 text-xs text-black/45">
                Fetching the latest order information...
              </p>
            </div>
          ) : loadError ? (
            <div className={`${glassPanel} rounded-2xl px-6 py-14 text-center`}>
              <AlertCircle
                size={23}
                className="mx-auto text-[#CE0028]"
              />

              <h2 className="mt-4 text-base font-semibold">
                Unable to load orders
              </h2>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-black/50">
                {loadError}
              </p>

              <button
                type="button"
                onClick={() => void loadOrders()}
                className="mt-5 rounded-xl bg-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#CE0028]"
              >
                Try again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={`${glassPanel} rounded-2xl px-6 py-16 text-center`}>
              <Package
                size={25}
                strokeWidth={1.5}
                className="mx-auto text-black/35"
              />

              <h2 className="mt-4 text-base font-semibold">
                No matching orders
              </h2>

              <p className="mt-1.5 text-xs text-black/45">
                Adjust your search or clear your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#CE0028]"
              >
                <RotateCcw size={12} />
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order, index) => {
                const isOpen = openOrderId === order.id;
                const currency = order.currencyCode || "INR";
                const itemCount = order.items.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0
                );

                return (
                  <motion.article
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.015, 0.12),
                    }}
                    className={`group overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors duration-200 ${
                      isOpen
                        ? "border-white bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
                        : "border-white/80 bg-white/55 shadow-[0_3px_16px_rgba(15,23,42,0.025)] hover:bg-white/75"
                    }`}
                  >
                    {/* Compact order row */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenOrderId(isOpen ? null : order.id)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full flex-col gap-3 p-4 text-left transition sm:flex-row sm:items-center sm:justify-between sm:gap-5 lg:px-5 lg:py-4"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                            isOpen
                              ? "border-[#CE0028]/10 bg-[#CE0028]/[0.06] text-[#CE0028]"
                              : "border-white bg-white/80 text-black/60 shadow-sm"
                          }`}
                        >
                          <ShoppingBag size={17} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/40">
                              Order
                            </span>

                            <span className="break-all text-[11px] font-bold tracking-wide text-[#CE0028] sm:text-xs">
                              {order.orderNumber}
                            </span>
                          </div>

                          <h2 className="mt-1 text-sm font-semibold tracking-tight sm:text-base">
                            {order.customerName}
                          </h2>

                          <p className="mt-0.5 break-all text-[11px] text-black/45">
                            {order.customerEmail}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-black/40">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={11} />
                              {formatDate(order.createdAt)}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Package size={11} />
                              {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-black/[0.05] pt-3 sm:justify-end sm:gap-3 sm:border-0 sm:pt-0">
                        <div className="flex flex-wrap gap-1.5">
                          <StatusBadge status={order.paymentStatus} payment />
                          <StatusBadge status={order.orderStatus} />
                        </div>

                        <div className="ml-auto text-right sm:min-w-[115px]">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/40">
                            Order total
                          </p>

                          <p className="mt-1 text-base font-semibold tracking-tight">
                            {formatMoney(Number(order.totalAmount), currency)}
                          </p>
                        </div>

                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-white/70 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </button>

                    {/* Expandable details */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="details"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.25, ease: "easeInOut" },
                            opacity: { duration: 0.18 },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-black/[0.06] p-4 sm:p-5">
                            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                              {/* Customer details */}
                              <div className="rounded-2xl border border-white/80 bg-white/50 p-4">
                                <SectionHeading
                                  icon={MapPin}
                                  title="Customer & shipping"
                                  subtitle="Delivery information"
                                />

                                <div className="mt-4 space-y-3.5">
                                  <div className="flex items-start gap-2.5">
                                    <UserRound
                                      size={14}
                                      className="mt-0.5 shrink-0 text-black/40"
                                    />

                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold">
                                        {order.customerName}
                                      </p>

                                      <p className="mt-1 break-all text-[11px] text-black/45">
                                        {order.customerEmail}
                                      </p>
                                    </div>
                                  </div>

                                  {order.customerPhone && (
                                    <div className="flex items-center gap-2.5">
                                      <Phone
                                        size={14}
                                        className="shrink-0 text-black/40"
                                      />

                                      <p className="text-xs text-black/65">
                                        {order.customerPhone}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-start gap-2.5">
                                    <MapPin
                                      size={14}
                                      className="mt-0.5 shrink-0 text-black/40"
                                    />

                                    <div className="text-xs leading-5 text-black/60">
                                      <p>{order.addressLine1}</p>

                                      {order.addressLine2 && (
                                        <p>{order.addressLine2}</p>
                                      )}

                                      <p>
                                        {order.city}, {order.state}{" "}
                                        {order.zipCode}
                                      </p>

                                      <p>{order.country}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 rounded-xl border border-black/[0.05] bg-white/60 p-3">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/40">
                                    Order reference
                                  </p>

                                  <div className="mt-2 flex items-center gap-2">
                                    <Hash
                                      size={13}
                                      className="text-[#CE0028]"
                                    />

                                    <span className="break-all text-[11px] font-semibold">
                                      {order.orderNumber}
                                    </span>
                                  </div>

                                  <div className="mt-2 flex items-center gap-2 text-[10px] text-black/45">
                                    <CalendarDays size={12} />
                                    {formatDate(order.createdAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Update order */}
                              <div className="rounded-2xl border border-white/80 bg-white/50 p-4">
                                <SectionHeading
                                  icon={PackageCheck}
                                  title="Fulfilment & tracking"
                                  subtitle="Update order and shipping details"
                                />

                                <div className="mt-4 grid gap-3.5">
                                  <label className="block">
                                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50">
                                      Order status
                                    </span>

                                    <select
                                      value={order.orderStatus}
                                      onChange={(e) =>
                                        updateLocalOrder(
                                          order.id,
                                          "orderStatus",
                                          e.target.value
                                        )
                                      }
                                      className={fieldClass}
                                    >
                                      {ORDER_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                          {status}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="block">
                                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50">
                                        Courier
                                      </span>

                                      <input
                                        value={order.courierName || ""}
                                        onChange={(e) =>
                                          updateLocalOrder(
                                            order.id,
                                            "courierName",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Courier name"
                                        className={fieldClass}
                                      />
                                    </label>

                                    <label className="block">
                                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50">
                                        Tracking number
                                      </span>

                                      <input
                                        value={order.trackingNumber || ""}
                                        onChange={(e) =>
                                          updateLocalOrder(
                                            order.id,
                                            "trackingNumber",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Tracking ID"
                                        className={fieldClass}
                                      />
                                    </label>
                                  </div>

                                  <label className="block">
                                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50">
                                      Tracking URL
                                    </span>

                                    <input
                                      type="url"
                                      value={order.trackingUrl || ""}
                                      onChange={(e) =>
                                        updateLocalOrder(
                                          order.id,
                                          "trackingUrl",
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://..."
                                      className={fieldClass}
                                    />

                                    {order.trackingUrl &&
                                      /^https?:\/\//i.test(
                                        order.trackingUrl
                                      ) && (
                                        <a
                                          href={order.trackingUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#CE0028] hover:underline"
                                        >
                                          Preview tracking link
                                          <ExternalLink size={11} />
                                        </a>
                                      )}
                                  </label>

                                  <label className="block">
                                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-black/50">
                                      Internal admin note
                                    </span>

                                    <textarea
                                      value={order.adminNote || ""}
                                      onChange={(e) =>
                                        updateLocalOrder(
                                          order.id,
                                          "adminNote",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Add an internal note..."
                                      rows={3}
                                      className={`${fieldClass} resize-y`}
                                    />
                                  </label>

                                  <div className="flex flex-col justify-between gap-3 border-t border-black/[0.06] pt-3 sm:flex-row sm:items-center">
                                    <p className="text-[10px] leading-4 text-black/40">
                                      Save to apply your changes.
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => void saveOrder(order)}
                                      disabled={savingId !== null}
                                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CE0028] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#ad0022] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {savingId === order.id ? (
                                        <>
                                          <LoaderCircle
                                            size={13}
                                            className="animate-spin"
                                          />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save size={13} />
                                          Save changes
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order items */}
                            <div className="mt-4 overflow-hidden rounded-2xl border border-white/80 bg-white/55">
                              <div className="flex flex-col justify-between gap-3 border-b border-black/[0.06] p-4 sm:flex-row sm:items-center">
                                <SectionHeading
                                  icon={ShoppingBag}
                                  title="Order items"
                                  subtitle={`${itemCount} ${
                                    itemCount === 1 ? "unit" : "units"
                                  }`}
                                />

                                <div className="sm:text-right">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/40">
                                    Order total
                                  </p>

                                  <p className="mt-1 text-lg font-semibold tracking-tight">
                                    {formatMoney(
                                      Number(order.totalAmount),
                                      currency
                                    )}
                                  </p>
                                </div>
                              </div>

                              {order.items.length === 0 ? (
                                <div className="p-7 text-center text-xs text-black/45">
                                  No items associated with this order.
                                </div>
                              ) : (
                                <div className="divide-y divide-black/[0.05]">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                                    >
                                      <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white bg-white shadow-sm">
                                          {item.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                              src={item.imageUrl}
                                              alt={item.productName}
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            <Package
                                              size={19}
                                              className="text-black/25"
                                            />
                                          )}
                                        </div>

                                        <div className="min-w-0">
                                          <p className="break-words text-xs font-semibold">
                                            {item.productName}
                                          </p>

                                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-black/45">
                                            <span>SKU: {item.sku}</span>

                                            {item.sizeLabel && (
                                              <span>
                                                Size: {item.sizeLabel}
                                              </span>
                                            )}
                                          </div>

                                          <p className="mt-1.5 text-[11px] text-black/55">
                                            {formatMoney(
                                              Number(item.unitPrice),
                                              currency
                                            )}{" "}
                                            <span className="text-black/35">
                                              × {item.quantity}
                                            </span>
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between gap-3 border-t border-black/[0.05] pt-2.5 sm:min-w-[125px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40">
                                          Line total
                                        </span>

                                        <span className="text-sm font-semibold">
                                          {formatMoney(
                                            Number(item.totalPrice),
                                            currency
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Shipping and payment summary */}
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/50 p-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black/55 shadow-sm">
                                  <CreditCard size={15} />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                    Payment
                                  </p>

                                  <div className="mt-1.5">
                                    <StatusBadge
                                      status={order.paymentStatus}
                                      payment
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/50 p-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black/55 shadow-sm">
                                  <Truck size={15} />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40">
                                    Shipping
                                  </p>

                                  <p className="mt-1 truncate text-xs font-semibold text-black/75">
                                    {order.courierName || "Courier not assigned"}
                                  </p>

                                  <p className="mt-1 break-all text-[10px] text-black/40">
                                    {order.trackingNumber ||
                                      "Tracking not available"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </div>
          )}

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-black/[0.06] pt-4 text-[9px] font-medium uppercase tracking-[0.13em] text-black/35 sm:flex-row sm:items-center">
            <span>BLTDIF · Order management</span>
            <span>Designed with intention.</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
