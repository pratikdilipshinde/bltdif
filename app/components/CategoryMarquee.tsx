"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CategoryMarquee() {
  return (
    <section className="relative overflow-hidden mt-2 mb-2">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          backgroundImage:
            "linear-gradient(270deg, #000000, #7a0015, #000000)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* LOGO GRID */}
      <div className="relative z-10 py-4 md:py-5">
        <div
          className="
            grid 
            grid-cols-3 
            md:grid-cols-5 
            items-center 
            justify-items-center 
            gap-6 md:gap-10
          "
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`
                ${i >= 3 ? "hidden md:block" : ""}
                flex items-center justify-center
              `}
            >
              <Image
                src="/images/BrandMarquee1.png"
                alt="Built Different"
                width={300}
                height={60}
                className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] h-auto object-contain opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}