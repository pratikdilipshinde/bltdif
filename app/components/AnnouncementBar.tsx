"use client";

import React from "react";

export default function AnnouncementBar() {
  return (
    <section className="w-full bg-black text-white my-1">
      <div className="mx-auto flex items-center justify-center px-2 md:px-4 py-2 md:py-3">
        <p className="text-center text-xs sm:text-xs md:text-base tracking-wide transition-opacity duration-300 cursor-default">
          New T-Shirt Collection Now Available | Free Shipping on All Orders
        </p>
      </div>
    </section>
  );
}