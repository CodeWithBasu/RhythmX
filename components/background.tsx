import React from 'react'
import { memo } from 'react'

// Using React.memo prevents this static background from re-rendering
// when parent states change, keeping CPU usage strictly at 0%
const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      
      {/* 
        NO BLUR FILTERS (filter: blur())!
        Blur filters over large areas completely destroy GPU framerates and cause 
        audio visualizers to lag. We use pre-calculated radial-gradients instead.
      */}

      {/* Top Left Deep Purple Glow */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[150vw] h-[150vw] md:w-[70vw] md:h-[70vw] rounded-full opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(120, 30, 255, 0.4) 0%, rgba(120, 30, 255, 0) 70%)',
          animation: 'float1 20s ease-in-out infinite alternate',
          willChange: 'transform' // Hardware acceleration
        }}
      />

      {/* Bottom Right Blue Glow */}
      <div 
        className="absolute -bottom-[20%] -right-[10%] w-[130vw] h-[130vw] md:w-[60vw] md:h-[60vw] rounded-full opacity-20 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 150, 255, 0.4) 0%, rgba(0, 150, 255, 0) 70%)',
          animation: 'float2 25s ease-in-out infinite alternate-reverse',
          willChange: 'transform' // Hardware acceleration
        }}
      />

      {/* Center Subtle Pink Core */}
      <div 
        className="absolute top-[30%] left-[20%] w-[120vw] h-[120vw] md:w-[50vw] md:h-[50vw] rounded-full opacity-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 50, 150, 0.3) 0%, rgba(255, 50, 150, 0) 70%)',
          animation: 'float3 30s ease-in-out infinite alternate',
          willChange: 'transform' // Hardware acceleration
        }}
      />

      {/* 
        Ultra-cheap Noise/Grain Overlay
        Adding grain hides the CSS gradient banding and makes it look premium
        SVG data URI is significantly lighter than loading an external image
      */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float1 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(5%, 5%, 0) scale(1.1); }
        }
        @keyframes float2 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(-5%, -10%, 0) scale(1.05); }
        }
        @keyframes float3 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(10%, -5%, 0) scale(1.15); }
        }
      `}} />
    </div>
  )
}

export default memo(Background)
