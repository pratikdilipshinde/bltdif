"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            relative overflow-hidden md:overflow-visible rounded-3xl p-8 md:p-14
            border border-white/10
            shadow-[0_18px_60px_rgba(0,0,0,0.28)]
            bg-gradient-to-br from-[#CE0028] via-[#CE0028] to-[#af0127]
          "
        >
          {/* subtle premium lighting inside the card */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl">
            {/* top-left soft highlight */}
            <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-white/18 blur-3xl" />
            {/* right-side glow behind shirt */}
            <div className="absolute -right-28 top-10 h-96 w-96 rounded-full bg-black/25 blur-3xl" />
            {/* vignette */}
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0,_rgba(0,0,0,0.20)_55%,_rgba(0,0,0,0.30)_100%)]" />
          </div>

          <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            {/* LEFT */}
            <div className="flex-1">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="
                  inline-flex items-center gap-2 rounded-full
                  border border-white/20 bg-white/10
                  px-4 py-1.5 text-[11px]
                  tracking-[0.22em] text-white/90
                "
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                BLTDIF · DROP 01 · NIGHT SHIFT
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="
                  mt-5 text-[30px] leading-tight font-semibold
                  text-white md:text-[44px] lg:text-[48px]
                "
              >
                Premium streetwear engineered
                <span className="block text-white/95">
                  for people who build different
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="
                  mt-4 max-w-xl text-[14px] leading-relaxed
                  text-white/80 md:text-[15px]
                "
              >
                Oversized tees, hoodies, and essentials crafted with intent.
                Minimal branding. Maximum quality. Built for late-night work,
                early training sessions, and every moment you choose to move
                different from the crowd.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="mt-7 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/products"
                  className="
                    rounded-full px-6 py-3 text-sm font-semibold
                    bg-[#0A0A0C] text-white
                    shadow-[0_14px_40px_rgba(0,0,0,0.35)]
                    hover:bg-black transition
                  "
                >
                  Shop Collection
                </Link>

                <Link
                  href="/hoodies"
                  className="
                    rounded-full px-6 py-3 text-sm font-semibold
                    border border-white/30 text-white
                    bg-white/0 hover:bg-white/10
                    hover:border-white/55 transition
                  "
                >
                  View Hoodies
                </Link>
              </motion.div>

              {/* Feature chips */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="mt-6 flex flex-wrap gap-3 text-[11px] text-white/85"
              >
                <span className="rounded-full border border-white/22 bg-white/10 px-3 py-1">
                  320 GSM Cotton
                </span>
                <span className="rounded-full border border-white/22 bg-white/10 px-3 py-1">
                  Oversized Fits
                </span>
                <span className="rounded-full border border-white/22 bg-white/10 px-3 py-1">
                  Limited Drop
                </span>
              </motion.div>
            </div>

            {/* RIGHT: mobile shirt (inside) */}
            <div className="flex justify-center md:hidden">
              <div className="mt-4 h-64 w-56">
                <Image
                  src="/images/tshirt-1-3d.png"
                  alt="BLTDIF T-shirt"
                  width={520}
                  height={680}
                  className="h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT: desktop floating shirt (overflowing) */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.95, rotate: 6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ rotateX: 10, rotateY: -10, y: -10, scale: 1.05 }}
            className="pointer-events-none hidden md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute right-[-160px] bottom-[-170px] h-[420px] w-[380px] lg:h-[720px] lg:w-[620px]">
              {/* glow behind shirt (makes it pop) */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />

              {/* Shadow underneath */}
              <div
                className="absolute inset-x-10 bottom-2 h-12 rounded-full bg-black/45 blur-2xl"
                style={{ transform: "translateZ(-40px)" }}
              />

              {/* Actual image */}
              <div
                className="relative h-full w-full"
                style={{ transform: "translateZ(40px)" }}
              >
                <Image
                  src="/images/tshirt-1-3d.png"
                  alt="BLTDIF T-shirt"
                  width={900}
                  height={1000}
                  className="h-full w-full object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.55)]"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
