"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// =====================================================
// HERO SOURCES
// =====================================================

const DESKTOP_IMAGE = "/images/DiwaliOffer-banner-laptop.jpg";
const MOBILE_IMAGE = "/images/DiwaliOffer-banner-mobile.jpg";

const DESKTOP_VIDEO = "/images/video.mp4";
const MOBILE_VIDEO = "/images/video-mobile.mp4";

const MOBILE_QUERY = "(max-width: 767px)";

const SLIDE_DURATION = 20000;

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  const isVideoSlide = activeSlide === 1;

  // =====================================================
  // DETECT SCREEN SIZE
  // =====================================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    const updateScreenSize = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateScreenSize();

    mediaQuery.addEventListener("change", updateScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", updateScreenSize);
    };
  }, []);

  // =====================================================
  // DETECT WHEN HERO IS VISIBLE
  // =====================================================

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(
          entry.isIntersecting && entry.intersectionRatio >= 0.1
        );
      },
      { threshold: [0, 0.1, 0.25] }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  // =====================================================
  // CAROUSEL AUTOPLAY
  // =====================================================

  useEffect(() => {
    if (!isHeroVisible) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current === 0 ? 1 : 0));
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, [isHeroVisible]);

  // =====================================================
  // CAROUSEL NAVIGATION
  // =====================================================

  const goToSlide = useCallback((slide: number) => {
    setActiveSlide(slide);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveSlide((current) => (current === 0 ? 1 : 0));
  }, []);

  const previousSlide = useCallback(() => {
    setActiveSlide((current) => (current === 0 ? 1 : 0));
  }, []);

  // =====================================================
  // LOAD VIDEO ONLY WHEN VIDEO SLIDE IS ACTIVE
  // =====================================================

  useEffect(() => {
    const desktopVideo = desktopVideoRef.current;
    const mobileVideo = mobileVideoRef.current;

    if (!desktopVideo || !mobileVideo) return;

    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    let cancelled = false;
    let activeVideo: HTMLVideoElement | null = null;

    const unloadVideos = () => {
      desktopVideo.pause();
      mobileVideo.pause();

      desktopVideo.removeAttribute("src");
      mobileVideo.removeAttribute("src");

      desktopVideo.load();
      mobileVideo.load();
    };

    const updateVideo = () => {
      if (!isVideoSlide || !isHeroVisible) {
        unloadVideos();
        return;
      }

      const mobile = mediaQuery.matches;

      activeVideo = mobile ? mobileVideo : desktopVideo;

      const inactiveVideo = mobile ? desktopVideo : mobileVideo;

      const activeSource = mobile
        ? MOBILE_VIDEO
        : DESKTOP_VIDEO;

      inactiveVideo.pause();
      inactiveVideo.removeAttribute("src");
      inactiveVideo.load();

      if (activeVideo.getAttribute("src") !== activeSource) {
        activeVideo.pause();
        activeVideo.src = activeSource;
        activeVideo.load();

        setIsVideoReady(false);
        setIsAudioBlocked(false);
      }

      const tryPlayback = async () => {
        if (cancelled || !activeVideo?.isConnected) return;

        try {
          activeVideo.muted = false;
          activeVideo.volume = 1;

          await activeVideo.play();

          if (!cancelled) {
            setIsAudioBlocked(false);
          }
        } catch {
          if (cancelled) return;

          setIsAudioBlocked(true);

          try {
            activeVideo.muted = true;
            await activeVideo.play();
          } catch (error) {
            console.warn("Hero video autoplay was blocked:", error);
          }
        }
      };

      const handleCanPlay = () => {
        if (cancelled) return;

        setIsVideoReady(true);
        void tryPlayback();
      };

      const handleError = () => {
        if (cancelled) return;

        console.error(
          `Hero video failed to load: ${
            activeVideo?.currentSrc || activeVideo?.src
          }`
        );
      };

      activeVideo.removeEventListener("canplay", handleCanPlay);
      activeVideo.removeEventListener("error", handleError);

      activeVideo.addEventListener("canplay", handleCanPlay);
      activeVideo.addEventListener("error", handleError);

      if (
        activeVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
      ) {
        handleCanPlay();
      }
    };

    updateVideo();

    mediaQuery.addEventListener("change", updateVideo);

    return () => {
      cancelled = true;

      mediaQuery.removeEventListener("change", updateVideo);

      desktopVideo.pause();
      mobileVideo.pause();
    };
  }, [isVideoSlide, isHeroVisible]);

  // =====================================================
  // ENABLE VIDEO SOUND
  // =====================================================

  const enableSound = async () => {
    const mobile = window.matchMedia(MOBILE_QUERY).matches;

    const video = mobile
      ? mobileVideoRef.current
      : desktopVideoRef.current;

    if (!video || !isVideoSlide) return;

    try {
      video.muted = false;
      video.volume = 1;

      await video.play();

      setIsAudioBlocked(false);
    } catch (error) {
      console.error("Could not enable hero video sound:", error);
      setIsAudioBlocked(true);
    }
  };

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      desktopVideoRef.current?.pause();
      mobileVideoRef.current?.pause();
    };
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      ref={heroRef}
      aria-roledescription="carousel"
      aria-label="BLTDIF hero carousel"
      className="
        relative isolate w-full overflow-hidden bg-black

        h-[90dvh]
        min-h-[500px]
        max-h-[900px]

        md:h-dvh
        md:min-h-0
        md:max-h-none
      "
    >
      {/* ============================================= */}
      {/* SLIDE 1 — RESPONSIVE IMAGE */}
      {/* ============================================= */}

      <div
        aria-hidden={activeSlide !== 0}
        className={`
          absolute inset-0 transition-opacity duration-1000 ease-in-out
          ${
            activeSlide === 0
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }
        `}
      >
        {/* DESKTOP IMAGE */}

        <Image
          src={DESKTOP_IMAGE}
          alt="BLTDIF collection"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="hidden object-cover object-center md:block"
        />

        {/* MOBILE IMAGE */}

        <Image
          src={MOBILE_IMAGE}
          alt="BLTDIF collection"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="block object-cover object-center md:hidden"
        />
      </div>

      {/* ============================================= */}
      {/* SLIDE 2 — RESPONSIVE VIDEO */}
      {/* ============================================= */}

      <div
        aria-hidden={!isVideoSlide}
        className={`
          absolute inset-0 transition-opacity duration-1000 ease-in-out
          ${
            isVideoSlide
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }
        `}
      >
        {/* DESKTOP VIDEO */}

        <video
          ref={desktopVideoRef}
          playsInline
          loop
          preload="none"
          muted
          controls={false}
          disablePictureInPicture
          aria-label="BLTDIF desktop hero video"
          className="
            absolute inset-0 hidden h-full w-full
            select-none object-cover object-center
            pointer-events-none md:block
          "
        />

        {/* MOBILE VIDEO */}

        <video
          ref={mobileVideoRef}
          playsInline
          loop
          preload="none"
          muted
          controls={false}
          disablePictureInPicture
          aria-label="BLTDIF mobile hero video"
          className="
            absolute inset-0 block h-full w-full
            select-none object-cover object-center
            pointer-events-none md:hidden
          "
        />

        {/* VIDEO LOADING BACKGROUND */}

        {!isVideoReady && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black"
          />
        )}
      </div>

      {/* ============================================= */}
      {/* PREVIOUS BUTTON */}
      {/* ============================================= */}

      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="
          absolute left-4 top-1/2 z-30
          -translate-y-1/2
          flex h-10 w-10 items-center justify-center
          rounded-full border border-white/30
          bg-black/25 text-white backdrop-blur-xl
          transition hover:bg-black/50
          sm:left-6 sm:h-12 sm:w-12
        "
      >
        <ChevronLeft size={23} />
      </button>

      {/* ============================================= */}
      {/* NEXT BUTTON */}
      {/* ============================================= */}

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="
          absolute right-4 top-1/2 z-30
          -translate-y-1/2
          flex h-10 w-10 items-center justify-center
          rounded-full border border-white/30
          bg-black/25 text-white backdrop-blur-xl
          transition hover:bg-black/50
          sm:right-6 sm:h-12 sm:w-12
        "
      >
        <ChevronRight size={23} />
      </button>

      {/* ============================================= */}
      {/* SLIDE INDICATORS */}
      {/* ============================================= */}

      <div
        className="
          absolute bottom-6 left-1/2 z-30
          flex -translate-x-1/2 items-center gap-2
        "
      >
        {[0, 1].map((slide) => (
          <button
            key={slide}
            type="button"
            onClick={() => goToSlide(slide)}
            aria-label={`Go to slide ${slide + 1}`}
            aria-current={activeSlide === slide ? "true" : undefined}
            className={`
              h-1 rounded-full transition-all duration-500
              ${
                activeSlide === slide
                  ? "w-9 bg-white"
                  : "w-4 bg-white/50 hover:bg-white/80"
              }
            `}
          />
        ))}
      </div>

      {/* ============================================= */}
      {/* ENABLE VIDEO SOUND */}
      {/* ============================================= */}

      {isAudioBlocked && isVideoSlide && isHeroVisible && (
        <button
          type="button"
          onClick={enableSound}
          className="
            absolute bottom-5 right-4 z-40
            rounded-full border border-white/30
            bg-black/60 px-4 py-2
            text-xs font-medium text-white
            shadow-lg backdrop-blur-xl
            transition hover:bg-black/80
            sm:bottom-6 sm:right-6
          "
        >
          Enable video sound
        </button>
      )}
    </section>
  );
}