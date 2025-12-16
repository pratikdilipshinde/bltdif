"use client";

import Image from "next/image";

export default function PhotosSection() {
  return (
    <section className="bg-white py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="
            grid gap-4
            md:grid-cols-3 md:grid-rows-2
            md:auto-rows-[260px]
          "
        >
          {/* Left tall block (2 rows) */}
          <div className="relative md:row-span-2 overflow-hidden rounded-sm bg-gray-300 min-h-[260px]">
            <Image
              src="/images/photo-1.jpg"
              alt="Photo 1"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
              priority
            />
          </div>

          {/* Top wide block */}
          <div className="relative md:col-span-2 overflow-hidden rounded-sm bg-gray-300 min-h-[260px]">
            <Image
              src="/images/photo-3.jpg"
              alt="Photo 2"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 66vw, 100vw"
            />
          </div>

          {/* Bottom left */}
          <div className="relative overflow-hidden rounded-sm bg-gray-300 min-h-[260px]">
            <Image
              src="/images/photo-4.jpg"
              alt="Photo 3"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>

          {/* Bottom right */}
          <div className="relative overflow-hidden rounded-sm bg-gray-300 min-h-[260px]">
            <Image
              src="/images/photo-5.jpg"
              alt="Photo 4"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
