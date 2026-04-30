import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order = await prisma.shopOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        stockMovements: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const safeOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productId: item.productId?.toString(),
        variantId: item.variantId?.toString(),
      })),
      stockMovements: order.stockMovements.map((movement) => ({
        ...movement,
        productId: movement.productId?.toString(),
        variantId: movement.variantId?.toString(),
      })),
    };

    return NextResponse.json({
      success: true,
      order: safeOrder,
    });
  } catch (error) {
    console.error("Fetch order detail error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details.",
      },
      { status: 500 }
    );
  }
}