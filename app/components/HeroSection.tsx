"use client";

import { useEffect, useRef, useState } from "react";

// =====================================================
// HERO VIDEO SOURCES
// =====================================================

const DESKTOP_VIDEO = "/images/video.mp4";
const MOBILE_VIDEO = "/images/video-mobile.mp4";
const MOBILE_QUERY = "(max-width: 767px)";

export default function HeroSection() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  // =====================================================
  // DETECT WHEN THE HERO IS VISIBLE
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
  // LOAD ONLY THE VIDEO FOR THE CURRENT SCREEN SIZE
  // =====================================================

  useEffect(() => {
    const desktopVideo = desktopVideoRef.current;
    const mobileVideo = mobileVideoRef.current;

    if (!desktopVideo || !mobileVideo) return;

    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    let cancelled = false;

    const updateVideo = () => {
      const isMobile = mediaQuery.matches;

      const activeVideo = isMobile ? mobileVideo : desktopVideo;
      const inactiveVideo = isMobile ? desktopVideo : mobileVideo;
      const activeSource = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;

      // Stop and unload the video that doesn't match the viewport.
      inactiveVideo.pause();
      inactiveVideo.removeAttribute("src");
      inactiveVideo.load();

      // Load the correct video only when needed.
      if (activeVideo.getAttribute("src") !== activeSource) {
        activeVideo.pause();
        activeVideo.src = activeSource;
        activeVideo.load();
        setIsVideoReady(false);
        setIsAudioBlocked(false);
      }

      // Don't play the video while the hero is offscreen.
      if (!isHeroVisible) {
        activeVideo.pause();
        return;
      }

      const tryPlayback = async () => {
        if (cancelled || !activeVideo.isConnected) return;

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
            activeVideo.currentSrc || activeVideo.src
          }`
        );
      };

      // Avoid attaching duplicate listeners.
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

    // Handle resizing or rotating the device.
    mediaQuery.addEventListener("change", updateVideo);

    return () => {
      cancelled = true;
      mediaQuery.removeEventListener("change", updateVideo);

      desktopVideo.pause();
      mobileVideo.pause();
    };
  }, [isHeroVisible]);

  // =====================================================
  // ENABLE VIDEO SOUND AFTER USER INTERACTION
  // =====================================================

  const enableSound = async () => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;

    const video = isMobile
      ? mobileVideoRef.current
      : desktopVideoRef.current;

    if (!video) return;

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

  return (
    <section
      ref={heroRef}
      className="
        relative w-full overflow-hidden bg-black

        h-[80dvh]
        min-h-[500px]
        max-h-[900px]

        md:h-dvh
        md:min-h-0
        md:max-h-none
      "
    >
      {/* DESKTOP VIDEO — FULL VIEWPORT HEIGHT */}

      <video
        ref={desktopVideoRef}
        autoPlay
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

      {/* MOBILE VIDEO — 80% VIEWPORT HEIGHT */}

      <video
        ref={mobileVideoRef}
        autoPlay
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

      {/* LOADING BACKGROUND */}

      {!isVideoReady && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black"
        />
      )}

      {/* ENABLE SOUND */}

      {isAudioBlocked && isHeroVisible && (
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

      {/* IMAGE CAROUSEL — RESERVED FOR FUTURE USE */}

      {/*
        Keep your previous carousel implementation here
        if you want to restore it in the future.
      */}
    </section>
  );
}