"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND_RED = "#CE0028";

const cards = [
  {
    title: "Cap",
    href: "/caps",
    image: "/images/cap-cat-img.png",
  },
  {
    title: "T-Shirt",
    href: "/t-shirts",
    image: "/images/tshirt-cat-img.png",
  },
  {
    title: "Hoodie",
    href: "/hoodies",
    image: "/images/hoodie-cat-img.png",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-1 md:py-1">
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
              {/* fixed equal card size */}
              <div className="relative w-full aspect-[6/5]">
                {/* image */}
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

                {/* bottom dark gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                {/* title */}
                <div className="absolute left-4 bottom-4 md:left-5 md:bottom-5 z-10">
                  <h3 className="text-white text-2xl md:text-[22px] lg:text-[24px] font-normal leading-none">
                    {card.title}
                  </h3>
                </div>

                {/* top accent line on hover */}
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