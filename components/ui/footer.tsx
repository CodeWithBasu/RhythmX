"use client";

import Link from "next/link";
import { Twitter, Instagram, Youtube, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0C0414] text-white py-12 px-6 md:px-12 relative z-20 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-6 max-w-sm">
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              RhythmX is the modern and intuitive way to listen & visualize your music.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Twitter className="w-5 h-5 text-white/70" />
              </Link>
              <Link href="#" className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Instagram className="w-5 h-5 text-white/70" />
              </Link>
              <Link href="#" className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Youtube className="w-5 h-5 text-white/70" />
              </Link>
              <Link href="https://github.com/CodeWithBasu/RhythmX" className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Github className="w-5 h-5 text-white/70" />
              </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Product</h3>
            <Link href="/player" className="text-white/60 hover:text-white transition-colors text-base">Product Updates</Link>
            <Link href="/player" className="text-white/60 hover:text-white transition-colors text-base">Web Player</Link>
            <Link href="/player" className="text-white/60 hover:text-white transition-colors text-base">Party Sync</Link>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Resources</h3>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">Customer stories</Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">Product docs</Link>
            <Link href="https://github.com/CodeWithBasu/RhythmX" className="text-white/60 hover:text-white transition-colors text-base">GitHub Repo</Link>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-white">Company</h3>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">About</Link>
            <Link href="#" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-base">
              Careers
              <span className="text-[10px] font-bold tracking-wider bg-white/10 text-white/80 px-2 py-0.5 rounded-full uppercase">
                We're hiring
              </span>
            </Link>
          </div>

        </div>

        {/* Middle Section - Giant Outlined Text */}
        <div className="w-full flex justify-center py-4 sm:py-8 overflow-hidden pointer-events-none select-none">
          <h2 
            className="text-[15vw] leading-none font-bold tracking-tighter"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-sm text-white/50">
          <p>© {new Date().getFullYear()} RhythmX / Reject all substitutes</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

