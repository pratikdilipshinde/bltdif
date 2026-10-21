import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const [
      totalOrders,
      totalUsers,
      paidOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      categoryItems,
    ] = await Promise.all([
      // Overall order count
      prisma.shopOrder.count(),

      // Registered users
      prisma.profile.count(),

      // Paid orders for total income
      prisma.shopOrder.findMany({
        where: {
          paymentStatus: "PAID",
        },
        select: {
          totalAmount: true,
        },
      }),

      // Orders by status
      prisma.shopOrder.count({
        where: { orderStatus: "PENDING" },
      }),

      prisma.shopOrder.count({
        where: { orderStatus: "PROCESSING" },
      }),

      prisma.shopOrder.count({
        where: { orderStatus: "SHIPPED" },
      }),

      prisma.shopOrder.count({
        where: { orderStatus: "DELIVERED" },
      }),

      prisma.shopOrder.count({
        where: { orderStatus: "CANCELLED" },
      }),

      // Sales items from paid orders, grouped by product category
      prisma.shopOrderItem.findMany({
        where: {
          order: {
            paymentStatus: "PAID",
          },
        },
        select: {
          categoryCode: true,
          quantity: true,
          totalPrice: true,
          product: {
            select: {
              category: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Total income from paid orders
    const totalIncome = paidOrders.reduce((sum, order) => {
      return sum + Number(order.totalAmount);
    }, 0);

    // Normalize category names/codes so they can be matched
    // with the dashboard's T-SHIRT, HOODIE, and CAP cards.
    const normalizeCategory = (value: string | null | undefined) => {
      const normalized = (value ?? "")
        .trim()
        .toUpperCase()
        .replace(/[_\s]+/g, "-");

      if (
        ["T-SHIRT", "T-SHIRTS", "TSHIRT", "TSHIRTS", "TEE", "TEES"].includes(
          normalized
        )
      ) {
        return "T-SHIRT";
      }

      if (
        ["HOODIE", "HOODIES", "HOODY", "HOODYS"].includes(normalized)
      ) {
        return "HOODIE";
      }

      if (["CAP", "CAPS", "HAT", "HATS"].includes(normalized)) {
        return "CAP";
      }

      return normalized;
    };

    const categoryTotals = new Map<
      string,
      { revenue: number; unitsSold: number }
    >();

    for (const item of categoryItems) {
      // Prefer the category stored on the order item, since it
      // represents the category at the time the item was purchased.
      const category = normalizeCategory(
        item.categoryCode || item.product.category.code
      );

      if (!category) continue;

      const current = categoryTotals.get(category) ?? {
        revenue: 0,
        unitsSold: 0,
      };

      current.revenue += Number(item.totalPrice);
      current.unitsSold += item.quantity;

      categoryTotals.set(category, current);
    }

    const categorySales = [
      "T-SHIRT",
      "HOODIE",
      "CAP",
    ].map((category) => {
      const totals = categoryTotals.get(category) ?? {
        revenue: 0,
        unitsSold: 0,
      };

      return {
        category,
        revenue: Number(totals.revenue.toFixed(2)),
        unitsSold: totals.unitsSold,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalIncome: Number(totalIncome.toFixed(2)),
        totalUsers,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        categorySales,
      },
    });
  } catch (error) {
    console.error("Admin dashboard summary error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load admin dashboard summary.",
      },
      { status: 500 }
    );
  }
}
