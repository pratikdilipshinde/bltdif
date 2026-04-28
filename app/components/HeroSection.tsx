"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

const SLIDE_INTERVAL = 3500;
const SWIPE_THRESHOLD = 50;

const slides = [
  {
    desktopImage: "/images/home-hero-desktop-caps-v2.jpg",
    mobileImage: "/images/home-hero-mobile-caps-v2.jpg",
    subtitle: "",
    href: "/products/caps",
  },
  {
    desktopImage: "/images/home-hero-desktop-v2.jpg",
    mobileImage: "/images/home-hero-mobile-v2.jpg",
    subtitle: "",
    href: "/products/t-shirts",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goToNext();
    }

    if (info.offset.x > SWIPE_THRESHOLD) {
      goToPrev();
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      goToNext();
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section
      className="
        relative w-full overflow-hidden bg-black
        -mt-[56px] md:-mt-[72px] 
        h-[400px] 
        sm:h-[450px] 
        md:h-[320px] 
        lg:h-[480px] 
        xl:h-[550px] 
        2xl:h-[760px] 
        min-[2560px]:h-[150dvh] 
        min-[3840px]:h-[180dvh]
      "
    >
      {/* IMAGE SLIDER */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.7 },
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={slide.desktopImage}
            alt="BLTDIF Hero Desktop"
            fill
            priority={index === 0}
            sizes="100vw"
            className="hidden object-cover object-center md:block"
          />

          <Image
            src={slide.mobileImage}
            alt="BLTDIF Hero Mobile"
            fill
            priority={index === 0}
            sizes="100vw"
            className="block object-cover object-center md:hidden"
          />
        </motion.div>
      </AnimatePresence>

      {/* LEFT / RIGHT ARROWS */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="
              absolute left-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2
              items-center justify-center rounded-full border border-white/25
              bg-black/25 text-white backdrop-blur-md transition
              hover:bg-black/45 md:flex
            "
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="
              absolute right-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2
              items-center justify-center rounded-full border border-white/25
              bg-black/25 text-white backdrop-blur-md transition
              hover:bg-black/45 md:flex
            "
          >
            ›
          </button>
        </>
      )}

      {/* DOTS */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5 md:bottom-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}