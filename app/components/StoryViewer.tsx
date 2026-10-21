"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Story = {
  id: string | number;
  image: string;
  alt?: string;
};

type StoryViewerProps = {
  stories: Story[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
};

const STORY_DURATION = 5000;
const STORY_ASPECT_RATIO = 9 / 16;

export default function StoryViewer({
  stories,
  open,
  onClose,
  initialIndex = 0,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(stories.length - 1, 0))
  );

  const activeProgressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const currentIndexRef = useRef(currentIndex);
  const onCloseRef = useRef(onClose);

  const safeIndex = Math.min(
    Math.max(currentIndex, 0),
    Math.max(stories.length - 1, 0)
  );

  const currentStory = stories[safeIndex];

  // Keep event handlers up to date without restarting the timer unnecessarily.
  useEffect(() => {
    currentIndexRef.current = safeIndex;
  }, [safeIndex]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const goToNext = useCallback(() => {
    const index = currentIndexRef.current;

    if (index >= stories.length - 1) {
      onCloseRef.current();
      return;
    }

    setCurrentIndex(index + 1);
  }, [stories.length]);

  const goToPrevious = useCallback(() => {
    const index = currentIndexRef.current;

    if (index <= 0) return;

    setCurrentIndex(index - 1);
  }, []);

  // Reset the selected story whenever the viewer opens.
  useEffect(() => {
    if (!open || stories.length === 0) return;

    const index = Math.min(
      Math.max(initialIndex, 0),
      stories.length - 1
    );

    currentIndexRef.current = index;
    setCurrentIndex(index);
  }, [open, initialIndex, stories.length]);

  // Animate progress directly in the browser.
  // This avoids React state updates on every animation frame.
  useEffect(() => {
    if (!open || !currentStory) return;

    const progressElement = activeProgressRef.current;
    if (!progressElement) return;

    let finished = false;

    const animation = progressElement.animate(
      [
        { transform: "scaleX(0)" },
        { transform: "scaleX(1)" },
      ],
      {
        duration: STORY_DURATION,
        easing: "linear",
        fill: "forwards",
      }
    );

    animationRef.current = animation;

    animation.onfinish = () => {
      if (finished) return;
      finished = true;
      goToNext();
    };

    return () => {
      finished = true;
      animation.onfinish = null;
      animation.cancel();

      if (animationRef.current === animation) {
        animationRef.current = null;
      }
    };
  }, [open, safeIndex, currentStory?.id, currentStory?.image, goToNext]);

  // Preload only the next story instead of every story image.
  useEffect(() => {
    if (!open || !stories.length) return;

    const nextStory = stories[safeIndex + 1];
    if (!nextStory?.image) return;

    const image = new Image();
    image.decoding = "async";
    image.src = nextStory.image;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [open, safeIndex, stories]);

  // Keyboard navigation and page scroll lock.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, goToNext, goToPrevious]);

  if (!open || !currentStory) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="BLTDIF Stories"
      onClick={onClose}
    >
      {/* PROGRESS BAR */}
      <div
        className="absolute left-0 right-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex w-full max-w-[677px] gap-1.5">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                ref={index === safeIndex ? activeProgressRef : undefined}
                className="absolute inset-0 rounded-full bg-white"
                style={{
                  transformOrigin: "left center",
                  transform:
                    index < safeIndex
                      ? "scaleX(1)"
                      : index === safeIndex
                        ? "scaleX(0)"
                        : "scaleX(0)",
                }}
              />
            </div>
          ))}
        </div>

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close stories"
          className="absolute right-3 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-white/20 sm:right-5"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      {/* PREVIOUS BUTTON */}
      {safeIndex > 0 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goToPrevious();
          }}
          aria-label="Previous story"
          className="absolute left-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-white/20 sm:left-6 lg:left-10"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
        </button>
      )}

      {/* NEXT BUTTON */}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          goToNext();
        }}
        aria-label="Next story"
        className="absolute right-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-white/20 sm:right-6 lg:right-10"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={1.8} />
      </button>

      {/* STORY FRAME */}
      <div
        className="
          relative flex h-[100dvh] w-auto max-h-[100dvh] max-w-[100vw]
          items-center justify-center overflow-hidden rounded-none
          sm:h-[min(86dvh,850px)] sm:max-h-[86dvh]
          sm:max-w-[calc(100vw-160px)] sm:rounded-2xl
          lg:rounded-3xl
        "
        style={{ aspectRatio: STORY_ASPECT_RATIO }}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          key={currentStory.id}
          src={currentStory.image}
          alt={currentStory.alt ?? "BLTDIF story"}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className="block h-full w-full select-none object-cover"
        />

        {/* LEFT CLICK AREA */}
        <button
          type="button"
          aria-label="Previous story"
          onClick={goToPrevious}
          className="absolute inset-y-0 left-0 z-20 w-[30%] cursor-pointer"
        />

        {/* RIGHT CLICK AREA */}
        <button
          type="button"
          aria-label="Next story"
          onClick={goToNext}
          className="absolute inset-y-0 right-0 z-20 w-[30%] cursor-pointer"
        />
      </div>
    </div>
  );
}