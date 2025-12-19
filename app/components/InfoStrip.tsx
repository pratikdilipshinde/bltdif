"use client";

import { Truck, Timer, MessageSquareText, ShieldCheck } from "lucide-react";

const items = [
  {
    title: "PAN INDIA DELIVERY",
    desc: "RECEIVE YOUR ORDER ANYWHERE IN INDIA.",
    icon: Truck,
  },
  {
    title: "FAST SHIPPING",
    desc: "GET IN TOUCH FOR ALL YOUR END MOMENT DELIVERY REQUIREMENTS",
    icon: Timer,
  },
  {
    title: "EXPERT ADVICE",
    desc: "HAPPY TO HELP WITH ANY SIZING OR PRODUCT-RELATED NEEDS.",
    icon: MessageSquareText,
  },
  {
    title: "SECURE PAYMENT",
    desc: "YOUR PAYMENT INFORMATION IS PROCESSED SECURELY.",
    icon: ShieldCheck,
  },
];

export default function InfoStrip() {
  return (
    <section className="bg-white my-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 border border-black/10 bg-black/5">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className={[
                  "flex flex-col items-center justify-center text-center",
                  "px-6 py-10 md:py-12",
                  "gap-3",
                  idx !== 0 ? "border-l border-black/10" : "",
                  "min-h-[140px] md:min-h-[170px]",
                ].join(" ")}
              >
                <Icon className="h-8 w-8 text-black/90" strokeWidth={1.6} />
                <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.26em] text-[#CE0028] uppercase">
                  {it.title}
                </p>
                <p className="max-w-[260px] text-[10px] md:text-[11px] tracking-[0.16em] text-black/55 uppercase leading-relaxed">
                  {it.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
