import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const orders = await prisma.shopOrder.findMany({
      where: {
        customerEmail: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productId: item.productId?.toString(),
        variantId: item.variantId?.toString(),
      })),
    }));

    return NextResponse.json({
      success: true,
      orders: safeOrders,
    });
  } catch (error) {
    console.error("Fetch my orders error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders.",
      },
      { status: 500 }
    );
  }
}