"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TwoCardSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/coming-soon-home.png"
          alt="Coming soon background"
          fill
          priority
          className="object-contain opacity-[0.76]"
        />
      </div>

      

      {/* Cards */}
      <div className="relative z-10 mx-auto flex max-w-[940px] justify-center px-4">
        <div className="flex w-full justify-center gap-5 md:gap-10">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="relative w-1/2 max-w-[390px]"
          >
            <div className="absolute left-[10%] right-[10%] -bottom-7 h-16 rounded-full bg-black/18 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl bg-black shadow-[0_20px_40px_rgba(0,0,0,0.14)]">
              <Image
                src="/images/Tee-mock.jpg"
                alt="T-Shirt"
                width={300}
                height={200}
                className="h-[170px] w-full object-cover sm:h-[190px] md:h-[235px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4">
                <h3 className="text-[15px] p-2 font-normal leading-none text-white sm:text-[18px] md:text-[20px]">
                  T-Shirt
                </h3>

                {/* <span className="inline-flex p-2 items-center rounded-full bg-gradient-to-r from-[#f1d35b] via-[#f6df7b] to-[#e5ba47] px-3 py-1.5 text-[11px] font-medium leading-none text-black sm:px-4 sm:text-[13px]">
                  Coming Soon
                </span> */}
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative w-1/2 max-w-[390px]"
          >
            <div className="absolute left-[10%] right-[10%] -bottom-7 h-16 rounded-full bg-black/18 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl bg-black shadow-[0_20px_40px_rgba(0,0,0,0.14)]">
              <Image
                src="/images/Hoodie-mock.jpg"
                alt="Hoodie"
                width={300}
                height={200}
                className="h-[170px] w-full object-cover sm:h-[190px] md:h-[235px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4">
                <h3 className="text-[15px] font-normal leading-none text-white sm:text-[18px] md:text-[20px]">
                  Hoodie
                </h3>

                {/* <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#f1d35b] via-[#f6df7b] to-[#e5ba47] px-3 py-1.5 text-[11px] font-medium leading-none text-black sm:px-4 sm:text-[13px]">
                  Coming Soon
                </span> */}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}