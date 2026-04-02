"use client";

import React, { useState } from "react";
import AuthModal from "./auth/AuthModal"; // adjust path if needed

export default function NewsletterSection() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <section className="px-4 py-10 sm:px-6 sm:py-10 md:px-8 md:py-16">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
          
          <p className="text-[16px] font-normal uppercase tracking-[0.03em] text-black sm:text-[16px] md:text-[21px]">
            SUBSCRIBE
          </p>

          <h2
            className="my-5 md:my-8 md:mb-10 max-w-full text-[21px] leading-[0.9] text-black sm:text-[24px] md:text-[48px]"
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

          {/* Same Button UI */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setAuthOpen(true)} // 👈 same as navbar openAuth
              className="flex h-[38px] cursor-pointer items-center justify-center rounded-full bg-[#e8e6e6] px-6 text-[15px] font-medium text-black/40 transition hover:bg-[#dfdddd] sm:h-[42px] sm:px-7 sm:text-[16px] md:min-w-[130px]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Auth Modal (REGISTER mode) */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode="register" // 👈 IMPORTANT
      />
    </>
  );
}