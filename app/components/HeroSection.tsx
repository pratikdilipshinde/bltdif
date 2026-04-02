"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const SLIDE_INTERVAL = 4500;

const slides = [
  {
    desktopImage: "/images/Hero-main-img.png",
    mobileImage: "/images/Hero-main-img-mob.jpg",
    title: "/images/Hero-title.png",
    subtitle: "",
    href: "/",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative w-full overflow-hidden h-[65vh] md:h-[78vh] lg:h-[100dvh] -mt-[56px] md:-mt-[72px]">
      {/* IMAGE SLIDER */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`${slide.desktopImage}-${slide.mobileImage}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Desktop / Tablet Image */}
          <Image
            src={slide.desktopImage}
            alt="Hero Desktop"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-center"
          />

          {/* Mobile Image */}
          <Image
            src={slide.mobileImage}
            alt="Hero Mobile"
            fill
            priority
            sizes="100vw"
            className="block md:hidden object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* DARK OVERLAY */}
      {/* <div className="absolute inset-0 bg-black/30 sm:bg-black/35" /> */}

      {/* HERO TITLE IMAGE */}
      {/* <div className="absolute top-6 sm:top-8 md:top-10 lg:top-12 left-1/2 -translate-x-1/2 z-20 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={slide.title}
              alt="Hero Title"
              width={350}
              height={100}
              priority
              sizes="(max-width: 640px) 150px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 250px"
              className="w-[150px] sm:w-[150px] md:w-[150px] lg:w-[220px] xl:w-[250px] h-auto object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div> */}

      {/* OPTIONAL SUBTITLE */}
      {slide.subtitle && (
        <div className="absolute top-[32%] sm:top-[34%] left-1/2 -translate-x-1/2 text-center z-20 px-4">
          <p className="text-white/80 text-xs sm:text-sm md:text-lg">
            {slide.subtitle}
          </p>
        </div>
      )}

      {/* DOTS */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}