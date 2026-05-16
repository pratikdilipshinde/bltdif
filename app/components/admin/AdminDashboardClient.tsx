"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHero from "../marketing/PageHero";

type DashboardSummary = {
  totalOrders: number;
  totalIncome: number;
  totalUsers: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
};

export default function AdminDashboardClient() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard/summary", {
          cache: "no-store",
        });

        const json = await res.json();

        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "All Orders",
      value: data?.totalOrders ?? 0,
      href: "/admin/orders",
    },
    {
      title: "Total Income",
      value: `₹${Number(data?.totalIncome ?? 0).toLocaleString("en-IN")}`,
      href: "/admin/orders",
    },
    {
      title: "All Users",
      value: data?.totalUsers ?? 0,
      href: "/admin/users",
    },
    {
      title: "Pending Orders",
      value: data?.pendingOrders ?? 0,
      href: "/admin/orders?status=PENDING",
    },
    {
      title: "Processing",
      value: data?.processingOrders ?? 0,
      href: "/admin/orders?status=PROCESSING",
    },
    {
      title: "Shipped",
      value: data?.shippedOrders ?? 0,
      href: "/admin/orders?status=SHIPPED",
    },
    {
      title: "Delivered",
      value: data?.deliveredOrders ?? 0,
      href: "/admin/orders?status=DELIVERED",
    },
    {
      title: "Cancelled",
      value: data?.cancelledOrders ?? 0,
      href: "/admin/orders?status=CANCELLED",
    },
  ];

  return (
    <main className="bg-white">
      <PageHero
              kicker="BLTDIF · BRAND"
              title="Dashboard"
              subtitle="Modern streetwear with contemporary formals — premium fabrics, minimal branding, and comfort-first silhouettes that make a statement without trying too hard."
              //image="/images/about-hero.jpg"
              image=""
              primaryCta={{ label: "Shop Drop 01", href: "/products" }}
              secondaryCta={{ label: "Contact Us", href: "/contact" }}
            />
      <section className="mx-auto max-w-7xl px-4 pb-12 md:pb-16 pt-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#CE0028]">
            BLTDIF Admin
          </p>

          {/* <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Dashboard
          </h1> */}

          <p className="mt-2 text-sm text-black/55">
            Manage orders, revenue, customers, shipping, and order progress.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-black/50 shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group cursor-pointer rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/40">
                  {card.title}
                </p>

                <h2 className="mt-4 text-3xl font-black text-black">
                  {card.value}
                </h2>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#CE0028]">
                  View Details →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}