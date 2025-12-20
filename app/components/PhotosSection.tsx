"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BrandMarquee from "./BrandMarquee";

function PhotoTile({
  src,
  alt,
  sizes,
  priority,
  delay = 0,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={`relative overflow-hidden bg-black ${className}`}
    >
      {/* Hover zoom */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out will-change-transform hover:scale-[1.06]"
      />

      {/* Optional subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25" />
    </motion.div>
  );
}

export default function PhotosSection() {
  return (
    <section className="bg-black pb-6">
      <BrandMarquee />

      <div className="px-2 md:px-2">
        <div className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid gap-4 md:grid-cols-[400px_1fr]">
            {/* Left (400w) */}
            <PhotoTile
              src="/images/photo-1.jpg"
              alt="Photo 1"
              sizes="(min-width: 768px) 400px, 100vw"
              priority
              delay={0.0}
              className="h-[320px] md:h-[500px]"
            />

            {/* Right (remaining width) */}
            <PhotoTile
              src="/images/photo-3.jpg"
              alt="Photo 2"
              sizes="(min-width: 768px) calc(100vw - 400px), 100vw"
              delay={0.08}
              className="h-[320px] md:h-[500px]"
            />
          </div>

          {/* Row 2 (full width) */}
          <PhotoTile
            src="/images/photo-5.jpg"
            alt="Photo 3"
            sizes="(min-width: 768px) 100vw, 100vw"
            delay={0.14}
            className="h-[320px] md:h-[500px]"
          />
        </div>
      </div>
    </section>
  );
}
