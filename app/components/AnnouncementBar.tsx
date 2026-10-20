"use client";

import React from "react";


export default function AnnouncementBar() {
  return (
    <>
    {/* =====================================================
          PROMO BAR
      =====================================================
      
      
      

      <div className="fixed left-0 right-0 top-0 z-[110] flex h-[32px] items-center justify-center bg-black px-4">
        <p className="text-center text-[9px] font-medium tracking-[0.12em] text-white sm:text-[10px] md:text-[11px]">
          GET 10% OFF YOUR FIRST ORDER - WE DELIVER FREE ACROSS INDIA
        </p>
      </div>
      */}

      <section className="w-full bg-black text-white my-0">
      <div className="mx-auto flex items-center justify-center px-2 md:px-4 py-1 md:py-2">
        <p className="text-center text-[0.5rem] sm:text-[0.5rem] md:text-xs tracking-wide transition-opacity duration-300 cursor-default">
          NEW HOODIES COLLECTION NOW AVAILABLE | WE DELIVER FREE ACROSS INDIA
        </p>
        
      </div>
    </section>

    
    </>
  );
}