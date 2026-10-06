import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = r'(\s*)\{\/\*\s*Modals & Audio Element\s*\*\/\}'

new_bottom = r"""\1</div>
\1{/* SCROLLABLE BELOW CARDS SECTION */}
\1{isPlayerExpanded && (
\1  <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8 relative z-20 pb-32">
\1    
\1    {/* LYRICS PREVIEW CARD */}
\1    {lyrics.length > 0 ? (
\1      <div className="bg-[#603B2C] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
\1        <div className="flex justify-between items-center mb-6">
\1          <h3 className="text-white font-bold text-lg">Lyrics</h3>
\1          <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">
\1            Show full
\1          </button>
\1        </div>
\1        
\1        <div className="flex flex-col gap-3 relative max-h-[300px] overflow-hidden">
\1          {lyrics.map((line, i) => {
\1            const isActive = i === currentLyricIndex;
\1            const isPast = i < currentLyricIndex;
\1            if (Math.abs(i - currentLyricIndex) > 4 && currentLyricIndex !== -1) return null;
\1            return (
\1              <div 
\1                key={i} 
\1                className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
\1                  isActive ? 'text-white scale-105 origin-left' : 
\1                  isPast ? 'text-white/40' : 'text-white/20'
\1                }`}
\1              >
\1                {line.text || '♪'}
\1              </div>
\1            )
\1          })}
\1          {currentLyricIndex === -1 && (
\1             <div className="text-xl sm:text-2xl font-bold text-white/50">
\1                {lyrics.slice(0, 4).map((l,i) => <div key={i} className="mb-3">{l.text || '♪'}</div>)}
\1             </div>
\1          )}
\1          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#603B2C] to-transparent pointer-events-none" />
\1        </div>
\1      </div>
\1    ) : (
\1      <div className="bg-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden text-center">
\1        <h3 className="text-white font-bold text-lg mb-2">Lyrics</h3>
\1        <p className="text-white/40">{isFetchingLyrics ? 'Loading lyrics...' : 'No lyrics available for this song.'}</p>
\1      </div>
\1    )}

\1    {/* ABOUT THE ARTIST CARD */}
\1    <div className="bg-[#181818] rounded-2xl overflow-hidden shadow-2xl">
\1       <div className="relative h-64 overflow-hidden">
\1          {albumArtUrl ? (
\1            <>
\1              <img src={albumArtUrl} className="absolute inset-0 w-full h-full object-cover blur-md brightness-50" />
\1              <img src={albumArtUrl} className="absolute inset-0 w-full h-full object-contain" />
\1            </>
\1          ) : (
\1            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
\1               <span className="text-white/20">No Image</span>
\1            </div>
\1          )}
\1          <div className="absolute top-4 left-4 font-bold text-white shadow-sm drop-shadow-md z-10">
\1             About the artist
\1          </div>
\1       </div>
\1       <div className="p-6">
\1         <div className="flex justify-between items-center mb-4">
\1            <div>
\1              <p className="text-white/60 text-sm font-medium mb-1">#1 in Top Artists</p>
\1              <h3 className="text-white font-bold text-2xl flex items-center gap-2">
\1                 {currentSongObj?.artist || 'Unknown Artist'}
\1                 <span className="bg-blue-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">✓</span>
\1              </h3>
\1              <p className="text-white/60 text-sm">6.1Cr monthly listeners</p>
\1            </div>
\1            <button className="border border-white/40 text-white rounded-full px-4 py-1.5 text-sm font-bold hover:scale-105 hover:border-white transition-all">
\1              Follow
\1            </button>
\1         </div>
\1         <p className="text-white/80 text-sm line-clamp-3">
\1           Celebrating and sharing love for music with all of you. RhythmX exclusive insights.
\1         </p>
\1       </div>
\1    </div>

\1    {/* EXPLORE ARTIST CARD */}
\1    <div className="bg-[#181818] rounded-2xl p-6 shadow-2xl mb-8">
\1       <h3 className="text-white font-bold text-lg mb-4">Explore {currentSongObj?.artist || 'Artist'}</h3>
\1       <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
\1          <div className="w-32 shrink-0 snap-start">
\1             <div className="w-full aspect-square bg-white/10 rounded-lg overflow-hidden relative">
\1               {albumArtUrl && <img src={albumArtUrl} className="w-full h-full object-cover" />}
\1               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
\1               <span className="absolute bottom-2 left-2 right-2 font-bold text-white text-sm line-clamp-2">Songs by {currentSongObj?.artist || 'Artist'}</span>
\1             </div>
\1          </div>
\1          <div className="w-32 shrink-0 snap-start">
\1             <div className="w-full aspect-square bg-white/10 rounded-lg overflow-hidden relative">
\1               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-pink-500/50" />
\1               {albumArtUrl && <img src={albumArtUrl} className="w-full h-full object-cover mix-blend-overlay opacity-50" />}
\1               <span className="absolute bottom-2 left-2 right-2 font-bold text-white text-sm line-clamp-2">Similar Artists</span>
\1             </div>
\1          </div>
\1       </div>
\1    </div>

\1  </div>
\1)}
\1</div>
\1{/* Modals & Audio Element */}"""

code = re.sub(target, new_bottom, code, count=1)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied scrollable cards")
