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
      <div className="mx-auto max-w-full">
        <div className="grid grid-cols-4 md:grid-cols-4  border-r-black/90  bg-white/75">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className={[
                  "flex flex-col items-center justify-center text-center",
                  "px-2 py-2 md:py-2",
                  "gap-3",
                  idx !== 0 ? "border-l border-black/10" : "",
                  "min-h-[40px] md:min-h-[70px]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 md:h-8 md:w-8 text-black/90" strokeWidth={1.6} />
                <p className="text-[8px] md:text-[12px] font-semibold tracking-[0.26em] text-black/90 uppercase">
                  {it.title}
                </p>
                {/* <p className="max-w-[260px] text-[10px] md:text-[11px] tracking-[0.16em] text-black/55 uppercase leading-relaxed">
                  {it.desc}
                </p> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
