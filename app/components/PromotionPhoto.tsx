"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PromotionPhoto() {
  return (
    <section className="bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[420px] md:h-[520px] overflow-hidden"
      >
        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src="/images/cap-summer-banner1.jpg"
            alt="Summer Collection"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src="/images/cap-summer-banner-mobile.jpg"
            alt="Summer Collection"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Overlay (same for both) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-10 md:py-14">
          
          {/* Title */}
          <h2 className="text-white text-2xl md:text-4xl font-semibold tracking-wide">
            ★ SUMMER ESSENTIALS ★
          </h2>

          {/* Button */}
          <Link
            href="/caps"
            className="bg-white rounded-full text-black px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-medium hover:bg-neutral-200 transition inline-block"
            >
            Shop Now
        </Link>
        </div>
      </motion.div>
    </section>
  );
}