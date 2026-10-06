import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Expanded player layout fix
target = r'(<div className="flex-1 min-w-0">\s*<motion\.div)'
replacement = r'<div className="flex-1 min-w-0 flex items-center justify-between gap-4">\n                      <div className="min-w-0">\n                      <motion.div'
code = re.sub(target, replacement, code)

# Close the new div and add the button
# We search for:
#                          {currentSongObj.artist}
#                        </motion.div>
#                      )}
#                  </div>
target_end = r'(\{currentSongObj\.artist\}\s*<\/motion\.div>\s*\)\}\s*)<\/div>'
replacement_end = r'''\1
                  </div>
                  
                  {currentSongObj && (
                      <button 
                        onClick={(e) => toggleLike(currentSongObj.id || currentSongObj.title, e)}
                        className={`p-3 rounded-full hover:bg-white/10 transition-all shrink-0 ${likedSongs.includes(currentSongObj.id || currentSongObj.title) ? 'text-purple-400' : 'text-white/60 hover:text-white'}`}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill={likedSongs.includes(currentSongObj.id || currentSongObj.title) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                  )}
                  </div>'''
code = re.sub(target_end, replacement_end, code)


with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied robust regex patch")
