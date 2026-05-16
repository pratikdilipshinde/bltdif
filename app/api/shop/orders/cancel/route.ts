import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { orderId, email } = body;

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, error: "Order ID and email are required." },
        { status: 400 }
      );
    }

    const order = await prisma.shopOrder.findFirst({
      where: {
        id: orderId,
        customerEmail: email,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    if (!CANCELLABLE_STATUSES.includes(order.orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `This order cannot be cancelled because it is already ${order.orderStatus}.`,
        },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.shopOrder.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to cancel order." },
      { status: 500 }
    );
  }
}