"use client";

import Link from "next/link";
import { Mail, Twitter, Instagram, Github, Youtube, Heart } from "lucide-react";

const navigation = {
  categories: [
    {
      id: "rhythmx",
      name: "RhythmX",
      sections: [
        {
          id: "product",
          name: "Product",
          items: [
            { name: "Music Player", href: "/player" },
            { name: "WebGL Visualizer", href: "/player" },
            { name: "Party Mode Sync", href: "/player" },
          ],
        },
        {
          id: "resources",
          name: "Resources",
          items: [
            { name: "GitHub Repo", href: "https://github.com/CodeWithBasu/RhythmX" },
            { name: "Download APK", href: "https://github.com/CodeWithBasu/RhythmX/releases" },
            { name: "Developer API", href: "#" },
          ],
        },
        {
          id: "legal",
          name: "Company",
          items: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "#" },
            { name: "Contact Us", href: "#" },
          ],
        },
      ],
    },
  ],
};


export function Footer() {
  return (
    <footer className="border-white/10 mx-auto w-full border-t px-4 bg-[#0C0414] relative z-20">
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex md:justify-start">
        <Link href="/">
          <div className="flex flex-col justify-center ml-1">
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
        <p className="bg-transparent text-center text-xs leading-relaxed text-white/50 md:text-left max-w-2xl md:ml-12 mt-4 md:mt-0">
          Welcome to RhythmX, where sonic reality meets visual precision. 
          We are passionate about transforming how you experience music by combining 
          real-time WebGL visualizers with 8D spatial audio and zero-latency 
          device syncing. RhythmX is an open-source project designed for true 
          audiophiles who want complete control over their soundscape without 
          sacrificing performance or privacy.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-white/5"> </div>
        <div className="py-10">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-2 md:grid-cols-3 flex-row justify-between gap-8 leading-6 md:flex md:gap-32"
            >
              {category.sections.map((section) => (
                <div key={section.name}>
                  <h3 className="text-white font-semibold mb-4 tracking-wide text-sm">{section.name}</h3>
                  <ul
                    role="list"
                    className="flex flex-col space-y-3"
                  >
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <Link
                          href={item.href}
                          className="text-sm text-white/40 hover:text-[#C084FC] transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-b border-white/5"> </div>
      </div>

      <div className="flex flex-wrap justify-center gap-y-6 md:justify-center items-center mx-auto max-w-7xl px-6 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 w-full md:w-auto">
          <Link aria-label="Mail" href="#" className="hover:-translate-y-1 transition-transform text-[#EA4335] hover:opacity-80">
            <Mail strokeWidth={2} className="h-5 w-5" />
          </Link>
          <Link aria-label="Twitter" href="#" className="hover:-translate-y-1 transition-transform text-[#1DA1F2] hover:opacity-80">
            <Twitter strokeWidth={2} className="h-5 w-5" />
          </Link>
          <Link aria-label="Instagram" href="#" className="hover:-translate-y-1 transition-transform text-[#E1306C] hover:opacity-80">
            <Instagram strokeWidth={2} className="h-5 w-5" />
          </Link>
          <Link aria-label="Github" href="https://github.com/CodeWithBasu/RhythmX" className="hover:-translate-y-1 transition-transform text-white hover:opacity-80">
            <Github strokeWidth={2} className="h-5 w-5" />
          </Link>
          <Link aria-label="Youtube" href="#" className="hover:-translate-y-1 transition-transform text-[#FF0000] hover:opacity-80">
            <Youtube strokeWidth={2} className="h-5 w-5" />
          </Link>
        </div>
        
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-white/40">
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span>Made with</span>
          <Heart className="text-[#C084FC] mx-1 h-3 w-3 animate-pulse fill-[#C084FC]" />
          <span> by </span>
          <span className="hover:text-[#C084FC] cursor-pointer text-white transition-colors">
            <Link aria-label="Author" className="font-bold tracking-wider" href="https://github.com/CodeWithBasu" target="_blank">
              Basudev
            </Link>
          </span>
          -
          <span className="hover:text-[#C084FC] cursor-pointer transition-colors tracking-widest">
            <Link aria-label="Project" href="/">
              RHYTHMX
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

