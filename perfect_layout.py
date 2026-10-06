with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update the Expanded Player wrapper
old_wrapper = """      {/* EXPANDED PLAYER (Visualizer) */}
      <div 
        className={`fixed inset-0 z-50 bg-[#0C0414] flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isPlayerExpanded ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Collapse Button */}"""
new_wrapper = """      {/* SCROLLBAR STYLES */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* EXPANDED PLAYER (Visualizer) */}
      <div 
        className={`fixed inset-0 z-50 bg-[#0C0414] overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isPlayerExpanded ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex flex-col min-h-screen w-full relative">
        {/* Collapse Button */}"""
code = code.replace(old_wrapper, new_wrapper)

# 2. Add Scrollable Cards and close TOP WRAPPER
old_end = """            </div>

          </div>
        </div>
      </div>
      
      {/* Modals & Audio Element */}"""
new_end = """            </div>

          </div>
        </div>
        </div>

        {/* SCROLLABLE BELOW CARDS SECTION */}
        {isPlayerExpanded && (
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8 relative z-20 pb-32">
            
            {/* LYRICS PREVIEW CARD */}
            {lyrics.length > 0 ? (
              <div className="bg-[#603B2C] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-lg">Lyrics</h3>
                  <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                    Show full
                  </button>
                </div>
                
                <div className="flex flex-col gap-3 relative max-h-[300px] overflow-hidden">
                  {lyrics.map((line, i) => {
                    const isActive = i === currentLyricIndex;
                    const isPast = i < currentLyricIndex;
                    if (Math.abs(i - currentLyricIndex) > 4 && currentLyricIndex !== -1) return null;
                    return (
                      <div 
                        key={i} 
                        className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
                          isActive ? 'text-white scale-105 origin-left' : 
                          isPast ? 'text-white/40' : 'text-white/20'
                        }`}
                      >
                        {line.text || '♪'}
                      </div>
                    )
                  })}
                  {currentLyricIndex === -1 && (
                     <div className="text-xl sm:text-2xl font-bold text-white/50">
                        {lyrics.slice(0, 4).map((l,i) => <div key={i} className="mb-3">{l.text || '♪'}</div>)}
                     </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#603B2C] to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden text-center">
                <h3 className="text-white font-bold text-lg mb-2">Lyrics</h3>
                <p className="text-white/40">{isFetchingLyrics ? 'Loading lyrics...' : 'No lyrics available for this song.'}</p>
              </div>
            )}

            {/* ABOUT THE ARTIST CARD */}
            <div className="bg-[#181818] rounded-2xl overflow-hidden shadow-2xl">
               <div className="relative h-64 overflow-hidden">
                  {albumArtUrl ? (
                    <>
                      <img src={albumArtUrl} className="absolute inset-0 w-full h-full object-cover blur-md brightness-50" />
                      <img src={albumArtUrl} className="absolute inset-0 w-full h-full object-contain" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                       <span className="text-white/20">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 font-bold text-white shadow-sm drop-shadow-md z-10">
                     About the artist
                  </div>
               </div>
               <div className="p-6">
                 <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">#1 in Top Artists</p>
                      <h3 className="text-white font-bold text-2xl flex items-center gap-2">
                         {currentSongObj?.artist || 'Unknown Artist'}
                         <span className="bg-blue-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">✓</span>
                      </h3>
                      <p className="text-white/60 text-sm">6.1Cr monthly listeners</p>
                    </div>
                    <button className="border border-white/40 text-white rounded-full px-4 py-1.5 text-sm font-bold hover:scale-105 hover:border-white transition-all">
                      Follow
                    </button>
                 </div>
                 <p className="text-white/80 text-sm line-clamp-3">
                   Celebrating and sharing love for music with all of you. RhythmX exclusive insights.
                 </p>
               </div>
            </div>

            {/* EXPLORE ARTIST CARD */}
            <div className="bg-[#181818] rounded-2xl p-6 shadow-2xl mb-8">
               <h3 className="text-white font-bold text-lg mb-4">Explore {currentSongObj?.artist || 'Artist'}</h3>
               <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                  <div className="w-32 shrink-0 snap-start">
                     <div className="w-full aspect-square bg-white/10 rounded-lg overflow-hidden relative">
                       {albumArtUrl && <img src={albumArtUrl} className="w-full h-full object-cover" />}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                       <span className="absolute bottom-2 left-2 right-2 font-bold text-white text-sm line-clamp-2">Songs by {currentSongObj?.artist || 'Artist'}</span>
                     </div>
                  </div>
                  <div className="w-32 shrink-0 snap-start">
                     <div className="w-full aspect-square bg-white/10 rounded-lg overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-pink-500/50" />
                       {albumArtUrl && <img src={albumArtUrl} className="w-full h-full object-cover mix-blend-overlay opacity-50" />}
                       <span className="absolute bottom-2 left-2 right-2 font-bold text-white text-sm line-clamp-2">Similar Artists</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        )}
      </div>
      
      {/* Modals & Audio Element */}"""
code = code.replace(old_end, new_end)

# 3. Add Lyrics Sync
lyric_sync = """  // Sync lyrics with audio time
  useEffect(() => {
    if (lyrics.length > 0 && currentTime > 0) {
      const idx = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1]
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
      })
      if (idx !== -1 && idx !== currentLyricIndex) {
        setCurrentLyricIndex(idx)
      }
    }
  }, [currentTime, lyrics, currentLyricIndex])
"""
code = code.replace("  // Handle audio events", lyric_sync + "\n  // Handle audio events")

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied perfect layout")
