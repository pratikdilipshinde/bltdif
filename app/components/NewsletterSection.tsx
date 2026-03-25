"use client";

import React from "react";

export default function NewsletterSection() {
  return (
    <section className="bg-black px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Brand */}
        <h2
          className="text-[#CE0028] text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
          style={{ fontFamily: '"Times New Roman", Georgia, serif' }}
        >
          BLTDIF
        </h2>

        {/* Heading */}
        <p
          className="mt-8 text-[#CE0028] text-3xl leading-tight sm:mt-10 sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive' }}
        >
          unlock exclusive offers
        </p>

        {/* Subscribe box */}
        <div className="mt-10 w-full max-w-[760px] sm:mt-12">
          <form className="flex flex-col gap-3 rounded-full border border-white/80 bg-black p-2 sm:flex-row sm:items-center sm:gap-2">
            <input
              type="email"
              placeholder="hello@bltdif.com"
              className="h-14 w-full rounded-full bg-transparent px-6 text-center text-lg text-white placeholder:text-white/55 outline-none sm:h-16 sm:text-left sm:text-2xl"
            />

            <button
              type="submit"
              className="h-14 shrink-0 rounded-full bg-white px-8 text-lg font-medium text-black transition hover:bg-white/90 sm:h-16 sm:min-w-[200px] sm:px-10 sm:text-2xl"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}