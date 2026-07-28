"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Star,
} from "lucide-react";

type CustomerReview = {
  id: number;
  name: string;
  initials: string;
  image: string;
  alt: string;
  rating: number;
};

type CardPosition =
  | "offLeft"
  | "farLeft"
  | "left"
  | "center"
  | "right"
  | "farRight"
  | "offRight";

type ViewportMode = "mobile" | "tablet" | "desktop";

const reviews: CustomerReview[] = [
  {
    id: 1,
    name: "Vaishnavi Mishra",
    initials: "VM",
    image: "/images/reviews/post1.jpg",
    alt: "Vaishnavi Mishra wearing a BLTDIF T-shirt and cap",
    rating: 5,
  },
  {
    id: 2,
    name: "Aarav Mehta",
    initials: "AM",
    image: "/images/reviews/post2.jpg",
    alt: "Aarav Mehta reviewing BLTDIF caps",
    rating: 5,
  },
  {
    id: 3,
    name: "Janaki Deo",
    initials: "JD",
    image: "/images/reviews/post3.jpg",
    alt: "Janaki Deo wearing a BLTDIF T-shirt",
    rating: 5,
  },
  {
    id: 4,
    name: "Priya Desai",
    initials: "PD",
    image: "/images/reviews/post4.jpg",
    alt: "Priya Desai reviewing BLTDIF premium packaging",
    rating: 5,
  },
  {
    id: 5,
    name: "Atharva Gokhale",
    initials: "AG",
    image: "/images/reviews/post5.jpg",
    alt: "Atharva Gokhale reviewing BLTDIF products",
    rating: 5,
  },
  {
    id: 6,
    name: "Dev Shah",
    initials: "DS",
    image: "/images/reviews/post6.jpg",
    alt: "Dev Shah reviewing a BLTDIF oversized T-shirt and cap",
    rating: 5,
  },
  {
    id: 7,
    name: "Parthesh Pendharkar",
    initials: "PP",
    image: "/images/reviews/post7.jpg",
    alt: "Parthesh Pendharkar wearing a BLTDIF T-shirt",
    rating: 5,
  },
  {
    id: 8,
    name: "Rithy Riju",
    initials: "RR",
    image: "/images/reviews/post8.jpg",
    alt: "Rithy Riju wearing an oversized BLTDIF T-shirt",
    rating: 5,
  },
  {
    id: 9,
    name: "Sanika Pawar",
    initials: "SP",
    image: "/images/reviews/post9.jpg",
    alt: "Sanika Pawar reviewing a BLTDIF cap and premium packaging",
    rating: 5,
  },
  {
    id: 10,
    name: "Sonal S",
    initials: "SS",
    image: "/images/reviews/post10.jpg",
    alt: "Sonal reviewing BLTDIF apparel and caps",
    rating: 5,
  },
  {
    id: 11,
    name: "Sayali Gite",
    initials: "SG",
    image: "/images/reviews/post11.jpg",
    alt: "Sayali Gite wearing a BLTDIF T-shirt",
    rating: 5,
  },
  {
    id: 12,
    name: "Shital E",
    initials: "SE",
    image: "/images/reviews/post12.jpg",
    alt: "Shital reviewing a BLTDIF cap",
    rating: 5,
  },
  {
    id: 13,
    name: "Kavya Nair",
    initials: "KN",
    image: "/images/reviews/post13.jpg",
    alt: "Kavya Nair reviewing an embroidered BLTDIF cap",
    rating: 5,
  },
  {
    id: 14,
    name: "Aniket S",
    initials: "AS",
    image: "/images/reviews/post14.jpg",
    alt: "Aniket reviewing BLTDIF caps",
    rating: 5,
  },
  {
    id: 15,
    name: "Amruta Kulkarni",
    initials: "AK",
    image: "/images/reviews/post15.jpg",
    alt: "Amruta Kulkarni wearing BLTDIF apparel",
    rating: 5,
  },
  {
    id: 16,
    name: "Atul Mankar",
    initials: "AM",
    image: "/images/reviews/post16.jpg",
    alt: "Atul Mankar wearing a BLTDIF T-shirt",
    rating: 5,
  },
];

/*
 * Desktop: five visible cards.
 *
 * Every visible card has:
 * - scale 1
 * - opacity 1
 * - the same z-index
 */
