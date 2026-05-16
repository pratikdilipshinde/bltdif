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
    ] = await Promise.all([
      prisma.shopOrder.count(),

      prisma.profile.count(),

      prisma.shopOrder.findMany({
        where: {
          paymentStatus: "PAID",
        },
        select: {
          totalAmount: true,
        },
      }),

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
    ]);

    const totalIncome = paidOrders.reduce((sum, order) => {
      return sum + Number(order.totalAmount);
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalIncome,
        totalUsers,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
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