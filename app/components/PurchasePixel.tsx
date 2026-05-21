"use client";

import { useEffect, useRef } from "react";
import { metaPixelEvent } from "@/app/lib/metaPixel";

type PurchasePixelProps = {
  orderId: string;
  totalAmount: number;
  currency?: string;
};

export default function PurchasePixel({
  orderId,
  totalAmount,
  currency = "INR",
}: PurchasePixelProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (!orderId || !totalAmount) return;

    firedRef.current = true;

    metaPixelEvent("Purchase", {
      value: Number(totalAmount),
      currency,
      order_id: orderId,
      content_type: "product",
    });
  }, [orderId, totalAmount, currency]);

  return null;
}