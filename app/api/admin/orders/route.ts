import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendOrderUpdateEmail } from "@/app/lib/email/sendOrderUpdateEmail";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const orders = await prisma.shopOrder.findMany({
      where: status ? { orderStatus: status as any } : {},
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      addressLine1: order.addressLine1,
      addressLine2: order.addressLine2,
      city: order.city,
      state: order.state,
      zipCode: order.zipCode,
      country: order.country,

      subtotalAmount: Number(order.subtotalAmount),
      shippingAmount: Number(order.shippingAmount),
      discountAmount: Number(order.discountAmount),
      taxAmount: Number(order.taxAmount),
      totalAmount: Number(order.totalAmount),

      currencyCode: order.currencyCode,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentProvider: order.paymentProvider,
      paymentId: order.paymentId,
      paymentOrderId: order.paymentOrderId,

      trackingNumber: order.trackingNumber,
      courierName: order.courierName,
      trackingUrl: order.trackingUrl,
      customerNote: order.customerNote,
      adminNote: order.adminNote,

      paidAt: order.paidAt?.toISOString() ?? null,
      shippedAt: order.shippedAt?.toISOString() ?? null,
      deliveredAt: order.deliveredAt?.toISOString() ?? null,
      cancelledAt: order.cancelledAt?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),

      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,

        productId: item.productId.toString(),
        variantId: item.variantId.toString(),

        productCode: item.productCode,
        sku: item.sku,
        productName: item.productName,
        categoryCode: item.categoryCode,
        sizeCode: item.sizeCode,
        sizeLabel: item.sizeLabel,
        color: item.color,
        imageUrl: item.imageUrl,
        quantity: item.quantity,

        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),

        createdAt: item.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({
      success: true,
      orders: safeOrders,
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      orderStatus,
      trackingNumber,
      courierName,
      trackingUrl,
      adminNote,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.shopOrder.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const updateData: any = {
      orderStatus,
      trackingNumber,
      courierName,
      trackingUrl,
      adminNote,
    };

    if (orderStatus === "SHIPPED" && !existingOrder.shippedAt) {
      updateData.shippedAt = new Date();
    }

    if (orderStatus === "DELIVERED" && !existingOrder.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    if (orderStatus === "CANCELLED" && !existingOrder.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    const updatedOrder = await prisma.shopOrder.update({
      where: {
        id: orderId,
      },
      data: updateData,
    });

    const hasChanged =
      existingOrder.orderStatus !== updatedOrder.orderStatus ||
      existingOrder.trackingNumber !== updatedOrder.trackingNumber ||
      existingOrder.courierName !== updatedOrder.courierName ||
      existingOrder.trackingUrl !== updatedOrder.trackingUrl ||
      existingOrder.adminNote !== updatedOrder.adminNote;

    if (hasChanged) {
      await sendOrderUpdateEmail({
        to: updatedOrder.customerEmail,
        customerName: updatedOrder.customerName,
        orderNumber: updatedOrder.orderNumber,
        orderStatus: updatedOrder.orderStatus,
        courierName: updatedOrder.courierName,
        trackingNumber: updatedOrder.trackingNumber,
        trackingUrl: updatedOrder.trackingUrl,
        adminNote: updatedOrder.adminNote,
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        customerPhone: updatedOrder.customerPhone,

        orderStatus: updatedOrder.orderStatus,
        paymentStatus: updatedOrder.paymentStatus,

        trackingNumber: updatedOrder.trackingNumber,
        courierName: updatedOrder.courierName,
        trackingUrl: updatedOrder.trackingUrl,
        adminNote: updatedOrder.adminNote,

        totalAmount: Number(updatedOrder.totalAmount),
        shippedAt: updatedOrder.shippedAt?.toISOString() ?? null,
        deliveredAt: updatedOrder.deliveredAt?.toISOString() ?? null,
        cancelledAt: updatedOrder.cancelledAt?.toISOString() ?? null,
        updatedAt: updatedOrder.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin order update error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update order." },
      { status: 500 }
    );
  }
}