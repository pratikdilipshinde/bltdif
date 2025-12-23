"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND_RED = "#CE0028";

const cards = [
  {
    title: "T-Shirts",
    subtitle: "Clean silhouettes. Premium hand-feel.",
    href: "/t-shirts",
    image: "/images/photo-10.jpg",
  },
  {
    title: "Hoodies",
    subtitle: "Heavyweight fits. Minimal branding.",
    href: "/hoodies",
    image: "/images/photo-11.jpg",
  },
  {
    title: "Caps",
    subtitle: "Everyday essential. Built different.",
    href: "/caps",
    image: "/images/caps-5.jpg",
  },
];

export default function CategoriesSection() {
  return (
    <section className="relative bg-white overflow-hidden mb-10">
      {/* Header (centered) */}
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-8"
        >
          <p className="text-xs mb-2 tracking-[0.32em] uppercase text-black/45">
            Categories
          </p>

          <Link
            href="/products"
            className="
              inline-flex items-center justify-center
              rounded-full border border-black/60 bg-white text-black/60
              px-6 md:px-8 py-3 text-xs md:text-sm font-semibold tracking-[0.18em]
              transition hover:-translate-y-0.5 hover:border-[#CE0028] hover:text-[#CE0028]
            "
          >
            EXPLORE ALL
          </Link>
        </motion.div>
      </div>

      {/* FULL WIDTH GRID (no left/right padding) */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {cards.map((c, idx) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              delay: idx * 0.06,
            }}
            className="relative"
          >
            <Link
              href={c.href}
              className="group relative block w-full overflow-hidden bg-black"
            >
              {/* fixed height = 600 desktop */}
              <div className="relative h-[520px] md:h-[600px] w-full">
                {/* IMAGE WRAPPER:
                    - Mobile: zoom on scroll (whileInView)
                    - Desktop: zoom on hover (group-hover via class)
                */}
                <motion.div
                  className="
                    absolute inset-0
                    transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    md:group-hover:scale-[1.08]
                  "
                  // Mobile scroll zoom
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1.06 }}
                  viewport={{ amount: 0.55, once: false }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    priority={idx === 0}
                  />
                </motion.div>

                {/* bottom gradient for readability (keep) */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                {/* text block (animated on scroll) */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-7 right-7 bottom-7 text-white"
                >
                  <h3 className="mt-4 text-3xl md:text-[34px] font-semibold leading-tight">
                    {c.title}
                  </h3>

                  <p className="mt-1.5 text-sm text-white/80 max-w-[26rem]">
                    {c.subtitle}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs tracking-[0.22em] uppercase text-white/75">
                      Shop now
                    </span>

                    <span
                      className="
                        h-[2px] w-10 bg-white/35
                        transition-all duration-500
                        group-hover:w-16
                      "
                    />
                  </div>
                </motion.div>

                {/* accent line reveal */}
                <div
                  className="
                    pointer-events-none absolute left-0 top-0 h-[3px] w-full
                    opacity-0 transition duration-500 group-hover:opacity-100
                  "
                  style={{
                    background: `linear-gradient(90deg, ${BRAND_RED}, transparent)`,
                  }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}



// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function CategoriesSection() {
//   return (
//     <section className="bg-white py-2 md:py-2">
        
//       <div className="mx-auto max-w-6xl px-4">
//         {/* CENTERED TITLE */}{" "}
//         <motion.div
//           initial={{ opacity: 0, y: 14 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.35 }}
//           className="text-center mt-10"
//         >
          
//           <p className="text-xs tracking-[0.32em] uppercase text-black/45">
//             {" "}
//             Categories{" "}
//           </p>{" "}
//           <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
//             {" "}
//             Shop the essentials{" "}
//           </h2>{" "}
//           <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-black/55">
//             {" "}
//             Clean drops. Premium fits. Built around your grind.{" "}
//           </p>{" "}
//         </motion.div>
//         {/* Whole strip */}
//         <div className="grid gap-2 md:grid-cols-3 md:gap-1 py-4 md:py-1 mt-[-5%]">
//           {/* product image */}
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ type: "spring", stiffness: 180, damping: 14 }}
//             className="relative"
//             whileHover={{ y: -8, rotate: -1 }}
//           >
//             <div className="relative mx-auto h-[420px] w-[360px] md:h-[620px] md:w-[420px]">
//               <Image
//                 src="/images/tshirt-category.png"
//                 alt="T-Shirts"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>
//           </motion.div>
//           {/* MIDDLE: Caps (2 rows) */}
//           <div className="flex flex-col items-center justify-center gap-8 md:gap-16">
//             {/* Row 1: Caps image */}
//             <motion.div
//                 initial={{ opacity: 0, y: 14 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ type: "spring", stiffness: 180, damping: 14 }}
//                 className="relative"
//                 whileHover={{ y: -8, rotate: -1 }}
//             >
//               <div className="relative h-[320px] w-[380px] md:h-[260px] md:w-[360px]">
//                 <Image
//                   src="/images/cap-category.png"
//                   alt="Caps"
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//             </motion.div>
//             {/* Row 2: Explore All + BD logo */}
//             <div className="flex flex-col items-center gap-4">
//               <Link
//                 href="/products"
//                 className="
//                         rounded-full border border-black/60 bg-white text-black/60
//                         px-10 py-3 text-sm font-semibold tracking-[0.18em]
//                         transition hover:-translate-y-0.5 hover:border-[#CE0028] hover:text-[#CE0028]
//                         "
//               >
//                 EXPLORE ALL
//               </Link>

//               {/* BD logo */}
//               <Image
//                 src="/images/BD-logo.png"
//                 alt="BD Logo"
//                 width={36}
//                 height={36}
//                 className="opacity-90"
//               />
//             </div>
//           </div>
//           {/* product image */}
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ type: "spring", stiffness: 180, damping: 14 }}
//             className="relative"
//             whileHover={{ y: -8, rotate: -1 }}
//           >
//             <div className="relative mx-auto md:ml-[-12%] h-[420px] w-[360px] md:h-[620px] md:w-[420px]">
//               <Image
//                 src="/images/hoodie-category.png"
//                 alt="Hoodies"
//                 fill
//                 className="object-contain"
//               />
//             </div>
//           </motion.div>
//         </div>
//       </div>
      
//     </section>
//   );
// }
