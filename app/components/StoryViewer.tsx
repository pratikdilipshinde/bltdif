
"use client";

import { useEffect, useRef, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!open || stories.length === 0) return;

    setCurrentIndex(
      Math.min(Math.max(initialIndex, 0), stories.length - 1)
    );
    setProgress(0);
  }, [open, initialIndex, stories.length]);

  const goToNext = () => {
    if (currentIndex >= stories.length - 1) {
      onClose();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setProgress(0);
  };

  const goToPrevious = () => {
    if (currentIndex <= 0) {
      setProgress(0);
      return;
    }

    setCurrentIndex((prev) => prev - 1);
    setProgress(0);
  };

  useEffect(() => {
    if (!open || !currentStory) return;

    startTimeRef.current = performance.now();
    setProgress(0);

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const nextProgress = Math.min(elapsed / STORY_DURATION, 1);

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        goToNext();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = null;
      startTimeRef.current = null;
    };
  }, [open, currentIndex, currentStory]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goToNext();
      if (event.key === "ArrowLeft") goToPrevious();
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, currentIndex, stories.length]);

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
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index === currentIndex
                      ? `${progress * 100}%`
                      : "0%",
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
          className="absolute right-3 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-5"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      {/* PREVIOUS BUTTON */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goToPrevious();
          }}
          aria-label="Previous story"
          className="absolute left-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 lg:left-10"
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
        className="absolute right-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6 lg:right-10"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={1.8} />
      </button>

      {/* STORY FRAME */}
      <div
        className="
          relative
          flex
          h-[100dvh]
          w-auto
          max-h-[100dvh]
          max-w-[100vw]
          items-center
          justify-center
          overflow-hidden
          rounded-none
          sm:h-[min(86dvh,850px)]
          sm:max-h-[86dvh]
          sm:max-w-[calc(100vw-160px)]
          sm:rounded-2xl
          lg:rounded-3xl
        "
        style={{
          aspectRatio: STORY_ASPECT_RATIO,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          key={currentStory.id}
          src={currentStory.image}
          alt={currentStory.alt ?? "BLTDIF story"}
          className="block h-full w-full select-none object-cover"
          draggable={false}
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