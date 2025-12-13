"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Slide = {
  key: string;
  bgClass: string;
  glowClass: string;
  tagline: string;
  titleTop: string;
  titleEmphasis: string;
  desc: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  chips: string[];
  imageSrc: string;
};

const SLIDE_MS = 4500;

const textVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    filter: "blur(6px)",
  }),
};

const imageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 70 : -70,
    opacity: 0,
    scale: 0.98,
    rotate: dir > 0 ? 6 : -6,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -70 : 70,
    opacity: 0,
    scale: 0.98,
    rotate: dir > 0 ? -6 : 6,
    filter: "blur(6px)",
  }),
};

export default function Hero() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "tshirts",
        bgClass: "bg-gradient-to-br from-[#CE0028] via-[#CE0028] to-[#af0127]",
        glowClass: "absolute -right-28 top-10 h-96 w-96 rounded-full bg-black/25 blur-3xl",
        tagline: "BLTDIF · DROP 01 · T-SHIRTS",
        titleTop: "Premium streetwear engineered",
        titleEmphasis: "for people who build different",
        desc:
          "Oversized tees, hoodies, and essentials crafted with intent. Minimal branding. Maximum quality.",
        primaryHref: "/t-shirts",
        primaryLabel: "Shop T-Shirts",
        secondaryHref: "/products",
        secondaryLabel: "View All",
        chips: ["Premium Cotton", "Oversized Fits", "Limited Drop"],
        imageSrc: "/images/tshirt-1-3d.png",
      },
      {
        key: "hoodies",
        bgClass: "bg-gradient-to-br from-[#775d48] via-[#6b523f] to-[#4f3c2e]",
        glowClass: "absolute -right-28 top-10 h-96 w-96 rounded-full bg-black/25 blur-3xl",
        tagline: "BLTDIF · DROP 01 · HOODIES",
        titleTop: "Heavyweight hoodies built",
        titleEmphasis: "for late nights & early wins",
        desc:
          "Structured warmth, premium fleece, and clean branding. The hoodie you live in when you’re locked in.",
        primaryHref: "/hoodies",
        primaryLabel: "Shop Hoodies",
        secondaryHref: "/products",
        secondaryLabel: "View All",
        chips: ["Heavyweight", "Soft Fleece", "Street Fit"],
        imageSrc: "/images/hoodie-back-3d.png", // <-- add your hoodie front image here
      },
      {
        key: "caps",
        bgClass: "bg-gradient-to-br from-[#4b1410] via-[#3b0f0c] to-[#220807]",
        glowClass: "absolute -right-28 top-10 h-96 w-96 rounded-full bg-black/35 blur-3xl",
        tagline: "BLTDIF · DROP 01 · CAPS",
        titleTop: "Minimal caps designed",
        titleEmphasis: "to stand out quietly",
        desc:
          "A clean profile with premium finishing. Everyday essential. Built to complement the fit.",
        primaryHref: "/caps",
        primaryLabel: "Shop Caps",
        secondaryHref: "/products",
        secondaryLabel: "View All",
        chips: ["Clean Profile", "Premium Stitch", "Limited Runs"],
        imageSrc: "/images/cap-2-3d.png", // <-- your cap image
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="bg-white px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        {/* CARD stays fixed. Only bg changes */}
        <motion.div
          className={`
            relative overflow-hidden md:overflow-visible rounded-3xl p-8 md:p-14
            border border-white/10
            shadow-[0_18px_60px_rgba(0,0,0,0.28)]
            ${slide.bgClass}
          `}
          animate={{}}
          transition={{ duration: 0.45 }}
        >
          {/* lighting layers */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl">
            <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-white/14 blur-3xl" />
            <div className={slide.glowClass} />
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0,_rgba(0,0,0,0.20)_55%,_rgba(0,0,0,0.30)_100%)]" />
          </div>

          <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            {/* TEXT: slides in/out */}
            <div className="flex-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.key + "-text"}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] tracking-[0.22em] text-white/90">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    {slide.tagline}
                  </div>

                  <h1 className="mt-5 text-[30px] leading-tight font-semibold text-white md:text-[44px] lg:text-[48px]">
                    {slide.titleTop}
                    <span className="block text-white/95">{slide.titleEmphasis}</span>
                  </h1>

                  <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/80 md:text-[15px]">
                    {slide.desc}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.primaryHref}
                      className="rounded-full px-6 py-3 text-sm font-semibold bg-[#0A0A0C] text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] hover:bg-black transition"
                    >
                      {slide.primaryLabel}
                    </Link>

                    <Link
                      href={slide.secondaryHref}
                      className="rounded-full px-6 py-3 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 hover:border-white/55 transition"
                    >
                      {slide.secondaryLabel}
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 text-[11px] text-white/85">
                    {slide.chips.map((c) => (
                      <span key={c} className="rounded-full border border-white/22 bg-white/10 px-3 py-1">
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* MOBILE IMAGE: slides in/out */}
            <div className="flex justify-center md:hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.key + "-img-m"}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-4 h-64 w-56"
                >
                  <Image
                    src={slide.imageSrc}
                    alt="BLTDIF product"
                    width={520}
                    height={680}
                    className="h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DESKTOP FLOATING IMAGE: slides in/out, card stays fixed */}
          <div className="pointer-events-none hidden md:block" style={{ transformStyle: "preserve-3d" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.key + "-img-d"}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-[-160px] bottom-[-200px] h-[420px] w-[380px] lg:h-[720px] lg:w-[620px]"
              >
                {/* <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" /> */}
                <div
                  className="absolute inset-x-10 bottom-2 h-12 rounded-full bg-black/45 blur-2xl"
                  style={{ transform: "translateZ(-40px)" }}
                />
                <div className="relative h-full w-full" style={{ transform: "translateZ(40px)" }}>
                  <Image
                    src={slide.imageSrc}
                    alt="BLTDIF product"
                    width={900}
                    height={1000}
                    className="h-full w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)]"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots (optional, nice UX) */}
          <div className="relative mt-6 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Go to ${s.key}`}
                className="h-2.5 w-2.5 rounded-full transition"
                style={{
                  backgroundColor: i === index ? "#CE0028" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
