"use client";

import { useState, useRef, useEffect } from "react";

export default function InstagramShowcase() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // 3 authentic Instagram Reels downloaded directly from GoCocoon
  const reelsList = [
    {
      id: "ruby-bow",
      title: "Ruby Red Bow Keyring",
      subtitle: "Handcrafted with 100% organic milk cotton",
      duration: "0:10",
      videoUrl: "/reels/reel-ruby-bow.mp4",
      poster: "/ruby-bow-post.jpg",
      link: "https://www.instagram.com/reel/Dd0V_kfygu-/",
      badge: "KEYCHAIN MAKING",
      price: "Rs. 199",
    },
    {
      id: "sunflower-bag",
      title: "Sunflower Baguette Bag",
      subtitle: "Dense double-crochet stitches petal-by-petal",
      duration: "0:14",
      videoUrl: "/reels/reel-sunflower-bag.mp4",
      poster: "/products/items/sunflower-baguette-shoulder-bag.jpg",
      link: "https://www.instagram.com/reel/Dd-hMLvSdQa/",
      badge: "BAG ATELIER",
      price: "Rs. 1,199",
    },
    {
      id: "rose-tie",
      title: "Handmade Rose Bloom Tie",
      subtitle: "Soft ruffled blooms gentle on hair strands",
      duration: "0:11",
      videoUrl: "/reels/reel-rose-tie.mp4",
      poster: "/products/items/rose-ponytail-tie-pink.jpg",
      link: "https://www.instagram.com/reel/Dd5WQmFSn7C/",
      badge: "HAIR ACCENT",
      price: "Rs. 249",
    },
  ];

  const currentReel = reelsList[activeReelIndex];

  // Auto-switch reels every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReelIndex((prev) => (prev + 1) % reelsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reelsList.length]);

  // Video playback lifecycle
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [activeReelIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Spotlight cards on the right of the featured reel (with clean SVGs instead of emojis)
  const spotlightCards = [
    {
      id: "details",
      title: "Details Matter",
      badge: "DETAILS MATTER",
      imgUrl: "/products/items/white-rose-twin-buds-charm-hand.jpg",
      link: "https://www.instagram.com/p/Dd-hD66kmfv/?utm_source=ig_web_copy_link",
      reelIndex: 1,
    },
    {
      id: "style",
      title: "Style It Your Way",
      badge: "STYLE IT YOUR WAY",
      imgUrl: "/products/items/sunflower-crossbody-tote.jpg",
      link: "https://www.instagram.com/p/Dd5dKRUS7rW/?utm_source=ig_web_copy_link",
      reelIndex: 1,
    },
    {
      id: "shop",
      title: "Shop This Piece",
      badge: "SHOP THIS PIECE",
      imgUrl: "/products/items/blush-pink-floral-case.jpg",
      link: "https://www.instagram.com/reel/Dd5WQmFSn7C/?utm_source=ig_web_copy_link",
      reelIndex: 2,
    },
    {
      id: "bow",
      title: "Heirloom Charms",
      badge: "HEIRLOOM CHARM",
      imgUrl: "/ruby-bow-post.jpg",
      link: "https://www.instagram.com/reel/Dd0V_kfygu-/?utm_source=ig_web_copy_link",
      reelIndex: 0,
    },
    {
      id: "scrunchie",
      title: "Soft Ruffles",
      badge: "ORGANIC COTTON",
      imgUrl: "/products/items/candy-festive-crochet-scrunchie.jpg",
      link: "https://www.instagram.com/p/Dd5dKRUS7rW/?utm_source=ig_web_copy_link",
      reelIndex: 2,
    },
    {
      id: "phone",
      title: "Granny Sleeve",
      badge: "PHONE SLEEVE",
      imgUrl: "/products/items/sage-granny-phone-case.jpg",
      link: "https://www.instagram.com/p/Dd0V3GRS6C9/?utm_source=ig_web_copy_link",
      reelIndex: 0,
    },
  ];

  const handleNextSlide = (e) => {
    e?.stopPropagation?.();
    setActiveSlideIndex((prev) => (prev + 1) % spotlightCards.length);
  };

  const handlePrevSlide = (e) => {
    e?.stopPropagation?.();
    setActiveSlideIndex((prev) => (prev - 1 + spotlightCards.length) % spotlightCards.length);
  };

  // Derive visible cards based on activeSlideIndex
  const visibleSpotlightCards = [
    spotlightCards[activeSlideIndex % spotlightCards.length],
    spotlightCards[(activeSlideIndex + 1) % spotlightCards.length],
    spotlightCards[(activeSlideIndex + 2) % spotlightCards.length],
  ];

  // 6 square feed posts from user's links
  const feedPosts = [
    {
      id: "post-1",
      type: "reel",
      imgUrl: "/products/items/sunflower-baguette-shoulder-bag.jpg",
      caption: "Sunflower Baguette Bag in the making",
      link: "https://www.instagram.com/reel/Dd-hMLvSdQa/?utm_source=ig_web_copy_link",
      reelIndex: 1,
    },
    {
      id: "post-2",
      type: "carousel",
      imgUrl: "/products/items/sunflower-crossbody-tote.jpg",
      caption: "Spring styling with our handmade floral tote",
      link: "https://www.instagram.com/p/Dd-hD66kmfv/?utm_source=ig_web_copy_link",
    },
    {
      id: "post-3",
      type: "reel",
      imgUrl: "/products/items/candy-festive-crochet-scrunchie.jpg",
      caption: "Cloud-soft ruffled scrunchies gentle on hair",
      link: "https://www.instagram.com/p/Dd5dKRUS7rW/?utm_source=ig_web_copy_link",
      reelIndex: 2,
    },
    {
      id: "post-4",
      type: "carousel",
      imgUrl: "/products/items/rose-ponytail-tie-pink.jpg",
      caption: "Handmade bloom hair accents",
      link: "https://www.instagram.com/reel/Dd5WQmFSn7C/?utm_source=ig_web_copy_link",
      reelIndex: 2,
    },
    {
      id: "post-5",
      type: "reel",
      imgUrl: "/ruby-bow-post.jpg",
      caption: "Ruby red bow & freshwater faux pearl keychain",
      link: "https://www.instagram.com/reel/Dd0V_kfygu-/?utm_source=ig_web_copy_link",
      reelIndex: 0,
    },
    {
      id: "post-6",
      type: "carousel",
      imgUrl: "/products/items/sage-granny-phone-case.jpg",
      caption: "Cushioned granny square phone sleeve",
      link: "https://www.instagram.com/p/Dd0V3GRS6C9/?utm_source=ig_web_copy_link",
    },
  ];

  return (
    <section id="social-showcase" className="py-20 sm:py-24 bg-[#FAF6F0] relative overflow-hidden text-left font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <div className="relative text-center max-w-3xl mx-auto space-y-3">
          
          <span className="text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-[#B06B5B] block">
            Real People • Real Moments • Real Cocoon
          </span>

          <h2 className="text-3xl sm:text-5xl font-header font-light text-[#2C2623] tracking-tight">
            Follow Our Instagram Journey
          </h2>

          <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 leading-relaxed max-w-xl mx-auto">
            From behind-the-scenes to real life styling — see how our handmade pieces find their way into your everyday moments.
          </p>
        </div>

        {/* ================= 2. FEATURE SPOTLIGHT HERO CARD WITH 5-SEC AUTO-SWITCHING REEL ================= */}
        <div className="bg-[#F5EFEB]/90 rounded-[2.5rem] p-6 sm:p-9 border border-[#EAE0D2] shadow-sm relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT: FEATURED AUTOPLAY REEL VIDEO PLAYER (5-SEC AUTO-CYCLE) */}
            <div className="lg:col-span-4">
              <div
                onClick={togglePlay}
                className="group relative aspect-[4/5] sm:aspect-[9/13] rounded-3xl overflow-hidden shadow-xl border border-[#EDE2D4] bg-stone-900 cursor-pointer select-none"
              >
                {/* HTML5 Autoplay Video */}
                <video
                  ref={videoRef}
                  key={currentReel.videoUrl}
                  src={currentReel.videoUrl}
                  poster={currentReel.poster}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Top Story-Style 3 Progress Indicators (5-sec auto-switching) */}
                <div className="absolute top-3 inset-x-4 z-20 flex items-center gap-1.5">
                  {reelsList.map((_, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReelIndex(i);
                        setIsPlaying(true);
                      }}
                      className="h-1 flex-1 rounded-full bg-white/30 backdrop-blur-xs overflow-hidden cursor-pointer"
                    >
                      <div
                        className={`h-full bg-white transition-all duration-300 ${
                          activeReelIndex === i
                            ? "w-full"
                            : activeReelIndex > i
                            ? "w-full opacity-60"
                            : "w-0"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Top Badge: REEL + Pulse Dot */}
                <div className="absolute top-7 left-4 z-20 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>REEL</span>
                  </div>
                  <span className="text-[10px] font-mono bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full text-white/90">
                    {currentReel.duration}
                  </span>
                </div>

                {/* Top Right: Sound Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="absolute top-7 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#B06B5B] backdrop-blur-md text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  {isMuted ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Center Play/Pause Overlay indicator when paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-2xs z-10">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex items-center justify-center text-[#2C2623] hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-1 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-header font-bold text-sm tracking-wide text-white drop-shadow-xs">
                        {currentReel.title}
                      </p>
                      <p className="text-[11px] font-serif text-white/85">
                        {currentReel.subtitle}
                      </p>
                    </div>
                    <a
                      href={currentReel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-[#B06B5B] backdrop-blur-xs text-[10px] font-bold text-white transition cursor-pointer"
                    >
                      IG Link ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER: EDITORIAL NARRATIVE */}
            <div className="lg:col-span-3 text-center lg:text-left space-y-3.5 py-4 px-2">
              <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#B06B5B] block">
                Atelier Showcase
              </span>
              <h3 className="font-header text-2xl sm:text-3xl text-[#2C2623] leading-snug">
                Behind<br className="hidden lg:block" /> the Stitches
              </h3>
              <p className="text-xs font-serif text-[#2C2623]/70 leading-relaxed max-w-sm mx-auto lg:mx-0">
                Get a closer look at the hands, threads and little details that make every piece special. Watch our reels in action above.
              </p>
              
              <div className="pt-2 space-y-2.5">
                <a
                  href="https://www.instagram.com/cocoon._.u/reels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3D4F42] hover:bg-[#2F3E33] text-white text-xs font-bold transition shadow-sm hover:gap-3 cursor-pointer"
                >
                  <span>Watch More Reels</span>
                  <span>→</span>
                </a>

                <div>
                  <a
                    href="https://www.instagram.com/cocoon._.u/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-serif text-[#2C2623]/75 hover:text-[#B06B5B] transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>View on Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE CAROUSEL / SPOTLIGHT CARDS WITH FULLY FUNCTIONAL NEXT & PREV */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* 3 Active Visible Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 transition-all duration-300">
                  {visibleSpotlightCards.map((card, i) => (
                    <div
                      key={`${card.id}-${activeSlideIndex}-${i}`}
                      onClick={() => {
                        if (typeof card.reelIndex === "number") {
                          setActiveReelIndex(card.reelIndex);
                          setIsPlaying(true);
                        }
                      }}
                      className="group block relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-md border border-[#EAE0D2] cursor-pointer"
                    >
                      <img
                        src={card.imgUrl}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />

                      {/* Play Reel Indicator on cards that switch reel */}
                      {typeof card.reelIndex === "number" && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-3 h-3 fill-current translate-x-0.5" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      )}

                      {/* Bottom Pill Badge without emojis */}
                      <div className="absolute inset-x-2 bottom-2 z-10">
                        <span className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[9px] font-sans font-bold tracking-wider text-[#2C2623] group-hover:bg-[#B06B5B] group-hover:text-white transition-all shadow-xs truncate">
                          <span className="truncate">{card.badge}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Previous Navigation Button */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous spotlight slide"
                  className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl border border-[#EAE0D2] flex items-center justify-center text-stone-700 hover:text-[#B06B5B] hover:scale-110 active:scale-95 transition-all cursor-pointer z-30"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Slider Next Navigation Button */}
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next spotlight slide"
                  className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl border border-[#EAE0D2] flex items-center justify-center text-stone-700 hover:text-[#B06B5B] hover:scale-110 active:scale-95 transition-all cursor-pointer z-30"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Slider Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 mt-3.5">
                {spotlightCards.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveSlideIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlideIndex === dotIdx
                        ? "w-5 bg-[#B06B5B]"
                        : "w-1.5 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ================= 3. LATEST FROM INSTAGRAM GRID ================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE0D2] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
              <h3 className="font-header text-xl sm:text-2xl text-[#2C2623] font-bold">
                Latest from Instagram
              </h3>
            </div>

            <a
              href="https://www.instagram.com/cocoon._.u/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-[#B06B5B] hover:text-[#2C2623] transition flex items-center gap-1 cursor-pointer"
            >
              <span>Follow us @cocoon._.u</span>
              <span>→</span>
            </a>
          </div>

          {/* 6 Square Posts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  if (typeof post.reelIndex === "number") {
                    setActiveReelIndex(post.reelIndex);
                    setIsPlaying(true);
                    document.getElementById("social-showcase")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.open(post.link, "_blank", "noopener,noreferrer");
                  }
                }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-[#EAE0D2] cursor-pointer"
              >
                <img
                  src={post.imgUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Top Corner Icon (Reel vs Carousel) */}
                <div className="absolute top-2.5 right-2.5 z-10 drop-shadow-md text-white/95">
                  {post.type === "reel" ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                    </svg>
                  )}
                </div>

                {/* Hover Gradient Overlay with clean SVG icons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-1">
                    {post.type === "reel" ? (
                      <svg className="w-3.5 h-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                    {post.type === "reel" ? "Play Reel" : "View Post"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. ORGANIC COMMUNITY WAVE BANNER ================= */}
        <div className="relative rounded-[2.5rem] bg-[#E3ECE3] border border-[#D5E2D5] p-8 sm:p-12 text-center overflow-hidden">
          
          <div className="max-w-xl mx-auto space-y-3.5 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/80 border border-[#CBDCCB] shadow-2xs mx-auto flex items-center justify-center text-[#3D4F42]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>

            <h3 className="font-header text-2xl sm:text-4xl text-[#2C2623] font-bold">
              Join Our Handmade Community
            </h3>

            <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 leading-relaxed">
              Follow us for new drops, special offers, and a closer look at our creative journey.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/cocoon._.u/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#38483A] hover:bg-[#253227] text-white text-xs font-bold uppercase tracking-wider transition shadow-md hover:scale-105 cursor-pointer"
              >
                <span>Follow @cocoon._.u</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
