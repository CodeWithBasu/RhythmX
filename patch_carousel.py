import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""        \{/\* Left Shadow & Arrow \*/\}
        \{canScrollLeft && \(
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-\[#121212\] via-\[#121212\]/80 to-transparent z-\[5\] pointer-events-none" />
        \)\}
.*?
        \{/\* Right Shadow & Arrow \*/\}
        \{canScrollRight && \(
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-\[#121212\] via-\[#121212\]/80 to-transparent z-\[5\] pointer-events-none" />
        \)\}"""

replacement = """        {/* Left Shadow & Arrow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/50 to-transparent z-[5] pointer-events-none" />
        )}
        <button 
          onClick={() => scroll('left')}
          className={`hidden md:flex absolute left-2 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105 ${!canScrollLeft && 'hidden'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div ref={scrollRef} onScroll={updateScrollState} className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar px-4 scroll-smooth relative z-[1]">
          {songs.map((song) => (
            <div 
              key={`carousel-${title}-${song.id}`} 
              onClick={() => onPlay(song)} 
              className="snap-start shrink-0 w-[140px] sm:w-[160px] cursor-pointer group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-3 hover:bg-white/10 transition-all"
            >
              <div className="w-full aspect-square mb-3 relative rounded-2xl overflow-hidden shadow-lg border border-white/5">
                  <GridAlbumArt song={song} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
              </div>
              <h3 className="font-bold text-white text-sm truncate px-1">{song.title}</h3>
              <p className="text-white/60 text-xs truncate px-1 mt-0.5">{song.artist || 'Various Artists'}</p>
            </div>
          ))}
        </div>

        {/* Right Shadow & Arrow */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/50 to-transparent z-[5] pointer-events-none" />
        )}"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced carousel")
