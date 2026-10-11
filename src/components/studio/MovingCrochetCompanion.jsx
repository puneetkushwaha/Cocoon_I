"use client";

import { useState, useEffect, useRef } from "react";

export default function MovingCrochetCompanion() {
  const [position, setPosition] = useState({ x: 120, y: 350 });
  const [rotation, setRotation] = useState(0);
  const [stitchCount, setStitchCount] = useState(240);
  const [sparkles, setSparkles] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const targetRef = useRef({ x: 120, y: 350 });
  const currentRef = useRef({ x: 120, y: 350 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef(null);

  // Mouse Movement Smooth Follower (Lerp Physics like Indowings Drone)
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate delta to rotate towards motion
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      const angle = Math.max(-25, Math.min(25, dx * 0.8));
      setRotation(angle);

      lastMouseRef.current = { x: e.clientX, y: e.clientY };

      // Set target position with gentle offset so it floats beside the cursor
      // Keep within viewport bounds
      const targetX = Math.min(window.innerWidth - 100, Math.max(40, e.clientX + 35));
      const targetY = Math.min(window.innerHeight - 100, Math.max(80, e.clientY + 20));
      targetRef.current = { x: targetX, y: targetY };
    };

    // Scroll adds stitches and adds slight float wave
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setStitchCount(Math.floor(240 + progress * 2400));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 60FPS Smooth Inertia Lerp Animation Loop
    const animate = () => {
      const lerpFactor = 0.065; // Soft gentle follow
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerpFactor;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerpFactor;

      setPosition({
        x: currentRef.current.x,
        y: currentRef.current.y
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Click burst animation (sparkles)
  const triggerSparkleBurst = () => {
    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      char: ["*"][i % 1]
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1000);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 bg-[#FAF4ED] border-2 border-[#8E4A49] text-[#8E4A49] px-4 py-2.5 rounded-full shadow-2xl text-xs font-serif flex items-center gap-2 hover:scale-105 transition cursor-pointer"
        title="Release Floating Crochet Companion"
      >
        
        <span className="font-semibold">Companion Mode</span>
      </button>
    );
  }

  return (
    <>
      {/* FLOATING & MOVING COMPANION (Docks automatically on mobile / follows on desktop) */}
      <div
        className="fixed z-40 pointer-events-auto transition-transform duration-75 select-none hidden md:block"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
          willChange: "transform"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={triggerSparkleBurst}
      >
        {/* MOVING AVATAR CONTAINER */}
        <div className="relative group cursor-pointer">
          
          {/* AMBIENT WARM CRAFT GLOW */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#FCEEEA] via-[#F3D5CF] to-[#FAF4ED] rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* MAIN FLOATING CRAFT PILL */}
          <div className="relative bg-[#FAF5EE]/95 backdrop-blur-md border-2 border-[#8E4A49] rounded-3xl p-2.5 px-3.5 shadow-2xl flex items-center gap-2.5 hover:shadow-[0_12px_28px_rgba(142,74,73,0.25)] transition-all hover:scale-110">
            
            {/* MOVING 3D CROCHET YARN BALL & NEEDLE */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#8E4A49] via-[#C57B6C] to-[#E8A598] flex items-center justify-center shadow-inner animate-yarn-bob">
              
              
              {/* Golden needle crossing */}
              <span className="absolute -top-1.5 -right-1 text-sm transform rotate-45 pointer-events-none drop-shadow-sm">
                
              </span>

              {/* Evil eye charm dangling */}
              <div className="absolute -bottom-2 -left-1 w-3.5 h-3.5 rounded-full bg-white border border-blue-400 flex items-center justify-center text-[7px] shadow-xs">
                
              </div>
            </div>

            {/* LIVE MOVING STITCH INFO */}
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#3E5241] animate-ping" />
                <p className="text-[10px] font-serif uppercase tracking-widest text-[#8E4A49] font-bold">
                  Mehak's Living Stitch
                </p>
              </div>
              <p className="text-[11px] font-sans font-semibold text-[#2C2926] leading-none mt-0.5">
                {stitchCount.toLocaleString()} loops cast
              </p>
            </div>

            {/* MINIMIZE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="text-[#9E9385] hover:text-[#8E4A49] text-xs ml-1 p-0.5 opacity-60 hover:opacity-100 transition"
              title="Park Companion"
            >
              ✕
            </button>
          </div>

          {/* HOVER TOOLTIP */}
          {isHovered && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#2E4334] text-[#FAF5EE] text-[10px] font-serif px-3 py-1 rounded-full whitespace-nowrap shadow-lg animate-fadeIn">
              Click me to drop craft sparks!
            </div>
          )}

          {/* SPARKLES BURST */}
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute text-sm pointer-events-none animate-scaleIn"
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: `calc(50% + ${s.y}px)`,
                transition: "all 0.6s ease-out"
              }}
            >
              {s.char}
            </span>
          ))}

        </div>
      </div>

      {/* MOBILE STICKY STITCH METER STRIP (Clean & Non-intrusive) */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-40 bg-[#FAF5EE]/95 border border-[#8E4A49]/30 rounded-2xl p-2 px-3.5 shadow-xl backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          
          <div>
            <span className="text-[9px] font-serif uppercase tracking-widest text-[#8E4A49] font-bold block">Hand-Knit Stitch Meter</span>
            <span className="text-xs font-semibold text-[#2C2623]">{stitchCount.toLocaleString()} stitches woven</span>
          </div>
        </div>
        <span className="text-xs text-[#3E5241] font-bold">100% Cotton</span>
      </div>
    </>
  );
}
