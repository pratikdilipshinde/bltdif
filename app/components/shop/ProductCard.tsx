"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { CatalogProduct } from "../../lib/shop-v2";
import { formatPrice } from "../../lib/shop-v2/formatPrice";
import { getProductBadges } from "@/app/lib/shop-v2/product-badges";

const BRAND_RED = "#CE0028";

type ProductWithHoverImage = CatalogProduct & {
  hover_image?: string | null;
  images?: string[];
};

export default function ProductCard({
  product,
}: {
  product: CatalogProduct;
}) {
  const item = product as ProductWithHoverImage;

  const badges = getProductBadges(product);

  const isOut = !product.availability;
  console.log("Product Info:");
  console.log(product);

  const price =
    product.default_variant?.price ?? product.base_price;

  const compareAtPrice =
    product.default_variant?.compare_at_price ??
    product.compare_at_price;

  const hasDiscount =
    compareAtPrice != null && compareAtPrice > price;

  /*
   * Use the dedicated hover image if your API provides one.
   *
   * Otherwise, if your product has an images[] array,
   * use the second image.
   */
  const hoverImage =
    //item.hover_image ??
    item.images[1].image_url 
    //product.image
    //console.log("Images Array:");
    //console.log(item.images);
    ;

  const isLimitedEdition =
    product.is_new_arrival && !isOut;

  /*
   * Calculate discount percentage.
   *
   * Example:
   * ₹1899 -> ₹1599
   * = 15.8% -> 16% OFF
   */
  const discountPercentage =
    hasDiscount && compareAtPrice
      ? Math.round(
          ((compareAtPrice - price) / compareAtPrice) * 100
        )
      : null;

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    /*
     * Important:
     * Prevent the parent <Link> from opening
     * the product details page.
     */
    event.preventDefault();
    event.stopPropagation();

    /*
     * Connect your existing CartContext here.
     *
     * Example:
     *
     * addToCart(product.default_variant?.id)
     */
    
    //console.log("Add to cart:", product.slug);
  };

  console.log("Limited edition debug:", {
    name: product.name,
    is_limited_edition: product.is_limited_edition,
    isOut,
    isLimitedEdition,
  });

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <motion.article
        initial={{
          opacity: 0,
          y: 12,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          margin: "0px 0px -40px 0px",
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="relative"
      >
        {/* =====================================================
            IMAGE AREA
        ====================================================== */}

        <div
          className="
            relative
            aspect-[4/5]
            w-full
            overflow-hidden
            rounded-[16px]
            border
            border-black/[0.06]
            bg-[#f4f3f4]
            transition-all
            duration-300
            ease-out

            group-hover:-translate-y-1
            group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
          "
        >
          {/* ===================================================
              PRIMARY IMAGE
          ==================================================== */}

          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={false}
            sizes="
              (min-width: 1280px) 30vw,
              (min-width: 1024px) 31vw,
              (min-width: 640px) 46vw,
              100vw
            "
            className="
              absolute
              inset-0
              object-cover
              object-center
              transition-opacity
              duration-500
              ease-out

              opacity-100
              group-hover:opacity-0
            "
          />

          {/* ===================================================
              HOVER IMAGE
          ==================================================== */}

          <Image
            src={hoverImage}
            alt={`${product.name} alternate view`}
            fill
            priority={false}
            sizes="
              (min-width: 1280px) 30vw,
              (min-width: 1024px) 31vw,
              (min-width: 640px) 46vw,
              100vw
            "
            className="
              absolute
              inset-0
              object-cover
              object-center
              opacity-0
              transition-opacity
              duration-500
              ease-out

              group-hover:opacity-100
            "
          />

          
          {/* <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {badges.hasDiscount && (
              <span className="rounded-md bg-[#CE0028] px-2.5 py-1 text-xs font-semibold text-white">
                {badges.discountPercentage}% OFF
              </span>
            )}

            {badges.isLimitedEdition && (
              <span className="rounded-md bg-[#263B59] px-2.5 py-1 text-xs font-semibold text-white">
                LIMITED EDITION
              </span>
            )}
          </div> */}

          {/* ===================================================
              LIMITED EDITION
          ==================================================== */}

          {badges.isLimitedEdition && (
            <div
              className="
                absolute
                right-5
                top-0
                z-20

                flex
                h-[110px]
                w-[27px]

                items-center
                justify-center

                overflow-hidden

                rounded-b-[5px]

                bg-[#CE0028]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.03em]
                  text-white
                "
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(360deg)",
                }}
              >
                LIMITED EDITION
              </span>
            </div>
          )}

          {/* ===================================================
              DISCOUNT BADGE
          ==================================================== */}

          {badges.hasDiscount && (
            <div
              className="
                absolute
                right-[50px]
                top-0
                z-20

                flex
                h-[70px]
                w-[27px]

                items-center
                justify-center
                rounded-b-[5px]

                overflow-hidden

                bg-[#CE0028]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.03em]
                  text-white
                "
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(360deg)",
                }}
              >
                {badges.discountPercentage}% OFF
              </span>
            </div>
          )}

          {/* ===================================================
              ADD TO CART
          ==================================================== */}

          {/* {!isOut && (
            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                right-0
                z-30
                px-5
                pb-4
                opacity-0
                translate-y-3
                transition-all
                duration-400
                ease-out
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <button
                type="button"
                onClick={handleAddToCart}
                className="
                  liquid-button group/button relative
                  pointer-events-auto
                  flex h-[58px] w-full
                  items-center justify-center
                  overflow-hidden rounded-2xl
                  border border-white/40
                  bg-white/15
                  text-[13px] font-semibold uppercase
                  tracking-[-0.01em] text-black
                  shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.55)]
                  backdrop-blur-none
                  backdrop-saturate-150
                  transition-all duration-500 ease-out
                  hover:bg-white/25
                  hover:border-white/60
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.7)]
                  hover:-translate-y-[1px]
                  active:translate-y-0
                  active:scale-[0.98]
                  cursor-pointer
                "
              >
                <span
                  className="
                    pointer-events-none absolute inset-x-2 top-0 h-px
                    bg-gradient-to-r from-transparent via-white/80 to-transparent
                    opacity-80
                  "
                />

                <span
                  className="
                    pointer-events-none absolute -top-1/2 left-1/4
                    h-full w-1/2 rounded-2xl
                    bg-white/20 blur-xl
                    transition-transform duration-700
                    group-hover/button:translate-x-1/2
                  "
                />

                <span
                  className="
                    pointer-events-none absolute inset-x-3 bottom-0 h-px
                    bg-gradient-to-r from-transparent via-white/30 to-transparent
                  "
                />

                <span className="relative z-10">
                  ADD TO CART
                </span>
              </button>
            </div>
          )} */}



          {/* ===================================================
              OUT OF STOCK
          ==================================================== */}

          {isOut && (
            <div
              className="
                absolute
                inset-0
                z-30

                flex
                items-center
                justify-center

                bg-white/45

                backdrop-blur-[2px]
              "
            >
              <span
                className="
                  rounded-full
                  border
                  border-black/10
                  bg-white/90

                  px-4
                  py-2

                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.16em]

                  text-black/70
                  shadow-sm
                "
              >
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            PRODUCT INFORMATION
        ====================================================== */}

        <div
          className="
            group/info relative isolate
            mt-[10px] min-h-[74px]
            overflow-hidden rounded-[15px]
            border border-white/60
            bg-white/[0.38]
            px-[13px] py-[12px]

            backdrop-blur-xl backdrop-saturate-150

            shadow-[0_4px_16px_rgba(30,50,65,0.06),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.25)]

            transition-all duration-300 ease-out
            group-hover:-translate-y-0.5
            group-hover:bg-white/[0.46]
          "
        >
          {/* Soft, natural glass reflection */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 -z-10
              rounded-[inherit]
              bg-gradient-to-br
              from-white/65 via-white/10 to-sky-100/20
            "
          />

          {/* Curved highlight along the top edge */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              inset-x-[8%] top-0 h-[1px]
              rounded-full
              bg-gradient-to-r
              from-transparent via-white to-transparent
              opacity-90
            "
          />

          {/* Subtle refracted light near the edge */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              rounded-[inherit]
              ring-1 ring-inset ring-white/20
            "
          />

          {/* NAME + PRICE */}
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="
                  truncate text-[16px]
                  font-semibold leading-[1.15]
                  tracking-[-0.02em] text-black
                "
              >
                {product.name}
              </h3>
            </div>

            <div className="shrink-0 text-right">
              <p
                className="
                  text-[17px] font-semibold
                  leading-none tracking-[-0.02em]
                  text-black
                "
              >
                {formatPrice(price, product.currency_code)}
              </p>

              {hasDiscount && (
                <p
                  className="
                    mt-1 text-[10px] leading-none
                    text-black/40 line-through
                  "
                >
                  {formatPrice(compareAtPrice, product.currency_code)}
                </p>
              )}
            </div>
          </div>

          {/* PRODUCT TYPE */}
          <p
            className="
              relative mt-[6px] truncate
              text-[10px] font-normal leading-none
              tracking-[0.01em] text-black/60
            "
          >
            {product.product_type ?? product.category_name}
          </p>
        </div>

      </motion.article>
    </Link>
  );
}