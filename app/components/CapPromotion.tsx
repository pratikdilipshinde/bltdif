"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";


export default function CapPromotion() {
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
            src="/images/cap-promotion-banner.jpg"
            alt="Cap Promotion"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src="/images/cap-promotion-banner-mob.jpg"
            alt="Cap Promotion Mobile"
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
            
          </h2>

          {/* Button */}
          <Link
            href="/products/caps"
            className="
              liquid-button group relative inline-flex items-center justify-center
              overflow-hidden rounded-full
              border border-white/40
              bg-white/15
              px-6 py-2 md:px-8 md:py-3
              text-sm md:text-base font-medium text-white
              shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.55)]
              backdrop-blur-none
              backdrop-saturate-150
              transition-all duration-500 ease-out
              hover:bg-white/25
              hover:border-white/60
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.7)]
              hover:-translate-y-[1px]
              active:translate-y-0
            "
          >
            {/* Top glass reflection */}
            <span
              className="
                pointer-events-none absolute inset-x-2 top-0 h-px
                bg-gradient-to-r from-transparent via-white/80 to-transparent
                opacity-80
              "
            />

            {/* Soft liquid glow */}
            <span
              className="
                pointer-events-none absolute -top-1/2 left-1/4
                h-full w-1/2
                rounded-full
                bg-white/20
                blur-xl
                transition-transform duration-700
                group-hover:translate-x-1/2
              "
            />

            {/* Bottom reflection */}
            <span
              className="
                pointer-events-none absolute inset-x-3 bottom-0 h-px
                bg-gradient-to-r from-transparent via-white/30 to-transparent
              "
            />

            {/* Text */}
            <span className="relative z-10 font-semibold">
              Shop Now
            </span>
          </Link>
          {/* <Link
            href="/products/caps"
            className="bg-white rounded-full text-black px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-medium hover:bg-neutral-200 transition inline-block"
            >
            Shop Now
        </Link> */}
        </div>
      </motion.div>
    </section>
  );
}