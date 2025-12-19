"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandMarquee() {
  // Repeat image enough times for seamless scroll
  const images = Array(16).fill("/images/BrandMarquee1.png");

  return (
    <section className="bg-black overflow-hidden">
      <div className=" py-6">
        <motion.div
          className="flex w-max items-center gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {images.map((src, idx) => (
            <div key={idx} className="relative h-8 md:h-8 w-auto">
              <Image
                src={src}
                alt="BUILT DIFFERENT"
                width={420}
                height={40}
                className="h-full w-auto object-contain select-none"
                priority={idx < 2}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
