"use client";

import React from "react";

export default function NewsletterSection() {
  return (
    <section className="bg-[#f3f3f3] mt-[-40px] px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-16 lg:py-16">
      <div className="mx-2 flex max-w-7xl flex-col items-center text-center">
        {/* Top label */}
        <p className="text-black text-sm font-medium uppercase tracking-[0.08em] sm:text-base md:text-lg">
          SUBSCRIBE
        </p>

        {/* Main heading */}
        <div className="mt-6 max-w-[1200px]">
          <h2
            className="text-black font-stretch-200% leading-[1.06] text-[34px] sm:text-[48px] md:text-3xl lg:text-4xl xl:text-5xl"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            Join the <span className="text-[#C7002A]">BLTDIF</span> flow.
            <br />
            Be the first to discover new collections
            <br />
            and{" "}
            <span
              className="text-[#C7002A]"
              style={{
                fontFamily: '"Momo Signature", "Lucida Handwriting", cursive',
              }}
            >
              unlock exclusive offers.
            </span>
          </h2>
        </div>

        {/* Email form */}
        <div className="mt-10 w-full max-w-[300px] sm:mt-12 sm:max-w-[420px] md:max-w-[560px] lg:max-w-[620px]">
          <form className="flex items-center rounded-full border border-black/10 bg-white p-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] sm:p-2">
            <input
              type="email"
              placeholder="hello@bltdif.com"
              className="h-[36px] w-0 flex-1 bg-transparent px-4 text-center text-base text-black placeholder:text-black/35 outline-none sm:h-[56px] sm:px-6 sm:text-lg md:text-xl lg:text-2xl sm:text-left"
            />

            <button
              type="submit"
              className="flex h-[36px] shrink-0 items-center justify-center rounded-full bg-[#eceaea] px-5 text-base font-medium text-black/45 transition hover:bg-[#e2e2e2] sm:h-[56px] sm:px-8 sm:text-lg md:px-10 md:text-xl lg:min-w-[200px]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}