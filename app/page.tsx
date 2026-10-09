import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RhythmX',
  description: 'Hang out on your phone',
};

export default function Home() {
  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden font-sans selection:bg-blue-200">
      
      {/* Background Bottom Clouds */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] pointer-events-none z-0 flex items-end">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 w-[150%] h-full text-[#F4F7FB] -ml-[25%]">
            <path d="M0,100 L100,100 L100,50 Q90,30 80,50 Q70,20 50,45 Q35,15 20,40 Q5,20 0,50 Z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 w-[120%] h-[80%] text-[#EBF1F8] -ml-[10%]">
            <path d="M0,100 L100,100 L100,60 Q85,40 70,60 Q55,35 40,55 Q20,30 0,60 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full px-6 pt-12 flex justify-between items-center z-20">
        <div className="w-16"></div> {/* Spacer for flex balance */}
        
        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
            <div className="w-5 h-1.5 bg-[#2563EB] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <Link href="/signin" className="px-5 py-2 bg-[#F0F5FF] text-[#2563EB] font-bold rounded-full text-sm hover:bg-blue-100 transition-colors">
            Login
        </Link>
      </div>
      
      {/* Center Mascot */}
      <div className="flex-1 relative z-10 flex items-center justify-center pt-20">
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Cloud Mascot Body */}
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#2563EB]" fill="currentColor">
                <path d="M140,150 C160,150 170,135 170,120 C170,105 160,95 150,95 C155,80 145,60 120,60 C110,40 85,35 70,55 C50,55 35,70 35,90 C20,95 10,110 15,125 C20,140 35,150 50,145 C60,155 80,160 95,150 C110,160 130,155 140,150 Z" />
            </svg>
            
            {/* Eyes */}
            <div className="absolute top-[48%] left-[42%] w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-[48%] left-[52%] w-3 h-3 bg-white rounded-full"></div>
            
            {/* Phone & Hand */}
            <div className="absolute top-[52%] left-[62%] w-8 h-14 bg-[#111827] rounded-md border-2 border-[#1F2937] shadow-xl transform rotate-12">
                <div className="absolute top-1 right-1 w-2 h-2 bg-[#60A5FA] rounded-sm"></div>
            </div>
            
            {/* Hand overlapping phone */}
            <div className="absolute top-[65%] left-[58%] w-8 h-10 bg-[#2563EB] rounded-full transform -rotate-12 shadow-sm"></div>
            <div className="absolute top-[60%] left-[75%] w-5 h-8 bg-[#2563EB] rounded-full transform rotate-45 shadow-sm"></div>
        </div>
      </div>

      {/* Bottom Content (Wrapped in Link to access app) */}
      <Link href="/player" className="w-full flex flex-col items-center justify-end pb-10 relative z-20 px-8 cursor-pointer group">
         <h1 className="text-[44px] leading-[1.1] font-black text-[#0B192C] text-center tracking-tight mb-6" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
            Hang out on <br/> your phone
         </h1>
         <p className="text-[#4A5568] text-center text-[15px] mb-20 max-w-[300px] leading-relaxed">
            Realtime social widgets with friends, because not everything requires a DM.
         </p>
         
         <p className="text-[#9CA3AF] text-[10px] text-center leading-relaxed max-w-[320px] group-hover:text-blue-500 transition-colors">
            By joining Abode you acknowledge that you have read and agree to Abode's Terms & Conditions and Privacy Policy. <br/><span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">(Click anywhere here to enter RhythmX)</span>
         </p>
      </Link>
    </div>
  );
}
