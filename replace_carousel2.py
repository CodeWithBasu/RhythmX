import sys
with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# find start and end of SongCarousel
start_marker = "const SongCarousel = "
start_idx = code.find(start_marker)

end_marker = "export default function Component() {"
end_idx = code.find(end_marker, start_idx)

new_carousel = """const SongCarousel = ({ title, songs, onPlay }: { title: string, songs: any[], onPlay: (song: any) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [songs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateScrollState, 400);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <div className="relative group -mx-4">
        
        {/* Left Shadow & Arrow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent z-[5] pointer-events-none" />
        )}
        <button 
          onClick={() => scroll('left')}
          className={`hidden md:flex absolute left-2 top-[60px] sm:top-[80px] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105 ${!canScrollLeft && 'hidden'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div ref={scrollRef} onScroll={updateScrollState} className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar px-4 scroll-smooth relative z-[1]">
          {songs.map((song) => (
            <div 
              key={`carousel-${title}-${song.id}`} 
              onClick={() => onPlay(song)} 
              className="snap-start shrink-0 w-[120px] sm:w-[160px] cursor-pointer group/item"
            >
              <div className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] mb-3">
                <div className="w-full h-full rounded-md overflow-hidden relative shadow-lg">
                  <GridAlbumArt song={song} />
                  <div className="absolute top-2 left-2">
                    <img src="/rhythmx-logo.png" className="w-4 h-4 rounded-sm opacity-80" />
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-white/90 text-sm truncate">{song.title}</h3>
              <p className="text-white/60 text-xs line-clamp-2 mt-1 leading-tight">{song.artist || 'Various Artists'}</p>
            </div>
          ))}
        </div>

        {/* Right Shadow & Arrow */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#121212] via-[#121212]/80 to-transparent z-[5] pointer-events-none" />
        )}
        <button 
          onClick={() => scroll('right')}
          className={`hidden md:flex absolute right-2 top-[60px] sm:top-[80px] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105 ${!canScrollRight && 'hidden'}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
"""

code = code[:start_idx] + new_carousel + code[end_idx:]

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated SongCarousel completely")
