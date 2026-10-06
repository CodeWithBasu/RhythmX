import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""          \{/\* Quick Play / Trending Grid \*/\}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">.*?</div>
            \}\)
            
                        \{/\* Home Screen Rows \*/}"""

replacement = """          {/* Quick Play / Trending Grid */}
          
          {/* Trending Card (Glass UI) */}
          {songs.length > 0 && (
            <div 
              onClick={() => { playSong(songs[0]); setIsPlayerExpanded(true); }}
              className="relative w-full h-[320px] rounded-[32px] overflow-hidden cursor-pointer shadow-2xl group border border-white/20"
            >
              <div className="absolute inset-0 bg-black/20 z-10"></div>
              <div className="absolute inset-0 z-0">
                 <GridAlbumArt song={songs[0]} />
              </div>
              
              <div className="absolute top-4 left-4 z-20">
                 <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-sm font-medium border border-white/20">Trending</div>
              </div>
              
              <div className="absolute top-4 right-4 z-20">
                 <button onClick={(e) => toggleLike(songs[0].id, e)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill={likedSongs.includes(songs[0].id) ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                 </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                 <div className="flex items-end justify-between">
                    <div>
                       <h2 className="text-white text-3xl font-bold mb-1 drop-shadow-md">{songs[0].title}</h2>
                       <p className="text-white/80 text-sm">{songs[0].artist || 'Various Artists'}</p>
                    </div>
                    <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform shrink-0">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                 </div>
              </div>
            </div>
          )}

          {/* Skeleton Loading Rows */}
            {isLoadingSongs && (
              <>
                <section>
                  <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={`hits-skel-${i}`} className="shrink-0 w-[160px] sm:w-[180px] animate-pulse">
                        <div className="w-[160px] sm:w-[180px] h-[200px] sm:h-[220px] mb-3 bg-white/10 rounded-[24px]" />
                        <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
            
                        {/* Home Screen Rows */}"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced quick play section")
