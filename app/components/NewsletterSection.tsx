"use client";

import React from "react";

export default function NewsletterSection() {
  return (
    <section className="bg-[#f3f3f3] px-4 py-10 sm:px-6 sm:py-10 md:px-8 md:py-16">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <p className="text-[16px] font-normal uppercase tracking-[0.03em] text-black sm:text-[16px] md:text-[21px]">
          SUBSCRIBE
        </p>

        <h2
          className="my-5 md:my-8 md:mb-10 max-w-full text-[21px] leading-[0.9] text-black sm:text-[24px] md:text-[48px] lg:text-[48px] xl:text-[48px]"
          style={{
            fontFamily: '"Instrument Serif", serif',
            transform: "scaleY(1.4)",
            transformOrigin: "top",
          }}
        >
          Join the <span className="text-[#C7002A]">BLTDIF</span> flow.
          <br />
          Be the first to discover new collections
          <br />
          and{" "}
          <span
            className="text-[#C7002A]"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: "italic",
            }}
          >
            unlock exclusive offers.
          </span>
        </h2>

        <div className="mt-8 w-full max-w-[300px] sm:mt-10 sm:max-w-[420px] md:max-w-[520px] lg:max-w-[580px]">
          <form className="flex items-center rounded-full border border-black/10 bg-[#f7f7f7] p-[4px]">
            <input
              type="email"
              placeholder="hello@bltdif.com"
              className="h-[46px] min-w-0 flex-1 bg-transparent px-5 text-center text-[16px] text-black placeholder:text-black/35 outline-none sm:h-[50px] sm:px-6 sm:text-[18px] md:text-left"
            />

            <button
              type="submit"
              className="flex h-[38px] shrink-0 items-center justify-center rounded-full bg-[#e8e6e6] px-6 text-[15px] font-medium text-black/40 transition hover:bg-[#dfdddd] sm:h-[42px] sm:px-7 sm:text-[16px] md:min-w-[130px]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}