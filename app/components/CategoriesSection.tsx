"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND_RED = "#CE0028";

const cards = [
  {
    title: "T-Shirt",
    href: "/t-shirts",
    image: "/images/Tee-mock.jpg",
  },
  {
    title: "Cap",
    href: "/caps",
    image: "/images/Cap-mock.jpg",
  },
  {
    title: "Hoodie",
    href: "/hoodies",
    image: "/images/Hoodie-mock.jpg",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-1 mt-2 md:py-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 md:gap-x-2 lg:gap-x-3 gap-y-2">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              delay: idx * 0.06,
            }}
          >
            <Link
              href={card.href}
              className="group relative block overflow-hidden bg-black"
            >
              <div className="relative w-full aspect-[6/5]">
                {/* Image */}
                <motion.div
                  className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1.02 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </motion.div>

                {/* Bottom Content (Title + Button aligned properly) */}
                <div className="absolute inset-x-0 bottom-4 md:bottom-5 px-4 md:px-5 z-10 flex items-center justify-between">
                  
                  {/* Title */}
                  <h3 className="text-white text-2xl md:text-[22px] lg:text-[24px] font-normal leading-none">
                    {card.title}
                  </h3>

                  {/* Shop Button */}
                  <span className="bg-white rounded-full text-black px-4 py-1.5 text-xs md:text-sm font-medium transition hover:bg-neutral-200">
                    Shop
                  </span>
                </div>

                {/* Top Accent Line */}
                <div
                  className="pointer-events-none absolute left-0 top-0 h-[3px] w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${BRAND_RED}, transparent)`,
                  }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}