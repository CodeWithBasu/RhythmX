import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""        <div className="flex flex-col min-h-screen w-full relative">
        \{/\* Collapse Button \*/\}.*?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>"""

# Since parsing exact closing tags is hard with regex, I'll replace everything from `Collapse Button` to the end of the `Expanded Player` container. Let's find exactly what to replace.

target2 = r"""        <div className="flex flex-col min-h-screen w-full relative">.*?<audio ref=\{audioRef\} />"""

replacement2 = """        <div className="flex flex-col min-h-screen w-full relative pt-12 pb-8 px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-20 relative">
            <button 
              onClick={() => setIsPlayerExpanded(false)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
            </button>
            <span className="text-white font-medium text-lg tracking-wide drop-shadow-md">Music play</span>
            <button className="w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 flex items-center justify-center hover:bg-red-500/30 transition-all shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </button>
          </div>

          {/* Title Area */}
          <div className="text-center mt-12 z-20 relative px-4">
             <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg leading-tight">{currentTrack.replace('~/', '').trim()}</h1>
             <p className="text-white/60 text-lg">{currentSongObj?.artist || 'Various Artists'}</p>
          </div>

          {/* Circular Visualizer Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative my-8">
             {/* Concentric rings */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-white/5 absolute"></div>
                <div className="w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full border border-white/5 absolute"></div>
                <div className="w-[400px] h-[400px] sm:w-[480px] sm:h-[480px] rounded-full border border-white/5 absolute"></div>
             </div>

             {/* The glowing orb / album art */}
             <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-20">
                <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
                   {albumArtUrl ? (
                      <img src={albumArtUrl} alt="Album Art" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full bg-black/40 flex items-center justify-center">
                         <Headphones className="w-16 h-16 text-white/40" />
                      </div>
                   )}
                   <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                </div>
             </div>
             
             {/* WebGL bars placed creatively below or hidden, or just mapped to a circle (advanced). We'll keep them as hidden data elements or a subtle arc if needed. We'll hide them to match mockup. */}
             <div className="absolute inset-0 opacity-0 pointer-events-none">
                {Array.from({ length: activeBars }).map((_, index) => (
                  <div key={index} id={`visualizer-bar-${index}`} />
                ))}
             </div>
          </div>

          {/* Controls Area */}
          <div className="z-20 relative w-full max-w-md mx-auto">
             {/* Progress */}
             <div className="flex items-center justify-center mb-8 gap-4 px-2">
                <span className="text-white/60 text-xs font-medium w-10 text-right">{formatTime(currentTime)}</span>
                <div 
                   className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect()
                     const percent = (e.clientX - rect.left) / rect.width
                     if(duration) {
                       const newTime = percent * duration
                       if (audioRef.current) audioRef.current.currentTime = newTime
                       setCurrentTime(newTime)
                     }
                   }}
                >
                   <div className="absolute top-0 left-0 bottom-0 bg-white/80 rounded-full" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}></div>
                </div>
                <span className="text-white/60 text-xs font-medium w-10 text-left">{formatTime(duration)}</span>
             </div>

             {/* Playback Buttons */}
             <div className="flex items-center justify-between px-2">
                <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 transition-all ${isShuffle ? 'text-white' : 'text-white/40 hover:text-white/80'}`}>
                   <Shuffle className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6">
                   <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all">
                      <SkipBack className="w-5 h-5" />
                   </button>
                   <button onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                      {isPlaying ? (
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                      ) : (
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      )}
                   </button>
                   <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all">
                      <SkipForward className="w-5 h-5" />
                   </button>
                </div>
                <button onClick={() => setIsRepeat(!isRepeat)} className={`p-2 transition-all ${isRepeat ? 'text-white' : 'text-white/40 hover:text-white/80'}`}>
                   <Repeat className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        <audio ref={audioRef} />"""

content = re.sub(target2, replacement2, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced expanded player")
