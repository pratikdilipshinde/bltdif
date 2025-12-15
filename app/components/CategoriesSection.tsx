"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CategoriesSection() {
  return (
    <section className="bg-gray-50 py-12 md:py-2">
      <div className="mx-auto max-w-6xl px-4">
        {/* CENTERED TITLE */}{" "}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="text-center mt-10"
        >
          
          <p className="text-xs tracking-[0.32em] uppercase text-black/45">
            {" "}
            Categories{" "}
          </p>{" "}
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
            {" "}
            Shop the essentials{" "}
          </h2>{" "}
          <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-black/55">
            {" "}
            Clean drops. Premium fits. Built around your grind.{" "}
          </p>{" "}
        </motion.div>
        {/* Whole strip */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-1 mt-[-5%]">
          {/* product image */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.10 }}
            className="relative"
            whileHover={{ y: -6 }}
          >
            <div className="relative mx-auto h-[320px] w-[260px] md:h-[620px] md:w-[420px]">
              <Image
                src="/images/tshirt-category.png"
                alt="T-Shirts"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
          {/* MIDDLE: Caps (2 rows) */}
          <div className="flex flex-col items-center justify-center gap-16">
            {/* Row 1: Caps image */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.10 }}
              className="relative"
              whileHover={{ y: -6 }}
            >
              <div className="relative h-[220px] w-[320px] md:h-[260px] md:w-[360px]">
                <Image
                  src="/images/cap-category.png"
                  alt="Caps"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            {/* Row 2: Explore All + BD logo */}
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/products"
                className="
                        rounded-full border border-black/60 bg-white text-black/60
                        px-10 py-3 text-sm font-semibold tracking-[0.18em]
                        transition hover:-translate-y-0.5 hover:border-[#CE0028] hover:text-[#CE0028]
                        "
              >
                EXPLORE ALL
              </Link>

              {/* BD logo */}
              <Image
                src="/images/BD-logo.png"
                alt="BD Logo"
                width={36}
                height={36}
                className="opacity-90"
              />
            </div>
          </div>
          {/* product image */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.10 }}
            className="relative"
            whileHover={{ y: -6 }}
          >
            <div className="relative mx-auto md:ml-[-12%] h-[320px] w-[260px] md:h-[620px] md:w-[420px]">
              <Image
                src="/images/hoodie-category.png"
                alt="Hoodies"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
