"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SortKey } from "../../lib/shop/types";

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);

  const label =
    value === "featured"
      ? "Featured"
      : value === "price_asc"
      ? "Price: Low → High"
      : value === "price_desc"
      ? "Price: High → Low"
      : "Newest";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:border-black/20"
      >
        Sort: {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-20 mt-2 w-56 overflow-hidden text-black/60 rounded-md border border-black/10 bg-white shadow-xl"
          >
            {[
              { k: "featured", t: "Featured" },
              { k: "newest", t: "Newest" },
              { k: "price_asc", t: "Price: Low → High" },
              { k: "price_desc", t: "Price: High → Low" },
            ].map((o) => (
              <button
                key={o.k}
                onClick={() => {
                  onChange(o.k as SortKey);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-black/5 ${
                  value === o.k ? "font-semibold" : ""
                }`}
              >
                <span>{o.t}</span>
                {value === o.k && <span className="text-[#CE0028]">●</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
