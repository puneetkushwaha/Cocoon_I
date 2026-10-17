"use client";

import { useState } from "react";

export default function InstagramShowcase() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Spotlight cards on the right of the top feature card
  const spotlightCards = [
    {
      id: "details",
      title: "Details Matter",
      icon: "👁️",
      badge: "DETAILS MATTER",
      imgUrl: "/products/items/white-rose-twin-buds-charm-hand.jpg",
      link: "https://www.instagram.com/p/Dd-hD66kmfv/?utm_source=ig_web_copy_link",
    },
    {
      id: "style",
      title: "Style It Your Way",
      icon: "👗",
      badge: "STYLE IT YOUR WAY",
      imgUrl: "/products/items/sunflower-crossbody-tote.jpg",
      link: "https://www.instagram.com/p/Dd5dKRUS7rW/?utm_source=ig_web_copy_link",
    },
    {
      id: "shop",
      title: "Shop This Piece",
      icon: "🛍️",
      badge: "SHOP THIS PIECE",
      imgUrl: "/products/items/blush-pink-floral-case.jpg",
      link: "https://www.instagram.com/reel/Dd5WQmFSn7C/?utm_source=ig_web_copy_link",
    },
    {
      id: "bow",
      title: "Heirloom Charms",
      icon: "🎀",
      badge: "HEIRLOOM CHARM",
      imgUrl: "/ruby-bow-post.jpg",
      link: "https://www.instagram.com/reel/Dd0V_kfygu-/?utm_source=ig_web_copy_link",
    },
  ];

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % spotlightCards.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + spotlightCards.length) % spotlightCards.length);
  };

  // 6 square feed posts from user's links
  const feedPosts = [
    {
      id: "post-1",
      type: "reel",
      imgUrl: "/products/items/sunflower-baguette-shoulder-bag.jpg",
      caption: "Sunflower Baguette Bag in the making",
      link: "https://www.instagram.com/reel/Dd-hMLvSdQa/?utm_source=ig_web_copy_link",
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
    },
    {
      id: "post-4",
      type: "carousel",
      imgUrl: "/products/items/rose-ponytail-tie-pink.jpg",
      caption: "Handmade bloom hair accents",
      link: "https://www.instagram.com/reel/Dd5WQmFSn7C/?utm_source=ig_web_copy_link",
    },
    {
      id: "post-5",
      type: "reel",
      imgUrl: "/ruby-bow-post.jpg",
      caption: "Ruby red bow & freshwater faux pearl keychain",
      link: "https://www.instagram.com/reel/Dd0V_kfygu-/?utm_source=ig_web_copy_link",
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
        
        {/* ================= 1. SECTION HEADER WITH DOODLES ================= */}
        <div className="relative text-center max-w-3xl mx-auto space-y-3">
          
          {/* Left Doodle: Arrow & "Instagram Reels + Posts showcase" */}
          <div className="hidden lg:flex items-center gap-2 absolute -left-28 -top-3 text-[#2C2623]/70 select-none pointer-events-none transform -rotate-6">
            <span className="font-serif italic text-xs leading-tight text-right block max-w-[110px]">
              Instagram<br />Reels + Posts<br />showcase
            </span>
            <svg className="w-8 h-8 text-[#B06B5B]/80" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 10 C 15 5, 28 15, 25 32" strokeLinecap="round" />
              <path d="M19 28 L 25 33 L 30 27" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Right Doodle: "Shoppable & Interactive ♡" */}
          <div className="hidden lg:flex items-center gap-2 absolute -right-28 -top-1 text-[#2C2623]/70 select-none pointer-events-none transform rotate-3">
            <svg className="w-6 h-6 text-[#B06B5B]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12 L8 12 M6 6 L9 9 M6 18 L9 15" strokeLinecap="round" />
            </svg>
            <span className="font-serif italic text-xs leading-tight text-left block max-w-[110px]">
              Shoppable<br />&amp; Interactive<br />♡
            </span>
          </div>

          <span className="text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-[#B06B5B] block">
            Real People • Real Moments • Real Cocoon
          </span>

          <h2 className="text-3xl sm:text-5xl font-header font-light text-[#2C2623] tracking-tight">
            Follow Our Instagram Journey <span className="font-serif italic text-[#B06B5B]">♡</span>
          </h2>

          <p className="text-xs sm:text-sm font-serif text-[#2C2623]/70 leading-relaxed max-w-xl mx-auto">
            From behind-the-scenes to real life styling — see how our handmade pieces find their way into your everyday moments.
          </p>
        </div>

        {/* ================= 2. FEATURE SPOTLIGHT HERO CARD ================= */}
        <div className="bg-[#F5EFEB]/80 rounded-[2.5rem] p-6 sm:p-9 border border-[#EAE0D2] shadow-sm relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT: FEATURED REEL PLAYER CARD */}
            <div className="lg:col-span-4">
              <a
                href="https://www.instagram.com/reel/Dd-hMLvSdQa/?utm_source=ig_web_copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative aspect-[4/5] sm:aspect-[9/13] rounded-3xl overflow-hidden shadow-lg border border-[#EDE2D4] bg-stone-900 cursor-pointer"
              >
                <img
                  src="/instagram-post.jpg"
                  alt="Watch the making of GoCocoon crochet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />

                {/* Top Badge: REEL */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  <span>REEL</span>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/85 backdrop-blur-md shadow-2xl flex items-center justify-center text-[#2C2623] group-hover:scale-115 group-hover:bg-[#B06B5B] group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-header font-bold text-sm tracking-wide">Watch the making</p>
                      <p className="text-[11px] font-serif text-white/85">From yarn to your hands ♡</p>
                    </div>
                    <span className="text-[10px] font-mono bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-white/90">
                      0:45
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* CENTER: EDITORIAL NARRATIVE */}
            <div className="lg:col-span-3 text-center lg:text-left space-y-3.5 py-4 px-2">
              <div className="inline-block text-xl text-[#B06B5B] font-serif">♡</div>
              <h3 className="font-header text-2xl sm:text-3xl text-[#2C2623] leading-snug">
                Behind<br className="hidden lg:block" /> the Stitches
              </h3>
              <p className="text-xs font-serif text-[#2C2623]/70 leading-relaxed max-w-sm mx-auto lg:mx-0">
                Get a closer look at the hands, threads and little details that make every piece special.
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

            {/* RIGHT: INTERACTIVE CAROUSEL / SPOTLIGHT CARDS */}
            <div className="lg:col-span-5 relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {spotlightCards.slice(0, 3).map((card) => (
                  <a
                    key={card.id}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-md border border-[#EAE0D2] cursor-pointer"
                  >
                    <img
                      src={card.imgUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />

                    {/* Bottom Pill Badge */}
                    <div className="absolute inset-x-2 bottom-2 z-10">
                      <span className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[9px] font-sans font-bold tracking-wider text-[#2C2623] group-hover:bg-[#B06B5B] group-hover:text-white transition-all shadow-xs truncate">
                        <span>{card.icon}</span>
                        <span className="truncate">{card.badge}</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Slider Next Navigation Button */}
              <button
                onClick={handleNextSlide}
                aria-label="Next spotlight slide"
                className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg border border-[#EAE0D2] items-center justify-center text-stone-700 hover:text-[#B06B5B] hover:scale-110 transition-all cursor-pointer z-20"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
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
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
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

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                  <span className="text-xl mb-1">📸</span>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                    View Post
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ================= 4. ORGANIC COMMUNITY WAVE BANNER ================= */}
        <div className="relative rounded-[2.5rem] bg-[#E3ECE3] border border-[#D5E2D5] p-8 sm:p-12 text-center overflow-hidden">
          
          {/* Left Decorative Botanical Doodle */}
          <div className="hidden md:flex items-center gap-2 absolute left-8 top-1/2 -translate-y-1/2 select-none pointer-events-none text-[#2C2623]/70">
            <span className="font-serif italic text-xs leading-tight text-right block max-w-[100px]">
              ✨ More<br />on Instagram<br />♡
            </span>
            <svg className="w-8 h-8 text-[#526B57]/70" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 25 C 15 28, 25 22, 28 8" strokeLinecap="round" />
              <path d="M22 10 L 29 7 L 31 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Right Decorative Botanical Flower */}
          <div className="hidden md:flex items-center gap-2 absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none text-[#2C2623]/70">
            <svg className="w-12 h-12 text-[#526B57]/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M24 24 L24 44 M24 34 Q18 32 16 38 M24 38 Q30 36 32 42" strokeLinecap="round" />
              <circle cx="24" cy="18" r="4" fill="currentColor" fillOpacity="0.2" />
              <circle cx="24" cy="11" r="3" />
              <circle cx="31" cy="18" r="3" />
              <circle cx="24" cy="25" r="3" />
              <circle cx="17" cy="18" r="3" />
            </svg>
            <span className="font-serif italic text-xs leading-tight text-left block max-w-[100px]">
              Handmade<br />with love<br />♡
            </span>
          </div>

          {/* Center Community Content */}
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

        {/* ================= 5. TRUST PILLARS BAR ================= */}
        <div className="pt-4 border-t border-[#EAE0D2]/80 flex flex-wrap items-center justify-around gap-4 sm:gap-8 text-xs font-serif text-[#2C2623]/75 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[#B06B5B]">✦</span>
            <span>Handmade Creations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#B06B5B]">♡</span>
            <span>Small Business</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#526B57]">🍃</span>
            <span>Sustainable Choices</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#B06B5B]">☺</span>
            <span>A Little More Kindness</span>
          </div>
        </div>

      </div>
    </section>
  );
}
