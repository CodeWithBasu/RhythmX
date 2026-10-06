import sys
import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add ChevronLeft and ChevronRight imports
if 'ChevronLeft' not in code:
    code = code.replace('ChevronDown, User', 'ChevronDown, User, ChevronLeft, ChevronRight')

# 2. Add SongCarousel component definition
carousel_def = """
const SongCarousel = ({ title, songs, onPlay }: { title: string, songs: any[], onPlay: (song: any) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <div className="relative group -mx-4">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-0 bottom-4 w-16 items-center justify-center bg-gradient-to-r from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white"
        >
          <ChevronLeft className="w-10 h-10 drop-shadow-md" />
        </button>

        {/* Scroll Container */}
        <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar px-4 scroll-smooth">
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

        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-0 bottom-4 w-16 items-center justify-center bg-gradient-to-l from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white"
        >
          <ChevronRight className="w-10 h-10 drop-shadow-md" />
        </button>
      </div>
    </section>
  );
};
"""

# Insert it before export default function Component
if 'const SongCarousel =' not in code:
    code = code.replace('export default function Component() {', carousel_def + '\nexport default function Component() {')

# 3. Replace the actual sections with SongCarousel usage
# We will do a robust string replacement.
hits_start = code.find("{/* Today's biggest hits */}")
chill_end = code.find('</main>', hits_start)

if hits_start != -1 and chill_end != -1:
    old_sections = code[hits_start:chill_end]
    new_sections = """{/* Today's biggest hits */}
            {songs.length > 0 && (
              <SongCarousel 
                title="Today's biggest hits" 
                songs={songs.slice(0, 8)} 
                onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
              />
            )}

            {/* Chill */}
            {songs.length > 2 && (
              <SongCarousel 
                title="Chill" 
                songs={songs.slice(2, 10)} 
                onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
              />
            )}
          """
    code = code[:hits_start] + new_sections + code[chill_end:]
else:
    print("Could not find section markers")


with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied Carousel with arrows")
