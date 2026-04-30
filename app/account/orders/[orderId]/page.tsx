"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type OrderItem = {
  id: string;
  productName: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  sizeLabel?: string | null;
  color?: string | null;
  sku: string;
};

type Order = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: string;
  subtotalAmount: string;
  shippingAmount: string;
  discountAmount: string;
  taxAmount: string;
  currencyCode: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("userEmail");

      const query = userId
        ? `userId=${userId}`
        : email
        ? `email=${email}`
        : "";

      if (!query) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/shop/orders/${orderId}?${query}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      }

      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-24">
        Loading order...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-24">
        <div className="mx-auto max-w-4xl rounded-xs bg-white p-8">
          <h1 className="text-2xl font-semibold">Order not found</h1>
          <Link href="/account/orders" className="mt-4 inline-block underline">
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-24 text-black">
      <div className="mx-auto max-w-5xl">
        <Link href="/account/orders" className="text-sm underline">
          Back to My Orders
        </Link>

        <div className="mt-6 rounded-xs border border-black/10 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                Order Details
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {order.orderNumber}
              </h1>
              <p className="mt-2 text-sm text-black/50">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
                {order.orderStatus}
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-6 rounded-xs bg-black p-4 text-white">
              <p className="text-sm text-white/60">Tracking</p>
              <p className="mt-1 font-medium">
                {order.courierName || "Courier"} - {order.trackingNumber}
              </p>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  className="mt-2 inline-block text-sm underline"
                >
                  Track shipment
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xs border border-black/10 bg-white p-6">
            <h2 className="text-xl font-semibold">Items</h2>

            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-black/10 pb-4 last:border-0"
                >
                  <div className="relative h-24 w-20 overflow-hidden rounded-xs bg-neutral-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="mt-1 text-xs text-black/50">
                      SKU: {item.sku}
                    </p>
                    <p className="mt-1 text-sm text-black/60">
                      {item.sizeLabel && `Size: ${item.sizeLabel}`}
                      {item.color && ` | Color: ${item.color}`}
                    </p>
                    <p className="mt-1 text-sm text-black/60">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right text-sm font-medium">
                    {order.currencyCode} {item.totalPrice}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xs border border-black/10 bg-white p-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {order.currencyCode} {order.subtotalAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.currencyCode} {order.shippingAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    {order.currencyCode} {order.taxAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>
                    - {order.currencyCode} {order.discountAmount}
                  </span>
                </div>
                <div className="border-t border-black/10 pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>
                      {order.currencyCode} {order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xs border border-black/10 bg-white p-6">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <p className="mt-4 text-sm leading-6 text-black/70">
                {order.customerName}
                <br />
                {order.addressLine1}
                <br />
                {order.addressLine2 && (
                  <>
                    {order.addressLine2}
                    <br />
                  </>
                )}
                {order.city}, {order.state} {order.zipCode}
                <br />
                {order.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}