"use client";

import { motion } from "framer-motion";

const items = ["HOODIES", "T-SHIRTS", "CAPS"];

export default function CategoryMarquee() {
  // Repeat items so it looks continuous
  const row = [...items, ...items, ...items, ...items];

  return (
    <section className="bg-white">
      <div className="border-y border-black/10 py-4 overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 14,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {row.map((text, idx) => (
            <div key={idx} className="flex items-center gap-10">
              <span className="text-sm md:text-base font-semibold tracking-[0.25em] text-black">
                {text}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#CE0028]" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
