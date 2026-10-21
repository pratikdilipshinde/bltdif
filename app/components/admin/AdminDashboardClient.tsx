"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  Clock3,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Shirt,
  Layers3,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import PageHero from "../marketing/PageHero";
import AnnouncementBar from "../AnnouncementBar";

type CategorySale = {
  category: string;
  revenue: number;
  unitsSold: number;
};

type DashboardSummary = {
  totalOrders: number;
  totalIncome: number;
  totalUsers: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  categorySales?: CategorySale[];
};

const glassCard = `
  group relative isolate overflow-hidden rounded-[28px]
  border border-white/50
  bg-white/[0.42]
  shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)]
  backdrop-blur-xl backdrop-saturate-150
  transition-all duration-500 ease-out
  hover:-translate-y-1
  hover:border-white/80
  hover:bg-white/[0.58]
  hover:shadow-[0_16px_45px_rgba(0,0,0,0.10),inset_0_1px_2px_rgba(255,255,255,1)]
`;

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function GlassReflection() {
  return (
    <>
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-5 top-0 z-0 h-px
          bg-gradient-to-r from-transparent via-white to-transparent
          opacity-90
        "
      />
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-12 -top-16 z-0
          h-36 w-36 rounded-full bg-white/35 blur-3xl
          transition-transform duration-700
          group-hover:-translate-x-5 group-hover:translate-y-5
        "
      />
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-6 bottom-0 z-0 h-px
          bg-gradient-to-r from-transparent via-white/70 to-transparent
        "
      />
    </>
  );
}

