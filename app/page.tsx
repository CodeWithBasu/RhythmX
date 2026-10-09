import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RhythmX | Sonic Reality Engine',
  description: 'Smarter Music Visualizer Powered by Advanced Audio Engine',
};

export default function Home() {
  return (
    <div className="h-[100dvh] w-full bg-[#0a0002] flex flex-col relative overflow-hidden font-sans">
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60vh] bg-red-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50vh] bg-red-900/30 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>
      
      {/* Top Graphic Section */}
      <div className="flex-1 relative flex items-center justify-center pt-8 pb-4">
         <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            
            {/* Decorative Floating Cards (Background) */}
            <div className="absolute top-[10%] left-[15%] w-28 h-36 bg-gradient-to-br from-white/10 to-transparent rounded-[24px] border border-white/10 shadow-2xl -rotate-12 backdrop-blur-md animate-[pulse_4s_ease-in-out_infinite] flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 rounded-full border-[4px] border-white/5 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white/20"></div>
                </div>
            </div>
            
            <div className="absolute bottom-[20%] right-[10%] w-32 h-40 bg-gradient-to-tl from-red-600/20 to-transparent rounded-[24px] border border-white/10 shadow-2xl rotate-12 backdrop-blur-md animate-[pulse_5s_ease-in-out_infinite_reverse] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </div>

            {/* Center Logo Block */}
            <div className="relative z-20 w-28 h-28 bg-black rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer hover:scale-105 transition-transform duration-500">
              {/* Star/Sparkle Icon (similar to their reference) */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-transform duration-700 group-hover:rotate-180">
                <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" />
              </svg>
            </div>

         </div>
      </div>

      {/* Bottom Text/Actions Section */}
      <div className="w-full bg-black/60 backdrop-blur-3xl rounded-t-[40px] px-8 pt-12 pb-16 flex flex-col items-center border-t border-white/5 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         <h1 className="text-[32px] md:text-5xl font-extrabold text-center tracking-tight mb-4 text-white leading-tight">
            Your journey into <br/> music starts here
         </h1>
         <p className="text-white/50 text-center text-[13px] md:text-sm mb-10 max-w-[280px] leading-relaxed">
            Experience spatial audio, synchronized lyrics, and immersive aesthetics all in one place.
         </p>
         
         <Link href="/player" className="w-full max-w-[320px] bg-white text-black font-bold text-lg py-4 rounded-full flex items-center justify-center hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)] mb-8">
            Get Started
         </Link>

         <p className="text-white/40 text-[11px] md:text-xs">
            Already have an account? <Link href="/signin" className="text-white font-bold ml-1 hover:underline">Login</Link>
         </p>
      </div>
    </div>
  );
}
