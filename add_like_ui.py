import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Expanded Player Title Area
expanded_target = """                  <div className="flex-1 min-w-0">
                      <motion.div 
                        className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white truncate drop-shadow-md mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                          {currentTrack}
                      </motion.div>
                      {currentSongObj?.artist && (
                        <motion.div 
                          className="text-sm sm:text-base md:text-lg text-white/60 font-medium truncate tracking-wide"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {currentSongObj.artist}
                        </motion.div>
                      )}
                  </div>"""

expanded_replacement = """                  <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <motion.div 
                          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white truncate drop-shadow-md mb-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                            {currentTrack}
                        </motion.div>
                        {currentSongObj?.artist && (
                          <motion.div 
                            className="text-sm sm:text-base md:text-lg text-white/60 font-medium truncate tracking-wide"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {currentSongObj.artist}
                          </motion.div>
                        )}
                      </div>
                      
                      {currentSongObj && (
                          <button 
                            onClick={(e) => toggleLike(currentSongObj.id, e)}
                            className={`p-3 rounded-full hover:bg-white/10 transition-all shrink-0 ${likedSongs.includes(currentSongObj.id) ? 'text-purple-400' : 'text-white/60 hover:text-white'}`}
                          >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={likedSongs.includes(currentSongObj.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          </button>
                      )}
                  </div>"""

code = code.replace(expanded_target, expanded_replacement)

# 2. Update Mini Player Heart Icon
mini_target = """              {/* Mini Controls */}
              <div className="flex items-center gap-3 pr-2 shrink-0 text-white" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>"""

mini_replacement = """              {/* Mini Controls */}
              <div className="flex items-center gap-3 pr-2 shrink-0 text-white" onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => toggleLike(currentSongObj.id, e)} className={`hover:scale-110 transition-transform ${likedSongs.includes(currentSongObj.id) ? 'text-purple-400' : 'text-white'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={likedSongs.includes(currentSongObj.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>"""

code = code.replace(mini_target, mini_replacement)


# 3. Add functionality to "Liked Songs" tile
tile_target = """              {/* Liked Songs Tile */}
              <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14">"""
tile_replace = """              {/* Liked Songs Tile */}
              <div onClick={() => {
                const liked = songs.filter(s => likedSongs.includes(s.id));
                if (liked.length > 0) {
                  playSong(liked[0]);
                  setIsPlayerExpanded(true);
                } else {
                  alert("You haven't liked any songs yet!");
                }
              }} className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14">"""

code = code.replace(tile_target, tile_replace)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied Like functionality")
