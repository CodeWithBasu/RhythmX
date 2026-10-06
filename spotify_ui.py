import sys
import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# I will replace the entire <div className={`flex-1 overflow-y-auto...` block
# which represents the Home Screen.

home_screen_start = code.find('{/* Home Screen (Only visible if not expanded) */}')
if home_screen_start == -1:
    print("Could not find Home Screen block")
    sys.exit(1)

# The block ends right before {/* MINI PLAYER (Floating at Bottom) */}
mini_player_start = code.find('{/* MINI PLAYER (Floating at Bottom) */}')

top_part = code[:home_screen_start]
bottom_part = code[mini_player_start:]

SPOTIFY_HOME_SCREEN = """{/* Home Screen (Only visible if not expanded) */}
      <div className={`flex-1 overflow-y-auto pb-32 transition-opacity duration-300 ${isPlayerExpanded ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100 relative z-10'} bg-[#121212]`}>
        
        {/* Top Header (Spotify Style) */}
        <div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProfileDropdown />
            <button className="bg-[#1ed760] text-black px-4 py-1.5 rounded-full text-sm font-medium">All</button>
            <button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">Music</button>
            <button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">Podcasts</button>
          </div>
          {isAdmin && (
            <button onClick={() => setIsAddingSong(true)} className="bg-white/10 text-white p-2 rounded-full">
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>

        <main className="px-4 py-2 space-y-8">
          
          {/* Quick Play Grid (2 Columns) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {songs.slice(0, 6).map((song) => (
              <div 
                key={`quick-${song.id}`}
                onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14"
              >
                <div className="w-14 h-14 shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  <GridAlbumArt song={song} />
                </div>
                <div className="font-bold text-xs text-white truncate">{song.title}</div>
              </div>
            ))}
          </div>

          {/* Today's biggest hits */}
          {songs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Today's biggest hits</h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-4 px-4">
                {songs.slice(0, 8).map((song) => (
                  <div 
                    key={`hits-${song.id}`} 
                    onClick={() => { playSong(song); setIsPlayerExpanded(true); }} 
                    className="snap-start shrink-0 w-[140px] cursor-pointer group"
                  >
                    <div className="w-[140px] h-[140px] mb-3">
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
            </section>
          )}

          {/* Chill */}
          {songs.length > 2 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Chill</h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-4 px-4">
                {songs.slice(2, 10).map((song) => (
                  <div 
                    key={`chill-${song.id}`} 
                    onClick={() => { playSong(song); setIsPlayerExpanded(true); }} 
                    className="snap-start shrink-0 w-[140px] cursor-pointer group"
                  >
                    <div className="w-[140px] h-[140px] mb-3">
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
            </section>
          )}

          {/* Throwback */}
          {songs.length > 4 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-white">Throwback</h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-4 px-4">
                {songs.slice(4, 12).map((song) => (
                  <div 
                    key={`throwback-${song.id}`} 
                    onClick={() => { playSong(song); setIsPlayerExpanded(true); }} 
                    className="snap-start shrink-0 w-[140px] cursor-pointer group"
                  >
                    <div className="w-[140px] h-[140px] mb-3">
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
            </section>
          )}

          <div className="h-10"></div> {/* Extra padding */}
        </main>
      </div>

"""

# Next we replace the Mini Player and inject the Bottom Nav Bar right below it!
# Wait, the bottom nav bar should always be visible IF we are not expanded?
# Yes, or visible always? In Spotify, it's visible when not expanded.

mini_player_end = bottom_part.find('{/* EXPANDED PLAYER (Visualizer) */}')

NEW_MINI_PLAYER = """{/* MINI PLAYER (Floating at Bottom) */}
      <AnimatePresence>
        {!isPlayerExpanded && hasAudio && currentSongObj && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-[70px] left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-[#3d1515] rounded-lg p-2 flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-[#4d1a1a] transition-colors z-[60] border-b-2 border-white/10"
            onClick={() => setIsPlayerExpanded(true)}
          >
            {/* Progress Bar (Spotify Style) */}
            <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-white/20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
            </div>

            {/* Mini Art */}
            <div className="w-10 h-10 shrink-0 rounded overflow-hidden shadow-md">
              <GridAlbumArt song={currentSongObj} />
            </div>
            
            {/* Mini Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[13px] font-bold text-white truncate">{currentSongObj.title}</div>
              <div className="text-[11px] text-white/70 truncate">{currentSongObj.artist || 'Unknown Artist'}</div>
            </div>

            {/* Mini Controls */}
            <div className="flex items-center gap-3 pr-2 shrink-0 text-white" onClick={(e) => e.stopPropagation()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <button 
                onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                className="w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAVIGATION BAR */}
      <div className={`fixed bottom-0 left-0 right-0 h-[65px] bg-gradient-to-t from-black via-black/95 to-black/80 z-[50] flex items-center justify-around px-2 sm:px-8 pb-2 transition-transform duration-300 ${isPlayerExpanded ? 'translate-y-full' : 'translate-y-0'}`}>
         <div className="flex flex-col items-center gap-1 cursor-pointer text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>
            <span className="text-[10px] font-medium">Home</span>
         </div>
         <div className="flex flex-col items-center gap-1 cursor-pointer text-white/60 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span className="text-[10px] font-medium">Search</span>
         </div>
         <div className="flex flex-col items-center gap-1 cursor-pointer text-white/60 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="text-[10px] font-medium">Your Library</span>
         </div>
         <div className="flex flex-col items-center gap-1 cursor-pointer text-white/60 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="text-[10px] font-medium">Premium</span>
         </div>
         {isAdmin && (
             <div onClick={() => setIsAddingSong(true)} className="flex flex-col items-center gap-1 cursor-pointer text-white/60 hover:text-white transition-colors">
                <Upload className="w-6 h-6" />
                <span className="text-[10px] font-medium">Create</span>
             </div>
         )}
      </div>

"""

final_code = top_part + SPOTIFY_HOME_SCREEN + NEW_MINI_PLAYER + bottom_part[mini_player_end:]

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

print("Applied Spotify UI")