function StatCard({
  title,
  value,
  href,
  icon: Icon,
  description,
  accent = false,
}: {
  title: string;
  value: string | number;
  href: string;
  icon: React.ElementType;
  description: string;
  accent?: boolean;
}) {
  return (
    <Link href={href} className={`${glassCard} block p-5 sm:p-6`}>
      <GlassReflection />

      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute -bottom-10 -left-8 z-0
          h-28 w-28 rounded-full bg-[#CE0028]/[0.06] blur-3xl
          transition-all duration-500
          group-hover:bg-[#CE0028]/[0.12]
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={`
            flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
            border shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]
            transition-all duration-500 group-hover:scale-105
            ${
              accent
                ? "border-[#CE0028]/15 bg-[#CE0028]/[0.09] text-[#CE0028]"
                : "border-white/80 bg-white/60 text-black/75"
            }
          `}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>

        <ArrowUpRight
          size={18}
          className="mt-1 text-black/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#CE0028]"
        />
      </div>

      <div className="relative z-10 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
          {title}
        </p>

        <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-black sm:text-3xl">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-black/45">
          {description}
        </p>
      </div>
    </Link>
  );
}

const orderStats = [
  {
    title: "Pending Orders",
    key: "pendingOrders" as const,
    href: "/admin/orders?status=PENDING",
    icon: Clock3,
    description: "Orders awaiting action",
  },
  {
    title: "Processing",
    key: "processingOrders" as const,
    href: "/admin/orders?status=PROCESSING",
    icon: PackageCheck,
    description: "Orders being prepared",
  },
  {
    title: "Shipped",
    key: "shippedOrders" as const,
    href: "/admin/orders?status=SHIPPED",
    icon: Truck,
    description: "Orders on the way",
  },
  {
    title: "Delivered",
    key: "deliveredOrders" as const,
    href: "/admin/orders?status=DELIVERED",
    icon: CheckCircle2,
    description: "Successfully delivered",
  },
  {
    title: "Cancelled",
    key: "cancelledOrders" as const,
    href: "/admin/orders?status=CANCELLED",
    icon: XCircle,
    description: "Cancelled orders",
  },
];

const productCategories = [
  {
    title: "T-Shirts",
    category: "T-SHIRT",
    href: "/products/t-shirts",
    icon: Shirt,
    description: "Sales performance for T-shirts",
  },
  {
    title: "Hoodies",
    category: "HOODIE",
    href: "/products/hoodies",
    icon: Layers3,
    description: "Sales performance for hoodies",
  },
  {
    title: "Caps",
    category: "CAP",
    href: "/products/caps",
    icon: ShoppingBag,
    description: "Sales performance for caps",
  },
];

export default function AdminDashboardClient() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/dashboard/summary", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Unable to load dashboard data.");
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Unable to load dashboard data.");
      }

      setData(json.data);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  function getCategorySale(category: string) {
    return data?.categorySales?.find(
      (sale) => sale.category.toUpperCase() === category
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f4f2] text-black">
      <AnnouncementBar />
      {/* Hero */}
      {/* <PageHero
        kicker="BLTDIF · ADMINISTRATION"
        title="Dashboard"
        subtitle="Your command center for orders, revenue, customers, and product performance."
        image=""
        primaryCta={{ label: "View Orders", href: "/admin/orders" }}
        secondaryCta={{ label: "Manage Products", href: "/admin/products" }}
      /> */}

      {/* Dashboard */}
      <section className="relative isolate mx-auto max-w-7xl px-4 pb-16 pt-20 md:pt-25 sm:px-6 lg:px-8 lg:pb-24">
        {/* Background liquid glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-24 -z-10 h-72 w-72 rounded-full bg-[#CE0028]/[0.07] blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-[28rem] -z-10 h-80 w-80 rounded-full bg-white blur-[100px]"
        />

        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#CE0028]">
              BLTDIF Admin
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Overview
            </h2>

            {/* <p className="mt-2 max-w-xl text-sm leading-6 text-black/50">
              Monitor your store at a glance and access the information you
              need to keep everything moving.
            </p> */}
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="
              liquid-button group relative inline-flex w-fit items-center
              justify-center gap-2 overflow-hidden rounded-full
              border border-white/70 bg-white/50
              px-4 py-2 text-xs font-semibold text-black
              shadow-[0_8px_30px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)]
              backdrop-blur-xl backdrop-saturate-150
              transition-all duration-500 ease-out
              hover:-translate-y-[1px] hover:border-white
              hover:bg-white/75
              hover:shadow-[0_12px_35px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1)]
              active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <span className="pointer-events-none absolute -left-8 -top-8 h-16 w-16 rounded-full bg-white/70 blur-2xl transition-transform duration-700 group-hover:translate-x-8 group-hover:translate-y-4" />

            <RefreshCw
              size={15}
              className={`relative z-10 ${loading ? "animate-spin" : ""}`}
            />
            <span className="relative z-10">
              {loading ? "Refreshing..." : "Refresh data"}
            </span>
          </button>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="mb-6 rounded-2xl border border-[#CE0028]/20 bg-white/60 p-5 shadow-sm backdrop-blur-xl">
            <p className="text-sm font-semibold text-[#CE0028]">
              Could not load dashboard
            </p>
            <p className="mt-1 text-sm text-black/60">{error}</p>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-3 text-sm font-semibold text-black underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Main statistics */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-black/70">
              Store performance
            </h3>
            <span className="text-xs text-black/40">
              {loading ? "Updating…" : "Overview"}
            </span>
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="All Orders"
              value={loading ? "—" : data?.totalOrders ?? 0}
              href="/admin/orders"
              icon={ShoppingBag}
              description="View and manage all orders"
              accent
            />

            <StatCard
              title="Total Revenue"
              value={
                loading
                  ? "—"
                  : formatCurrency(data?.totalIncome ?? 0)
              }
              href="/admin/orders"
              icon={IndianRupee}
              description="Revenue reported by your dashboard API"
              accent
            />

            <StatCard
              title="All Users"
              value={loading ? "—" : data?.totalUsers ?? 0}
              href="/admin/users"
              icon={Users}
              description="View your customer accounts"
            />

            <StatCard
              title="Total Delivered"
              value={loading ? "—" : data?.deliveredOrders ?? 0}
              href="/admin/orders?status=DELIVERED"
              icon={TrendingUp}
              description="Orders marked as delivered"
            />
          </div>
        </div>

        {/* Category sales */}
        <div className="mb-10">
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CE0028]">
              Product analytics
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Category-wise sales
            </h3>
            <p className="mt-2 text-sm text-black/50">
              Compare units sold and revenue across your product categories.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {productCategories.map((category) => {
              const sale = getCategorySale(category.category);
              const Icon = category.icon;

              return (
                <Link
                  key={category.category}
                  href={category.href}
                  className={`${glassCard} block p-5 sm:p-6`}
                >
                  <GlassReflection />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute -bottom-12 -right-8 z-0
                      h-36 w-36 rounded-full bg-[#CE0028]/[0.07] blur-3xl
                      transition-all duration-700
                      group-hover:bg-[#CE0028]/[0.13]
                      group-hover:scale-125
                    "
                  />

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/60 text-[#CE0028] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] transition-transform duration-500 group-hover:scale-105">
                      <Icon size={22} strokeWidth={1.7} />
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/40 text-black/45 transition-all duration-300 group-hover:border-[#CE0028]/20 group-hover:bg-[#CE0028]/[0.07] group-hover:text-[#CE0028]">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <div className="relative z-10 mt-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/45">
                      {category.title}
                    </p>

                    <h4 className="mt-2 text-2xl font-semibold tracking-tight">
                      {loading
                        ? "—"
                        : sale
                          ? formatCurrency(sale.revenue)
                          : "—"}
                    </h4>

                    <p className="mt-1 text-xs text-black/45">
                      Total category revenue
                    </p>

                    <div className="my-5 h-px bg-gradient-to-r from-black/[0.08] via-white to-transparent" />

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-black/45">Units sold</p>
                        <p className="mt-1 text-lg font-semibold">
                          {loading ? "—" : sale ? sale.unitsSold : "—"}
                        </p>
                      </div>

                      <span className="rounded-full border border-white/80 bg-white/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black/50">
                        {loading
                          ? "Loading"
                          : sale
                            ? "Sales data"
                            : "No data"}
                      </span>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-black/45">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {!loading && !data?.categorySales && (
            <p className="mt-3 text-xs leading-5 text-black/40">
              Category sales appear here when the dashboard API returns
              categorySales data. No sample sales figures are displayed.
            </p>
          )}
        </div>

        {/* Order status */}
        <div>
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CE0028]">
              Order management
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Order status
            </h3>
            <p className="mt-2 text-sm text-black/50">
              Select a status to open the corresponding orders.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            {orderStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.key}
                  href={stat.href}
                  className={`${glassCard} block p-5`}
                >
                  <GlassReflection />

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/60 text-black/70 transition-colors duration-300 group-hover:text-[#CE0028]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-black/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#CE0028]"
                    />
                  </div>

                  <div className="relative z-10 mt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/50">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {loading ? "—" : data?.[stat.key] ?? 0}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/45">
                      {stat.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-col gap-2 border-t border-black/[0.07] pt-5 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">
          <p>BLTDIF · Admin Dashboard</p>
          <p>Dashboard values are supplied by your admin summary API.</p>
        </div>
      </section>
    </main>
  );
}
