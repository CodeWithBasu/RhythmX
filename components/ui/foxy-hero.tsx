"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FoxyHeroProps {
  logo?: {
    icon?: React.ReactNode;
    text: React.ReactNode;
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
  logo = { text: "Foxy" },
  navigation = [
    { label: "Home", isActive: true },
    { label: "Features" },
    { label: "Pricing" },
    { label: "Blogs" },
    { label: "Contact" },
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
        "relative w-full min-h-screen flex flex-col items-center overflow-hidden",
        className
      )}
      style={{ background: "#0C0414" }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Grid/Mask */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.4155"
          />
        </svg>
      </div>

      {/* Purple Ambient Light - Large */}
      <motion.div
        className="absolute"
        style={{
          width: "1151px",
          height: "1024px",
          left: "119px",
          top: "0px",
          background: "rgba(50, 0, 86, 0.6)",
          filter: "blur(250px)",
          borderRadius: "50%",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top Light Effect Group */}
      <div
        className="absolute"
        style={{
          width: "451.95px",
          height: "476.87px",
          left: "754px",
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
            background: "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(10.5px)",
            transform: "rotate(13.39deg)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
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
            background: "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(10.5px)",
            transform: "rotate(13.33deg)",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: "204px",
            height: "348.5px",
            left: "122px",
            top: "86px",
            background: "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(10.5px)",
            transform: "rotate(6.01deg)",
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
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
            background: "rgba(192, 105, 255, 0.5)",
            filter: "blur(125px)",
            transform: "rotate(37.4deg)",
            borderRadius: "50%",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small Center Glow */}
        <div
          className="absolute"
          style={{
            width: "100px",
            height: "100px",
            left: "175px",
            top: "206px",
            background: "#D9D9D9",
            filter: "blur(75px)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Star Particles - Vertical Group */}
      {starParticles.map((star, index) => (
        <motion.div
          key={`star-v-${star.id}`}
          className="absolute"
          style={{
            width: "2px",
            height: "2px",
            left: `${star.left}px`,
            top: `${star.top}px`,
            background:
              index >= 6
                ? "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)"
                : "linear-gradient(180deg, rgba(192, 105, 255, 0.5) 0%, rgba(192, 105, 255, 0) 100%)",
            borderRadius: "50%",
            boxShadow: "0 0 4px rgba(192, 105, 255, 0.8)",
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
        className="relative z-10 flex flex-row justify-center items-center px-4"
        style={{
          width: "min(1196px, 95vw)",
          gap: "clamp(20px, 10vw, 217px)",
          marginTop: "28px",
        }}
      >
        {/* Logo */}
        <div className="flex flex-row justify-center items-center" style={{ gap: "7px" }}>
          {logo.icon}
          <span className="flex items-center">
            {logo.text}
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-row items-center" style={{ gap: "28px" }} aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="transition-opacity hover:opacity-100"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "18px", lineHeight: "24px",
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
            className="flex flex-row justify-center items-center transition-all hover:scale-105"
            style={{
              padding: "0 24px", height: "46px", whiteSpace: "nowrap",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%), #551A94",
              borderRadius: "100px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "18px", lineHeight: "24px",
              color: "#FFFFFF",
            }}
          >
            {headerCta.label}
          </button>
        )}
      </motion.header>

      {/* Center Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
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
            marginTop: "145px",
          }}
        >
          {/* Title and Subtitle */}
          <div className="flex flex-col items-center" style={{ width: "100%", gap: "0px" }}>
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
              style={{
                fontFamily: "'Nexium', sans-serif",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: "1.2",
                background: "linear-gradient(91.84deg, #231233 -12.23%, #F4DFFF 66.73%, #231233 119.29%), #F4DFFF",
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
              className="text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(16px, 2vw, 20px)",
                lineHeight: "1.2",
                background: "linear-gradient(91.3deg, #231233 -10.75%, #F4DFFF 13.44%, #F4DFFF 96.07%, #231233 103.03%), #F4DFFF",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginTop: "10px",
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
              className="flex flex-row items-center"
              style={{ gap: "34px" }}
            >
              <button
                onClick={ctaButtons.primary.onClick}
                className="flex flex-row justify-center items-center transition-all hover:scale-105"
                style={{
                  padding: "0 24px", height: "46px", whiteSpace: "nowrap",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%), #551A94",
                  borderRadius: "100px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px", lineHeight: "24px",
                  color: "#FFFFFF",
                }}
              >
                {ctaButtons.primary.label}
              </button>
              <button
                onClick={ctaButtons.secondary.onClick}
                className="flex flex-row justify-center items-center transition-all hover:scale-105"
                style={{
                  padding: "0 28px", height: "46px", whiteSpace: "nowrap",
                  borderRadius: "100px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px", lineHeight: "24px",
                  color: "#FFFFFF",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {ctaButtons.secondary.label}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Dashboard Section with Light Effects */}
      {dashboardImage && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="relative z-10"
          style={{
            width: "min(1100px, 90vw)",
            height: "auto",
            marginTop: "clamp(100px, 15vh, 280px)",
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
              stroke="rgba(255, 255, 255, 0.47)"
              strokeWidth="1.4155"
            />
          </svg>

          {/* Purple Glow Effects Behind Dashboard */}
          <div className="absolute" style={{ left: "50%", transform: "translateX(-50%)", top: "-56px", width: "836px" }}>
            <motion.div
              className="absolute"
              style={{
                width: "828px",
                height: "76px",
                left: "4px",
                top: "0px",
                background: "rgba(192, 105, 255, 0.5)",
                mixBlendMode: "plus-lighter",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
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
                background: "rgba(192, 105, 255, 0.5)",
                mixBlendMode: "plus-lighter",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute"
              style={{
                width: "812px",
                height: "28px",
                left: "0px",
                top: "56px",
                background: "#C069FF",
                filter: "blur(20px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          {/* Horizontal Star Particles */}
          {horizontalStars.map((star, index) => (
            <motion.div
              key={`star-h-${star.id}`}
              className="absolute"
              style={{
                width: "2px",
                height: "3.43px",
                left: `${star.left - 400}px`,
                top: `${star.top - 480}px`,
                background:
                  index >= 6
                    ? "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)"
                    : "linear-gradient(180deg, rgba(192, 105, 255, 0.5) 0%, rgba(192, 105, 255, 0) 100%)",
                transform: "rotate(-90deg)",
                borderRadius: "50%",
                boxShadow: "0 0 4px rgba(192, 105, 255, 0.8)",
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

          {/* Bottom Reflection */}
          <div
            className="absolute"
            style={{
              width: "688px",
              height: "73.79px",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-20px",
              background: "#D9D9D9",
              filter: "blur(70px)",
              borderRadius: "50%",
            }}
          />

          {/* Dashboard Image */}
          <div
            className="relative"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "1100 / 783",
              borderRadius: "20px",
              overflow: "hidden",
              background: "linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), #1a1a2e",
            }}
          >
            <img
              src={dashboardImage}
              alt="Dashboard Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Multi-Brand Slider */}
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
                width: "200px",
                background: "linear-gradient(90deg, #0C0414 0%, rgba(12, 4, 20, 0) 100%)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "200px",
                background: "linear-gradient(270deg, #0C0414 0%, rgba(12, 4, 20, 0) 100%)",
              }}
            />

            {/* Scrolling Brands */}
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              style={{
                gap: "80px",
                paddingLeft: "80px",
              }}
            >
              {/* Duplicate the brands array for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {/* Brand 1 - Next.js */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="70" height="70" viewBox="0 0 180 180" fill="none">
                      <circle cx="90" cy="90" r="90" fill="transparent" stroke="#F4DFFF" strokeWidth="8" />
                      <path d="M125.688 153.255L64.2183 67.5H54.75V117H62.25V79.2238L119.553 158.463C121.722 156.884 123.771 155.138 125.688 153.255Z" fill="#F4DFFF"/>
                      <path d="M117 67.5H124.5V117H117V67.5Z" fill="#F4DFFF"/>
                    </svg>
                  </div>

                  {/* Brand 2 - React */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="70" height="70" viewBox="-11.5 -10.23174 23 20.46348">
                      <circle cx="0" cy="0" r="2.05" fill="#F4DFFF"/>
                      <g stroke="#F4DFFF" strokeWidth="1" fill="none">
                        <ellipse rx="11" ry="4.2"/>
                        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                      </g>
                    </svg>
                  </div>

                  {/* Brand 3 - Tailwind CSS */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="70" height="50" viewBox="0 0 100 60" fill="none">
                      <path d="M25 0C13.8 0 8.2 6.5 6.2 13.9C9.2 11.5 12.2 10.7 15.2 11.3C17.5 11.8 19.1 13.3 20.9 15.1C24.8 19 29.5 23.9 43.8 23.9C54.9 23.9 60.6 17.4 62.5 10C59.6 12.4 56.6 13.2 53.6 12.6C51.3 12.1 49.7 10.6 47.9 8.8C43.9 4.9 39.3 0 25 0ZM6.2 23.9C-4.9 23.9 -10.6 30.4 -12.5 37.8C-9.6 35.4 -6.6 34.6 -3.6 35.2C-1.3 35.7 0.3 37.2 2.1 39C6.1 42.9 10.7 47.8 25 47.8C36.2 47.8 41.8 41.3 43.8 33.9C40.8 36.3 37.8 37.1 34.8 36.5C32.5 36 30.9 34.5 29.1 32.7C25.2 28.8 20.5 23.9 6.2 23.9Z" fill="#F4DFFF" transform="translate(18.75, 5)"/>
                    </svg>
                  </div>

                  {/* Brand 4 - TypeScript */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <path d="M2.5 2.5h19v19h-19v-19z" fill="transparent" stroke="#F4DFFF" strokeWidth="1.5"/>
                      <path d="M13.84 15.68c-.68.6-1.55.94-2.58.94-2.07 0-3.32-1.3-3.32-3.38V9.16H9.9v4.03c0 1.17.65 1.77 1.63 1.77.7 0 1.26-.23 1.6-.57l.71 1.29zm6.18-1.5c0 1.54-1.38 2.44-3.4 2.44-1.9 0-3.15-.75-3.6-1.91l1.55-.95c.34.8 1.05 1.2 1.94 1.2.98 0 1.55.4 1.55.95 0 .5-.54.85-1.5.85-2.03 0-2.14-1.09-2.14-1.09l-1.63 1.01s.57 1.54 2.5 1.83c1.76.27 4.19-.57 4.19-2.67 0-1.74-1.68-2.14-3.05-2.5-1.15-.3-1.63-.6-1.63-1.14 0-.54.6-.9 1.4-.9 1 0 1.58.4 1.9 1.01l1.45-.88c-.46-1.17-1.6-1.77-3.3-1.77-1.8 0-3.15.84-3.15 2.37 0 1.57 1.48 2.07 2.85 2.4 1.2.3 1.9.65 1.9 1.35z" fill="#F4DFFF"/>
                    </svg>
                  </div>

                  {/* Brand 5 - MongoDB */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                      <path d="M11.96 24c.48-1.57 1.83-4.52 3.32-8.08.77-1.78 1.48-3.66 2.06-5.59 1.25-4.11-.27-8.35-3.32-10.33C14.02 0 11.96 0 11.96 0s-2.06 0-2.06 0c-3.04 1.98-4.57 6.22-3.32 10.33.58 1.93 1.29 3.81 2.06 5.59 1.48 3.56 2.84 6.51 3.32 8.08z" fill="#F4DFFF"/>
                      <path d="M11.96 11.75c-1.36 0-2.47-1.1-2.47-2.47 0-1.36 1.1-2.47 2.47-2.47 1.36 0 2.47 1.1 2.47 2.47 0 1.36-1.11 2.47-2.47 2.47z" fill="#F4DFFF"/>
                    </svg>
                  </div>

                  {/* Brand 6 - Framer Motion */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="50" height="50" viewBox="0 0 14 21" fill="none">
                      <path d="M0 0h14v7H7L0 0zm0 7h7l7 7H0V7zm7 7v7l-7-7h7z" fill="#F4DFFF"/>
                    </svg>
                  </div>

                  {/* Brand 7 - Vercel */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L24 22H0L12 2Z" fill="#F4DFFF"/>
                    </svg>
                  </div>

                  {/* Brand 8 - WebGL */}
                  <div className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" style={{ width: "180px", height: "80px" }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#F4DFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* "Trusted by" Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mt-12"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "rgba(244, 223, 255, 0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            BUILT WITH MODERN TECHNOLOGIES
          </motion.p>
        </motion.div>
      )}
    </section>
  );
}
