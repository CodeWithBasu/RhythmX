import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Fix toggleLike to use fallback ID
code = code.replace("if (!songId) return", "if (!songId) return") # just to be sure it's there
code = code.replace("toggleLike = (songId: string, e?: React.MouseEvent)", "toggleLike = (songId: string, e?: React.MouseEvent)")

# 2. Add Liked Songs Tab right before activeTab === 'search'
target_search_tab = r"(\{activeTab === 'search' && \()"
liked_tab = r'''{activeTab === 'liked' && (
              <div className="space-y-6 pt-4 max-w-5xl mx-auto w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Liked Songs</h2>
                {songs.filter(s => likedSongs.includes(s.id || s.title)).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {songs.filter(s => likedSongs.includes(s.id || s.title)).map(song => (
                      <div 
                        key={song.id} 
                        onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                        className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="w-full aspect-square rounded-md overflow-hidden mb-3 shadow-lg relative">
                          {song.imageUrl ? <img src={song.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/20 text-xs font-medium">No Image</div>}
                          <div className="absolute bottom-2 right-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                        <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
                        <p className="text-white/60 text-xs truncate mt-1">{song.artist || 'Unknown Artist'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/50 pt-16">
                    <p>You haven't liked any songs yet.</p>
                  </div>
                )}
              </div>
            )}
            
            \1'''
code = re.sub(target_search_tab, liked_tab, code)

# 3. Update Liked Songs Tile
target_tile = r'<div className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 \s*overflow-hidden cursor-pointer h-14">'
replacement_tile = r'<div onClick={() => setActiveTab("liked")} className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14">'
code = re.sub(target_tile, replacement_tile, code)

# 4. Fix Expanded Player Heart Icon
# Find the artist motion div in the expanded player: `{currentSongObj.artist} </motion.div> )}`
target_expanded_artist = r'(\{currentSongObj\.artist\}\s*<\/motion\.div>\s*\)\}\s*)(<\/div>)'
# We want to replace `</div>` with the heart button, but only the one right after the artist.
replacement_expanded_artist = r'''\1
                      {currentSongObj && (
                          <button 
                            onClick={(e) => toggleLike(currentSongObj.id || currentSongObj.title, e)}
                            className={`p-3 rounded-full hover:bg-white/10 transition-all shrink-0 ${likedSongs.includes(currentSongObj.id || currentSongObj.title) ? 'text-purple-400' : 'text-white/60 hover:text-white'}`}
                          >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={likedSongs.includes(currentSongObj.id || currentSongObj.title) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          </button>
                      )}
                  \2'''
# Ensure it only targets the expanded player, so we do it via find/replace carefully.
# Wait, let's use the exact block.
old_block = """                      {currentSongObj?.artist && (
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
new_block = """                      {currentSongObj?.artist && (
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
                        onClick={(e) => toggleLike(currentSongObj.id || currentSongObj.title, e)}
                        className={`p-3 rounded-full hover:bg-white/10 transition-all shrink-0 ${likedSongs.includes(currentSongObj.id || currentSongObj.title) ? 'text-purple-400' : 'text-white/60 hover:text-white'}`}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill={likedSongs.includes(currentSongObj.id || currentSongObj.title) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                  )}"""

code = code.replace(old_block, new_block)
# Make the flex wrapper `justify-between`
code = code.replace('<div className="flex-1 min-w-0">\n                      <motion.div', '<div className="flex-1 min-w-0 flex items-center justify-between gap-4">\n                      <div className="min-w-0">\n                      <motion.div')
# We need to close the inner div we just opened `min-w-0`.
code = code.replace('</button>\n                  )}', '</button>\n                  )}\n                  </div>')

# 5. Fix Mini Player Heart Icon
target_mini = r'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=\{2\}\s*strokeLinecap="round" strokeLinejoin="round"><path d="M20\.84 4\.61[^>]*><\/path><\/svg>'
replacement_mini = r'''<button onClick={(e) => toggleLike(currentSongObj.id || currentSongObj.title, e)} className={`hover:scale-110 transition-transform ${likedSongs.includes(currentSongObj.id || currentSongObj.title) ? 'text-purple-400' : 'text-white'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={likedSongs.includes(currentSongObj.id || currentSongObj.title) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>'''
code = re.sub(target_mini, replacement_mini, code)


# 6. Apply Dynamic Expanded Player Background!
# Replace `<div className="fixed inset-0 z-50 bg-[#0C0414] ...">`
target_bg = r'<div\s*className=\{\`fixed inset-0 z-50 bg-\[\#0C0414\] overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-\[cubic-bezier\(0\.32,0\.72,0,1\)\] \$\{isPlayerExpanded \? \'translate-y-0\' : \'translate-y-full\'\}\`\}\s*>'
replacement_bg = r'''<div 
        className={`fixed inset-0 z-50 overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isPlayerExpanded ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          background: `linear-gradient(135deg, ${lyricsBgColor} 0%, #0C0414 70%)`
        }}
      >'''
code = re.sub(target_bg, replacement_bg, code)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied robust layout patch")
