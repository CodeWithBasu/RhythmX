"use client";

import Link from "next/link";
import { Twitter, Instagram, Youtube, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0C0414] text-white py-12 px-6 md:px-12 relative z-20 border-t border-white/5 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Top Section - 5 Columns for better text balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Socials (Takes up 2 columns on large screens) */}
          <div className="flex flex-col gap-6 lg:col-span-2 md:pr-10">
            <Link href="/">
              <div className="flex flex-col justify-center">
                <div className="flex items-center text-3xl tracking-tight uppercase text-white leading-none mb-1" style={{ fontFamily: "'Pixer', monospace" }}>
                  RHYTHM<span className="text-[#C084FC] ml-[1px] relative">
                    X
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#C084FC]"></span>
                  </span>
                </div>
                <div className="text-[#888888] text-[10px] tracking-[0.2em]" style={{ fontFamily: "'Pixer', monospace" }}>
                  SONIC REALITY ENGINE
                </div>
              </div>
            </Link>
            
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-medium">
              Welcome to RhythmX, where sonic reality meets visual precision. We are passionate about transforming how you experience music by combining real-time WebGL visualizers with 8D spatial audio and zero-latency device syncing. RhythmX is an open-source project designed for true audiophiles who want complete control over their soundscape without sacrificing performance or privacy.
            </p>
            
            <div className="flex items-center gap-3 mt-2">
              <Link aria-label="Twitter" href="#" className="p-2 border border-white/10 rounded-lg hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-all text-white/70">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link aria-label="Instagram" href="#" className="p-2 border border-white/10 rounded-lg hover:bg-[#E1306C]/20 hover:text-[#E1306C] hover:border-[#E1306C]/30 transition-all text-white/70">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link aria-label="Youtube" href="#" className="p-2 border border-white/10 rounded-lg hover:bg-[#FF0000]/20 hover:text-[#FF0000] hover:border-[#FF0000]/30 transition-all text-white/70">
                <Youtube className="w-4 h-4" />
              </Link>
              <Link aria-label="Github" href="https://github.com/CodeWithBasu/RhythmX" className="p-2 border border-white/10 rounded-lg hover:bg-white/20 hover:text-white hover:border-white/30 transition-all text-white/70">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Product</h3>
            <Link href="/player" className="text-white/60 hover:text-white transition-colors text-sm">Product Updates</Link>
            <Link href="/player" className="text-white/60 hover:text-white transition-colors text-sm">Web Player</Link>
            <Link href="/player" className="text-white/60 hover:text-white transition-colors text-sm">Party Sync</Link>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Resources</h3>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">Customer stories</Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">Product docs</Link>
            <Link href="https://github.com/CodeWithBasu/RhythmX" className="text-white/60 hover:text-white transition-colors text-sm">GitHub Repo</Link>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Company</h3>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">About</Link>
            <Link href="#" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              Careers
              <span className="text-[10px] font-bold tracking-wider bg-white/10 text-white/80 px-2 py-0.5 rounded-full uppercase">
                We're hiring
              </span>
            </Link>
          </div>

        </div>

        {/* Middle Section - Giant Outlined Text */}
        <div className="w-full flex justify-center py-4 sm:py-8 overflow-hidden select-none relative cursor-default group">
          {/* Purple Spotlight Background on Hover (Centered behind the whole word) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.4)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none z-0" />
          
          <h2 
            className="text-[15vw] leading-none font-bold tracking-tighter relative z-10 transition-all duration-700 group-hover:drop-shadow-[0_0_50px_rgba(192,132,252,0.5)]"
            style={{
              WebkitTextStroke: '2px rgba(255,255,255,0.5)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            }}
          >
            RHYTHMX
          </h2>
        </div>

        {/* Bottom Section - Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs text-white/50">
          <p>© {new Date().getFullYear()} RhythmX / Reject all substitutes</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

