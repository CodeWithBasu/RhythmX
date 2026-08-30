"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Headphones, Share2, Zap, Music, Sparkles, Smartphone, ArrowRight, Github } from 'lucide-react'
import TextType from '@/components/ui/TextType'

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)
  const [previewBars, setPreviewBars] = useState<number[]>(new Array(40).fill(10))

  // Mouse move effect for background gradient
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = (e.clientY / window.innerHeight) * 2 - 1
    setMousePos({ x, y })
  }

  // Visualizer Animation Preview
  useEffect(() => {
    let interval: any
    if (isPlayingPreview) {
      interval = setInterval(() => {
        setPreviewBars(prev => 
          prev.map(() => Math.floor(Math.random() * 80) + 15)
        )
      }, 100)
    } else {
      // Quiet wave
      interval = setInterval(() => {
        setPreviewBars(prev => 
          prev.map((val, idx) => {
            const centerDist = Math.abs(idx - 20)
            const target = Math.max(5, 25 - centerDist * 1.2)
            return target + Math.sin(Date.now() / 200 + idx) * 3
          })
        )
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isPlayingPreview])

  return (
    <div 
      className="min-h-screen bg-[#030303] text-white overflow-x-hidden relative font-sans selection:bg-purple-500/30 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Background Cyber-Grid & Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[length:50px_50px]" 
        />
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[180px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`
          }}
        />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/rhythmx-logo.png" 
              alt="RhythmX Logo" 
              className="w-9 h-9 rounded-lg shadow-lg shadow-purple-500/10" 
            />
            <div className="absolute inset-0 rounded-lg bg-purple-500/5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white">
              RHYTHM<span className="text-purple-500 underline decoration-2 underline-offset-4">X</span>
            </h1>
            <p className="text-[7px] text-white/40 font-mono tracking-widest uppercase">Sonic Reality Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/CodeWithBasu/RhythmX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white p-2 transition-colors hidden sm:inline-flex items-center gap-2 text-xs font-mono tracking-wider"
          >
            <Github size={16} /> GitHub
          </a>
          <Link 
            href="/player"
            className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            Launch Player
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles size={12} className="animate-pulse" /> Mobile App & Visualizer
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-none text-white">
            BEYOND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
              VISUALIZATION
            </span>
          </h2>

          <div className="h-10 text-lg md:text-xl text-white/70 font-mono">
            <TextType 
              words={[
                "FEEL THE RHYTHM IN YOUR MIND",
                "SYNC AUDIO IN PERFECT TIME",
                "8D SPATIAL SOUNDSTAGE ENGAGED",
                "CHOOSE YOUR NEON PALETTE"
              ]}
              speed={80}
              delay={2000}
            />
          </div>

          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            RhythmX turns your audio library into a high-fidelity visual experience. Experience dynamically generated album art backdrops, spatial 8D panned audio, and zero-latency party listening across all your friends' devices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Link 
              href="/player"
              className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold uppercase tracking-widest text-center flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] border border-purple-500/30"
            >
              Open Web Player <ArrowRight size={16} />
            </Link>
            <a 
              href="https://github.com/CodeWithBasu/RhythmX/releases" 
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-widest text-center flex items-center justify-center gap-3 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <Smartphone size={16} className="text-cyan-400" /> Download APK
            </a>
          </div>
        </div>

        {/* Hero Visual Preview */}
        <div className="md:col-span-5 relative w-full h-[320px] sm:h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/5 rounded-3xl border border-white/5 backdrop-blur-sm p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Glossy highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Visualizer Simulator Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Engine Live Preview</span>
              </div>
              <div className="text-[10px] font-mono text-purple-400">96.8 FPS</div>
            </div>

            {/* Interactive Wave Bars */}
            <div className="flex items-end justify-center gap-[3px] h-36 w-full cursor-pointer relative z-10"
              onMouseEnter={() => setIsPlayingPreview(true)}
              onMouseLeave={() => setIsPlayingPreview(false)}
            >
              {previewBars.map((height, idx) => {
                const hue = 280 - (idx / 40) * 200
                return (
                  <motion.div 
                    key={idx}
                    className="w-1.5 rounded-t-full"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, hsl(${hue}, 90%, 65%) 0%, hsl(${hue}, 80%, 45%) 100%)`,
                      boxShadow: `0 0 12px hsla(${hue}, 90%, 65%, 0.4)`
                    }}
                    animate={{ height: `${height}%` }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )
              })}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px] rounded-lg">
                <span className="text-xs font-mono uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                  Hover to Play
                </span>
              </div>
            </div>

            {/* Player details */}
            <div className="flex items-center justify-between relative z-10 border-t border-white/5 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                  <Headphones size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white/80">Sonic Evolution</div>
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Spatial Audio mode</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
              >
                {isPlayingPreview ? (
                  <div className="flex gap-[2px]">
                    <div className="w-1 h-3 bg-black rounded-full" />
                    <div className="w-1 h-3 bg-black rounded-full" />
                  </div>
                ) : (
                  <svg className="w-3.5 h-3.5 fill-black ml-[2px]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">Sonic Engine Spec</span>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white">FEATURES ENGAGED</h3>
          <p className="text-white/50 text-sm">Experience native-level premium audio enhancements built completely on lightweight web technology.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/[0.02] transition-all group duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Headphones size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">8D Spatial Stage</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Enables native-level dynamic audio panning that orbits left to right, bringing concert halls straight into your headphones.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 hover:bg-pink-500/[0.02] transition-all group duration-300">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Share2 size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Zero-Latency Sync</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Listen in perfect sync with group members. Using socket frameworks, we guarantee sub-50ms sync alignment.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] transition-all group duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Music size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Cloud Library</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Direct integration bypasses normal local limits. Upload and stream high-capacity files securely to the cloud.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/[0.02] transition-all group duration-300">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Visualizer Themes</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Switch themes in real-time. Choose Synthwave, Cyber Matrix, Neon Pulse, or Deep Ocean colorways to fit your mood.
            </p>
          </div>
        </div>
      </section>

      {/* Info Stats Section */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">&lt;50ms</div>
            <div className="text-[10px] md:text-xs font-mono tracking-widest text-white/40 uppercase">Sync Delay</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2 tracking-tight">100%</div>
            <div className="text-[10px] md:text-xs font-mono tracking-widest text-white/40 uppercase">Open Source</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-cyan-400 mb-2 tracking-tight">4+</div>
            <div className="text-[10px] md:text-xs font-mono tracking-widest text-white/40 uppercase">Visual Themes</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Unlimited</div>
            <div className="text-[10px] md:text-xs font-mono tracking-widest text-white/40 uppercase">Cloud Storage</div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
            LAUNCH THE SONIC REALITY
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Ready to experience your music in a whole new dimension? Choose your gateway and start listening.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link 
              href="/player"
              className="px-8 py-4 rounded-xl bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl hover:scale-105"
            >
              Open in Browser
            </Link>
            <a 
              href="https://github.com/CodeWithBasu/RhythmX/releases"
              className="px-8 py-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
            >
              Install Mobile App
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#010101] py-12 text-white/50 text-xs text-center font-mono">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="uppercase tracking-[0.2em] font-light text-white/40">RhythmX Engine v0.1</span>
          </div>

          <div className="flex gap-6 uppercase tracking-wider text-[10px] text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/10">|</span>
            <Link href="/player" className="hover:text-white transition-colors">Open Player</Link>
          </div>

          <div className="text-[10px] text-white/20">
            &copy; 2026 RhythmX // Designed by Basudev
          </div>
        </div>
      </footer>
    </div>
  )
}
