"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const SLIDE_INTERVAL = 4500;

const slides = [
  {
    image: "/images/hero1-2.5x-min.webp",
    title: "BUILT DIFFERENT",
    subtitle: "Streetwear for creators who refuse average",
    cta: "Explore T-Shirts",
    href: "/t-shirts",
  },
  {
    image: "/images/hero2-2.5x-min.webp",
    title: "ENGINEERED COMFORT",
    subtitle: "Heavyweight hoodies for late nights",
    cta: "Explore Hoodies",
    href: "/hoodies",
  },
  {
    image: "/images/hero3-2.5x-min.webp",
    title: "MINIMAL. ICONIC.",
    subtitle: "Caps that complete the fit",
    cta: "Explore Caps",
    href: "/caps",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative w-full h-[70vh] md:h-[96vh] overflow-hidden">
      {/* IMAGE SLIDER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/45" />

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide">
              {slide.title}
            </h1>

            <p className="mt-4 text-white/80 text-sm md:text-lg">
              {slide.subtitle}
            </p>

            <Link
              href={slide.href}
              className="inline-flex mt-8 items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black hover:bg-[#CE0028] hover:text-white transition"
            >
              {slide.cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
    </section>
  );
}
