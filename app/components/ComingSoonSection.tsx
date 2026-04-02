"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const cards = [
  {
    title: "T-Shirt",
    image: "/images/Tee-mock.jpg",
    alt: "T-Shirt coming soon",
  },
  {
    title: "Hoodie",
    image: "/images/Hoodie-mock.jpg",
    alt: "Hoodie coming soon",
  },
];

export default function ComingSoonSection() {
  return (
    <section className="relative h-3/4 w-full bg-[#efefef] py-16 md:py-24">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-none md:rounded-[24px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/coming-soon-home.png"
            alt="Coming soon background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/25" />

        {/* Section inner area */}
        <div className="relative min-h-[520px] md:min-h-[680px] px-4 py-16 sm:px-6 md:px-10">
          {/* Big faded background text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-center text-[72px] font-black uppercase leading-[0.82] tracking-[-0.08em] text-black/[0.05] sm:text-[110px] md:text-[170px] lg:text-[220px] xl:text-[260px]">
              COMING
            </span>
            <span className="-mt-3 text-center text-[72px] font-black uppercase leading-[0.82] tracking-[-0.08em] text-black/[0.05] sm:text-[110px] md:text-[170px] lg:text-[220px] xl:text-[260px]">
              SOON
            </span>
          </div>

          {/* Cards */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 pt-8 md:flex-row md:gap-10 md:pt-16">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative w-full max-w-[520px]"
              >
                {/* Shadow under card */}
                <div className="absolute inset-x-10 -bottom-6 h-16 rounded-full bg-black/20 blur-3xl" />

                {/* Card */}
                <div className="relative overflow-hidden rounded-[20px] bg-black shadow-[0_18px_50px_rgba(0,0,0,0.20)]">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(min-width: 768px) 42vw, 92vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                      <h3 className="text-xl font-normal leading-none text-white sm:text-2xl">
                        {card.title}
                      </h3>

                      <span className="inline-flex shrink-0 items-center rounded-full bg-[#f2d35b] px-4 py-2 text-sm font-medium leading-none text-black sm:text-base">
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