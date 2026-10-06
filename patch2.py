import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Make sure ChevronDown is imported
if 'Globe, ChevronDown' not in code:
    code = code.replace('Globe } from "lucide-react"', 'Globe, ChevronDown } from "lucide-react"')
    code = code.replace('Globe } , ChevronDown from "lucide-react"', 'Globe, ChevronDown } from "lucide-react"')
    code = code.replace(', ChevronDown from "lucide-react"', 'from "lucide-react"')

# Add isPlayerExpanded state
if 'isPlayerExpanded' not in code:
    code = code.replace('const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)',
                        'const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)\n  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)')

# Handle audioRef.current.play() promise rejection fix
code = code.replace('await audioRef.current.play()', "await audioRef.current.play().catch(err => console.log('Audio play interrupted:', err))")

# Modify the Top Section container
top_section_old = 'className="flex-none h-[45vh] md:h-[50vh] relative flex flex-col items-center justify-between pb-6 pt-20 bg-gradient-to-b from-black to-[#0C0414] shrink-0"'
top_section_new = 'className={`flex-none relative flex flex-col items-center justify-between pb-6 pt-20 bg-gradient-to-b from-black to-[#0C0414] shrink-0 transition-all duration-500 ${isPlayerExpanded ? "h-[100dvh] absolute inset-0 z-50" : "h-[45vh] md:h-[50vh]"}`}'
code = code.replace(top_section_old, top_section_new)

# Add ChevronDown button inside Top Section header
header_old = 'bg-transparent">'
header_new = 'bg-transparent">\n            {isPlayerExpanded && (\n              <button onClick={() => setIsPlayerExpanded(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all mr-2">\n                <ChevronDown className="w-6 h-6" />\n              </button>\n            )}'
code = code.replace(header_old, header_new, 1)

# Modify the Bottom Section container
bottom_section_old = 'className="flex-1 w-full bg-[#05010a] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-y-auto relative z-10 border-t border-white/5 pb-24"'
bottom_section_new = 'className={`flex-1 w-full bg-[#05010a] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-y-auto relative z-10 border-t border-white/5 pb-24 transition-transform duration-500 ${isPlayerExpanded ? "translate-y-full opacity-0 pointer-events-none absolute inset-0" : "translate-y-0 opacity-100 relative"}`}'
code = code.replace(bottom_section_old, bottom_section_new)

# Insert the Mini Player right before the final closing div!
mini_player_code = '''
        {/* MINI PLAYER (Floating at Bottom) */}
        <AnimatePresence>
          {!isPlayerExpanded && hasAudio && currentSongObj && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-[#222]/95 transition-colors z-[100]"
              onClick={() => setIsPlayerExpanded(true)}
            >
              <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden relative border border-white/5">
                <GridAlbumArt song={currentSongObj} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-sm font-bold text-white truncate">{currentSongObj.title}</div>
                <div className="text-xs text-white/50 truncate mt-0.5">{currentSongObj.artist || 'Unknown Artist'}</div>
              </div>
              <div className="flex items-center gap-2 pr-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
'''

end_idx = code.rfind('</div>\n    );\n}')
if end_idx != -1:
    code = code[:end_idx] + mini_player_code + code[end_idx:]

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Modifications done safely")
