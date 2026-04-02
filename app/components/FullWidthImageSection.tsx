"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const cards = [
  {
    title: "T-Shirt",
    image: "/images/Tee-mock.jpg", // replace if needed
    alt: "T-Shirt",
  },
  {
    title: "Hoodie",
    image: "/images/Hoodie-mock.jpg", // replace if needed
    alt: "Hoodie",
  },
];

export default function FullWidthImageSection() {
  return (
    <section className="w-full pb-16">
      <div className="mx-auto w-full max-w-[1400px] px-4">
        {/* Background image */}
        <Image
          src="/images/coming-soon-home.png"
          alt="Coming soon background"
          width={1400}
          height={600}
          priority
          className="block w-full h-auto object-contain"
        />

        {/* Cards */}
        <div className="-mt-20 sm:-mt-24 md:-mt-32 lg:-mt-40 relative z-10 px-2 sm:px-4">
          <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                {/* Backdrop shadow */}
                <div className="absolute left-[10%] right-[10%] -bottom-5 h-14 rounded-full bg-black/20 blur-2xl" />

                <div className="relative overflow-hidden rounded-[18px] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                  <div className="relative h-[220px] sm:h-[250px] md:h-[280px] w-full">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(min-width: 768px) 460px, 92vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
                      <h3 className="text-lg md:text-[22px] text-white">
                        {card.title}
                      </h3>

                      <span className="rounded-full bg-[#f2d35b] px-4 py-1.5 text-sm font-medium text-black md:text-base">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}