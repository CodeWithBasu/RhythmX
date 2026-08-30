"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FoxyHeroProps {
  logo?: {
    icon?: React.ReactNode;
    text: string;
  };
  navigation?: Array<{
    label: string;
    isActive?: boolean;
    onClick?: () => void;
  }>;
  headerCta?: {
    label: string;
    onClick: () => void;
  };
  title: string;
  subtitle: string;
  ctaButtons?: {
    primary: {
      label: string;
      onClick: () => void;
    };
    secondary: {
      label: string;
      onClick: () => void;
    };
  };
  dashboardImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FoxyHero({
  logo = { text: "RhythmX" },
  navigation = [
    { label: "Home", isActive: true },
    { label: "Visualizer" },
    { label: "Party Sync" },
    { label: "8D Audio" },
    { label: "Privacy" },
  ],
  headerCta,
  title,
  subtitle,
  ctaButtons,
  dashboardImage,
  className,
  children,
}: FoxyHeroProps) {
  // Generate star particles
  const starParticles = Array.from({ length: 13 }, (_, i) => ({
    id: i,
    left: [966, 959, 998, 1006, 1018, 953, 941, 901, 841, 864, 908, 926, 957][i],
    top: [17, 49, 105, 61, 149, 168, 223, 250, 208, 153, 151, 93, 86][i],
  }));

  // Generate horizontal star particles
  const horizontalStars = Array.from({ length: 13 }, (_, i) => ({
    id: i,
    left: [473, 527, 623, 548, 699, 731, 826, 872, 800, 706, 702, 603, 591][i],
    top: [544, 551, 512, 504, 492, 557, 569, 609, 669, 646, 602, 584, 553][i],
  }));

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col items-center overflow-x-hidden",
        className
      )}
      style={{ background: "#08020e" }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Grid/Mask */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <rect
            width="100%"
            height="100%"
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1.4155"
          />
        </svg>
      </div>

      {/* Purple Ambient Light - Large */}
      <motion.div
        className="absolute z-0"
        style={{
          width: "1151px",
          height: "1024px",
          left: "119px",
          top: "0px",
          background: "rgba(80, 10, 140, 0.4)",
          filter: "blur(250px)",
          borderRadius: "50%",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top Light Effect Group */}
      <div
        className="absolute z-0"
        style={{
          width: "451.95px",
          height: "476.87px",
          left: "50%",
          transform: "translateX(-50%)",
          top: "-132px",
        }}
      >
        {/* Light Beams */}
        <motion.div
          className="absolute"
          style={{
            width: "204px",
            height: "348.5px",
            left: "46px",
            top: "47px",
            background: "linear-gradient(180deg, #A855F7 0%, rgba(168, 85, 247, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(12px)",
            transform: "rotate(13.39deg)",
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: "204px",
            height: "348.5px",
            left: "137.95px",
            top: "62.98px",
            background: "linear-gradient(180deg, #06B6D4 0%, rgba(6, 182, 212, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(12px)",
            transform: "rotate(13.33deg)",
          }}
          animate={{
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Purple Glow Ellipse */}
        <motion.div
          className="absolute"
          style={{
            width: "264.72px",
            height: "397.88px",
            left: "0px",
            top: "0px",
            background: "rgba(168, 85, 247, 0.4)",
            filter: "blur(125px)",
            transform: "rotate(37.4deg)",
            borderRadius: "50%",
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Star Particles - Vertical Group */}
      {starParticles.map((star, index) => (
        <motion.div
          key={`star-v-${star.id}`}
          className="absolute z-0"
          style={{
            width: "2px",
            height: "2px",
            left: `${star.left}px`,
            top: `${star.top}px`,
            background:
              index >= 6
                ? "linear-gradient(180deg, #A855F7 0%, rgba(168, 85, 247, 0) 100%)"
                : "linear-gradient(180deg, rgba(6, 182, 212, 0.5) 0%, rgba(6, 182, 212, 0) 100%)",
            borderRadius: "50%",
            boxShadow: "0 0 4px rgba(168, 85, 247, 0.8)",
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 flex flex-row justify-between sm:justify-center items-center px-6 w-full"
        style={{
          width: "min(1196px, 95vw)",
          gap: "clamp(10px, 6vw, 180px)",
          marginTop: "28px",
        }}
      >
        {/* Logo */}
        <div className="flex flex-row justify-center items-center" style={{ gap: "10px" }}>
          {logo.icon}
          <span
            className="tracking-tighter"
            style={{
              fontFamily: "Inter, sans-serif",
              fontStyle: "normal",
              fontWeight: 800,
              fontSize: "24px",
              lineHeight: "29px",
              color: "#FFFFFF",
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
            }}
          >
            {logo.text}
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex flex-row items-center" style={{ gap: "28px" }} aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="transition-opacity hover:opacity-100 font-mono tracking-widest uppercase"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: item.isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                opacity: item.isActive ? 1 : 0.5,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header CTA */}
        {headerCta && (
          <button
            onClick={headerCta.onClick}
            className="flex flex-row justify-center items-center transition-all hover:scale-105 border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            style={{
              padding: "6px 16px",
              width: "150px",
              height: "41px",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%), #1a082e",
              borderRadius: "100px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#FFFFFF",
            }}
          >
            {headerCta.label}
          </button>
        )}
      </motion.header>

      {/* Center Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full mt-12">
          {children}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 flex flex-col items-center px-4"
          style={{
            width: "min(810px, 90vw)",
            gap: "41px",
            marginTop: "100px",
          }}
        >
          {/* Title and Subtitle */}
          <div className="flex flex-col items-center" style={{ width: "100%", gap: "0px" }}>
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center tracking-tight"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 800,
                fontSize: "clamp(30px, 5.5vw, 60px)",
                lineHeight: "1.1",
                background: "linear-gradient(91.84deg, #4c1d95 -12.23%, #fdf4ff 66.73%, #06b6d4 119.29%), #fdf4ff",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-center max-w-xl"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(14px, 1.8vw, 17px)",
                lineHeight: "1.5",
                color: "rgba(255, 255, 255, 0.6)",
                marginTop: "20px",
              }}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          {ctaButtons && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center w-full sm:w-auto"
              style={{ gap: "20px" }}
            >
              <button
                onClick={ctaButtons.primary.onClick}
                className="flex flex-row justify-center items-center transition-all hover:scale-105 border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full sm:w-auto"
                style={{
                  padding: "12px 28px",
                  height: "48px",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%), #7C3AED",
                  borderRadius: "100px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#FFFFFF",
                }}
              >
                {ctaButtons.primary.label}
              </button>
              <button
                onClick={ctaButtons.secondary.onClick}
                className="flex flex-row justify-center items-center transition-all hover:scale-105 hover:bg-white/5 w-full sm:w-auto"
                style={{
                  padding: "12px 28px",
                  height: "48px",
                  borderRadius: "100px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#FFFFFF",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                {ctaButtons.secondary.label}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Dashboard Section / Visualizer Preview */}
      {dashboardImage && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="relative z-10"
          style={{
            width: "min(1100px, 90vw)",
            height: "auto",
            marginTop: "clamp(60px, 10vh, 120px)",
          }}
        >
          {/* Bottom Grid Mask */}
          <svg
            width="100%"
            height="auto"
            style={{
              position: "absolute",
              top: "-150px",
              left: "-200px",
              width: "calc(100% + 400px)",
              height: "auto",
              pointerEvents: "none",
            }}
          >
            <rect
              width="100%"
              height="100%"
              fill="none"
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="1.4155"
            />
          </svg>

          {/* Glow Effects Behind Dashboard */}
          <div className="absolute" style={{ left: "50%", transform: "translateX(-50%)", top: "-56px", width: "836px" }}>
            <motion.div
              className="absolute"
              style={{
                width: "828px",
                height: "76px",
                left: "4px",
                top: "0px",
                background: "rgba(168, 85, 247, 0.3)",
                mixBlendMode: "plus-lighter",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute"
              style={{
                width: "794px",
                height: "76px",
                left: "14px",
                top: "56px",
                background: "rgba(6, 182, 212, 0.3)",
                mixBlendMode: "plus-lighter",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>

          {/* Horizontal Star Particles */}
          {horizontalStars.map((star, index) => (
            <motion.div
              key={`star-h-${star.id}`}
              className="absolute z-0"
              style={{
                width: "2px",
                height: "3.43px",
                left: `${star.left - 400}px`,
                top: `${star.top - 480}px`,
                background:
                  index >= 6
                    ? "linear-gradient(180deg, #A855F7 0%, rgba(168, 85, 247, 0) 100%)"
                    : "linear-gradient(180deg, rgba(6, 182, 212, 0.5) 0%, rgba(6, 182, 212, 0) 100%)",
                transform: "rotate(-90deg)",
                borderRadius: "50%",
                boxShadow: "0 0 4px rgba(168, 85, 247, 0.8)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 2.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Dashboard Wrapper */}
          <div
            className="relative p-[1px] bg-gradient-to-tr from-purple-500/20 via-white/5 to-cyan-500/20"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "19px",
                overflow: "hidden",
                background: "#08020e",
              }}
            >
              {/* Children (e.g. Visualizer Live Demo component) */}
              <div className="w-full h-full">
                <img
                  src={dashboardImage}
                  alt="RhythmX Player Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Multi-Brand Music Platform Slider */}
      {!dashboardImage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="relative z-10 w-full overflow-hidden"
          style={{
            marginTop: "clamp(80px, 12vh, 150px)",
            paddingBottom: "80px",
          }}
        >
          {/* Brand Slider Container */}
          <div className="relative w-full">
            {/* Gradient Overlays */}
            <div
              className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "150px",
                background: "linear-gradient(90deg, #08020e 0%, rgba(8, 2, 14, 0) 100%)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "150px",
                background: "linear-gradient(270deg, #08020e 0%, rgba(8, 2, 14, 0) 100%)",
              }}
            />

            {/* Scrolling Brands */}
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -1440],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
              style={{
                gap: "85px",
                paddingLeft: "85px",
              }}
            >
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {/* Brand 1 - Spotify */}
                  <div className="flex-shrink-0 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors" style={{ width: "160px", height: "60px" }}>
                    <span className="font-extrabold text-lg tracking-widest uppercase flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-black">S</span>
                      SPOTIFY
                    </span>
                  </div>

                  {/* Brand 2 - Apple Music */}
                  <div className="flex-shrink-0 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors" style={{ width: "160px", height: "60px" }}>
                    <span className="font-extrabold text-lg tracking-widest uppercase flex items-center gap-2">
                      <span className="text-xl">♫</span>
                      APPLE MUSIC
                    </span>
                  </div>

                  {/* Brand 3 - SoundCloud */}
                  <div className="flex-shrink-0 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors" style={{ width: "160px", height: "60px" }}>
                    <span className="font-extrabold text-lg tracking-widest uppercase flex items-center gap-2">
                      <span className="text-xl">☁</span>
                      SOUNDCLOUD
                    </span>
                  </div>

                  {/* Brand 4 - YouTube Music */}
                  <div className="flex-shrink-0 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors" style={{ width: "160px", height: "60px" }}>
                    <span className="font-extrabold text-lg tracking-widest uppercase flex items-center gap-2">
                      <span className="w-5 h-5 bg-current rounded-full flex items-center justify-center text-[8px] text-[#08020e] font-black">▶</span>
                      YT MUSIC
                    </span>
                  </div>

                  {/* Brand 5 - Tidal */}
                  <div className="flex-shrink-0 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors" style={{ width: "160px", height: "60px" }}>
                    <span className="font-extrabold text-lg tracking-widest uppercase flex items-center gap-2">
                      <span className="text-sm font-mono font-black">◆◆</span>
                      TIDAL
                    </span>
                  </div>

                  {/* Brand 6 - Deezer */}
                  <div className="flex-shrink-0 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors" style={{ width: "160px", height: "60px" }}>
                    <span className="font-extrabold text-lg tracking-widest uppercase flex items-center gap-2">
                      <span className="font-mono">|||</span>
                      DEEZER
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* "Supported platforms" Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mt-12"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(244, 223, 255, 0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Universal Local & Cloud Streaming Compatibility
          </motion.p>
        </motion.div>
      )}
    </section>
  );
}