const desktopCardVariants = {
  offLeft: {
    x: "-330%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  farLeft: {
    x: "-208%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  left: {
    x: "-104%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  center: {
    x: "0%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  right: {
    x: "104%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  farRight: {
    x: "208%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  offRight: {
    x: "330%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
};

/*
 * Tablet: three visible cards.
 */
const tabletCardVariants = {
  offLeft: {
    x: "-225%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  farLeft: {
    x: "-215%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  left: {
    x: "-104%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  center: {
    x: "0%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  right: {
    x: "104%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  farRight: {
    x: "215%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  offRight: {
    x: "225%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
};

/*
 * Mobile: one visible card.
 */
const mobileCardVariants = {
  offLeft: {
    x: "-135%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  farLeft: {
    x: "-135%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  left: {
    x: "-135%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  center: {
    x: "0%",
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  right: {
    x: "135%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  farRight: {
    x: "135%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
  offRight: {
    x: "135%",
    scale: 1,
    opacity: 0,
    zIndex: 0,
  },
};

function Rating({
  rating,
  small = false,
}: {
  rating: number;
  small?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          strokeWidth={1.7}
          className={`${small ? "h-3.5 w-3.5" : "h-4 w-4"} ${
            index < rating
              ? "fill-[#CE0028] text-[#CE0028]"
              : "text-black/15"
          }`}
        />
      ))}
    </div>
  );
}

function getCircularDifference(
  reviewIndex: number,
  activeIndex: number,
) {
  const total = reviews.length;

  let difference =
    (reviewIndex - activeIndex + total) % total;

  if (difference > total / 2) {
    difference -= total;
  }

  return difference;
}

function getCardPosition(
  reviewIndex: number,
  activeIndex: number,
): CardPosition {
  const difference = getCircularDifference(
    reviewIndex,
    activeIndex,
  );

  if (difference <= -3) return "offLeft";
  if (difference === -2) return "farLeft";
  if (difference === -1) return "left";
  if (difference === 0) return "center";
  if (difference === 1) return "right";
  if (difference === 2) return "farRight";

  return "offRight";
}

function getCardVariants(
  viewportMode: ViewportMode,
) {
  if (viewportMode === "desktop") {
    return desktopCardVariants;
  }

  if (viewportMode === "tablet") {
    return tabletCardVariants;
  }

  return mobileCardVariants;
}

function isCardHidden(
  position: CardPosition,
  viewportMode: ViewportMode,
) {
  if (viewportMode === "desktop") {
    return (
      position === "offLeft" ||
      position === "offRight"
    );
  }

  if (viewportMode === "tablet") {
    return !["left", "center", "right"].includes(
      position,
    );
  }

  return position !== "center";
}

function ReviewCard({
  review,
  position,
  viewportMode,
}: {
  review: CustomerReview;
  position: CardPosition;
  viewportMode: ViewportMode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      layout={false}
      variants={getCardVariants(viewportMode)}
      animate={position}
      initial={false}
      transition={
        reduceMotion
          ? {
              duration: 0,
            }
          : {
              x: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              },
              scale: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.3,
                ease: "easeOut",
              },
            }
      }
      aria-hidden={isCardHidden(
        position,
        viewportMode,
      )}
      className="
        absolute
        left-1/2
        top-1/2
        w-[calc(100vw-44px)]
        -translate-x-1/2
        -translate-y-1/2
        overflow-hidden
        rounded-[18px]
        border
        border-black/[0.08]
        bg-white
        will-change-transform
        sm:w-[31vw]
        lg:w-[18.5vw]
        lg:rounded-[20px]
      "
    >
      <Image
        src={review.image}
        alt={review.alt}
        width={1080}
        height={1350}
        priority={review.id <= 5}
        quality={90}
        sizes="
          (max-width: 639px) calc(100vw - 44px),
          (max-width: 1023px) 31vw,
          18.5vw
        "
        className="block h-auto w-full"
      />

      <figcaption className="sr-only">
        Customer review by {review.name}
      </figcaption>
    </motion.figure>
  );
}

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [viewportMode, setViewportMode] =
    useState<ViewportMode>("mobile");

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const tabletQuery = window.matchMedia(
      "(min-width: 640px)",
    );

    const desktopQuery = window.matchMedia(
      "(min-width: 1024px)",
    );

    const updateViewportMode = () => {
      if (desktopQuery.matches) {
        setViewportMode("desktop");
        return;
      }

      if (tabletQuery.matches) {
        setViewportMode("tablet");
        return;
      }

      setViewportMode("mobile");
    };

    updateViewportMode();

    tabletQuery.addEventListener(
      "change",
      updateViewportMode,
    );

    desktopQuery.addEventListener(
      "change",
      updateViewportMode,
    );

    return () => {
      tabletQuery.removeEventListener(
        "change",
        updateViewportMode,
      );

      desktopQuery.removeEventListener(
        "change",
        updateViewportMode,
      );
    };
  }, []);

  const previousReview = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current - 1 + reviews.length) %
        reviews.length,
    );
  }, []);

  const nextReview = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current + 1) % reviews.length,
    );
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) {
      return;
    }

    const timer = window.setInterval(
      nextReview,
      5000,
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, nextReview, reduceMotion]);

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;

    setIsPaused(true);
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const touch = event.changedTouches[0];

    if (
      !touch ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      setIsPaused(false);
      return;
    }

    const horizontalDifference =
      touchStartX.current - touch.clientX;

    const verticalDifference =
      touchStartY.current - touch.clientY;

    const isHorizontalSwipe =
      Math.abs(horizontalDifference) >
      Math.abs(verticalDifference);

    if (
      isHorizontalSwipe &&
      Math.abs(horizontalDifference) > 45
    ) {
      if (horizontalDifference > 0) {
        nextReview();
      } else {
        previousReview();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;

    setIsPaused(false);
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;

    setIsPaused(false);
  };

  const activeReview = reviews[activeIndex];

  return (
    <section
      id="reviews"
      aria-labelledby="customer-reviews-title"
      className="w-full mt-2 overflow-hidden bg-white py-6 sm:py-8 lg:py-10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-[70%]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CE0028]">
              Customer stories
            </p>

            <h2
              id="customer-reviews-title"
              className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-black sm:text-5xl lg:text-[56px] lg:leading-[1.05] xl:text-[64px]"
            >
              What {" "}
              <span className="text-[#CE0028]">
                BLTDIF
              </span>

              <span className="block text-black/35">
                community is saying!
              </span>
            </h2>

            {/* <p className="mt-2 max-w-3xl text-base leading-7 text-black/50 sm:text-lg">
              Real fits, real stories and honest experiences
              from customers who wear BLTDIF.
            </p> */}
          </div>

        {/* <div className="flex w-full items-center gap-4 lg:w-auto lg:justify-end">
            <div className="flex -space-x-3">
              {reviews
                .slice(0, 4)
                .map((review, index) => (
                  <div
                    key={review.id}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold ${
                      index === 0
                        ? "bg-black text-white"
                        : index === 1
                          ? "bg-[#CE0028] text-white"
                          : "bg-[#F0F0EE] text-black"
                    }`}
                  >
                    {review.initials}
                  </div>
                ))}
            </div>

            <div className="h-9 w-px bg-black/10" />

            <div>
              <div className="flex items-center gap-2">
                <Rating rating={5} />

                <span className="text-sm font-semibold text-black">
                  5.0
                </span>
              </div>

              <p className="mt-1 text-xs text-black/40">
                Verified customer reviews
              </p>
            </div>
          </div> */}
        </div>
      </div>

      <div
        className="
          relative
          mt-3
          h-[435px]
          w-full
          touch-pan-y
          sm:mt-5
          sm:h-[410px]
          md:h-[380px]
          lg:mt-1
          lg:h-[450px]
          xl:h-[480px]
          2xl:h-[550px]
          3xl:h-[620]
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div className="relative h-full w-full overflow-hidden">
          {reviews.map((review, index) => {
            const position = getCardPosition(
              index,
              activeIndex,
            );

            return (
              <ReviewCard
                key={review.id}
                review={review}
                position={position}
                viewportMode={viewportMode}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={previousReview}
          aria-label="View previous customer review"
          className="
            absolute
            left-2
            top-1/2
            z-20
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-black/10
            bg-white
            text-black
            transition
            duration-300
            hover:bg-black
            hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#CE0028]
            sm:left-4
            sm:h-11
            sm:w-11
            lg:left-6
            xl:left-8
          "
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </button>

        <button
          type="button"
          onClick={nextReview}
          aria-label="View next customer review"
          className="
            absolute
            right-2
            top-1/2
            z-20
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-[#CE0028]
            text-white
            transition
            duration-300
            hover:bg-black
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#CE0028]
            sm:right-4
            sm:h-11
            sm:w-11
            lg:right-6
            xl:right-8
          "
        >
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="mt-1 flex w-full flex-col items-center justify-between gap-3 px-4 sm:mt-2 sm:flex-row sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex max-w-full items-center gap-3">
          <p
            className="shrink-0 text-xs font-medium text-black/45"
            aria-live="polite"
          >
            {activeIndex + 1} / {reviews.length}
          </p>

          <div className="flex max-w-[250px] items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-none">
            {reviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View review from ${review.name}`}
                aria-current={
                  index === activeIndex
                    ? "true"
                    : undefined
                }
                className="flex h-8 shrink-0 items-center justify-center"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-7 bg-[#CE0028]"
                      : "w-2 bg-black/15 hover:bg-black/35"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="flex items-center gap-2 text-center text-sm text-black/45 sm:text-right">
            <BadgeCheck
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#CE0028]"
              strokeWidth={2}
            />

            Reviews collected after successful delivery
          </p>

          <div className="flex items-center gap-2 text-xs text-black/35">
            <span>{activeReview.name}</span>

            <span aria-hidden="true">•</span>

            <Rating
              rating={activeReview.rating}
              small
            />
          </div>
        </div> */}
      </div>
    </section>
  );
}