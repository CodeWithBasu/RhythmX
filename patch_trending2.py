import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""          \{/\* Quick Play / Trending Grid \*/\}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            
            \{/\* Liked Songs Tile \*/\}.*?\{/\* Skeleton Loading Rows \*/\}"""

replacement = """          {/* Trending Card (Glass UI) */}
          {songs.length > 0 && (
            <div className="flex overflow-x-auto gap-4 hide-scrollbar px-6 pb-4 -mx-6">
              <div 
                onClick={() => { playSong(songs[0]); setIsPlayerExpanded(true); }}
                className="relative w-[280px] h-[280px] shrink-0 rounded-[40px] overflow-hidden cursor-pointer shadow-2xl group border border-white/20 p-5 flex flex-col justify-between"
              >
                <div className="absolute inset-0 z-0">
                  <GridAlbumArt song={songs[0]} />
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4a0210]/90 via-[#4a0210]/20 to-transparent"></div>
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-[10px] font-bold tracking-wide border border-white/20 shadow-sm">Trending</div>
                  <div className="w-8 h-8 rounded-full bg-[#8b1521]/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <h2 className="text-white text-lg font-bold mb-0.5 drop-shadow-md">{songs[0].title}</h2>
                    <p className="text-white/80 text-[10px]">By {songs[0].artist || 'Various Artists'} • 25 Music</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:scale-105 transition-transform shrink-0 shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </button>
                </div>
              </div>
              
              {songs.length > 1 && (
                <div 
                  onClick={() => { playSong(songs[1]); setIsPlayerExpanded(true); }}
                  className="relative w-[280px] h-[280px] shrink-0 rounded-[40px] overflow-hidden cursor-pointer shadow-2xl group border border-white/20 p-5 flex flex-col justify-between"
                >
                  <div className="absolute inset-0 z-0 opacity-80">
                    <GridAlbumArt song={songs[1]} />
                    <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skeleton Loading Rows */}"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied trending card")
