import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state variable
state_target = """    const [isAddingSong, setIsAddingSong] = useState(false)"""
state_replacement = """    const [isAddingSong, setIsAddingSong] = useState(false)
    const [isLyricsExpanded, setIsLyricsExpanded] = useState(false)"""
code = code.replace(state_target, state_replacement)

# 2. Add autoscroll effect below currentLyricIndex effect
sync_effect = """  // Sync lyrics with audio time
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
  }, [currentTime, lyrics, currentLyricIndex])"""

scroll_effect = """
  // Autoscroll lyrics when expanded
  useEffect(() => {
    if (isLyricsExpanded && currentLyricIndex !== -1) {
      const el = document.getElementById(`lyric-${currentLyricIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIndex, isLyricsExpanded])"""

code = code.replace(sync_effect, sync_effect + "\n" + scroll_effect)

# 3. Update LYRICS PREVIEW CARD JSX
old_lyrics = """            {/* LYRICS PREVIEW CARD */}
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
            ) : ("""

new_lyrics = """            {/* LYRICS PREVIEW CARD */}
            {lyrics.length > 0 ? (
              <div className={`bg-[#603B2C] rounded-2xl shadow-2xl relative transition-all duration-500 ${isLyricsExpanded ? 'fixed inset-0 z-[100] rounded-none flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-24' : 'p-6 overflow-hidden group'}`}>
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h3 className="text-white font-bold text-lg md:text-2xl">Lyrics</h3>
                  <button 
                    onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
                    className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                  >
                    {isLyricsExpanded ? 'Close' : 'Show full'}
                  </button>
                </div>
                
                <div className={`flex flex-col gap-3 relative ${isLyricsExpanded ? 'flex-1 overflow-y-auto hide-scrollbar' : 'max-h-[300px] overflow-hidden'}`} id="lyrics-container">
                  {lyrics.map((line, i) => {
                    const isActive = i === currentLyricIndex;
                    const isPast = i < currentLyricIndex;
                    if (!isLyricsExpanded && Math.abs(i - currentLyricIndex) > 4 && currentLyricIndex !== -1) return null;
                    return (
                      <div 
                        key={i}
                        id={`lyric-${i}`}
                        className={`font-bold transition-all duration-300 ${
                          isLyricsExpanded ? 'text-3xl sm:text-4xl md:text-5xl py-2' : 'text-xl sm:text-2xl'
                        } ${
                          isActive ? 'text-white scale-105 origin-left' : 
                          isPast ? 'text-white/40' : 'text-white/20 hover:text-white/40'
                        }`}
                      >
                        {line.text || '♪'}
                      </div>
                    )
                  })}
                  {currentLyricIndex === -1 && (
                     <div className={`font-bold text-white/50 ${isLyricsExpanded ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-2xl'}`}>
                        {lyrics.slice(0, isLyricsExpanded ? lyrics.length : 4).map((l,i) => <div key={i} className="mb-3">{l.text || '♪'}</div>)}
                     </div>
                  )}
                  {!isLyricsExpanded && <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#603B2C] to-transparent pointer-events-none" />}
                </div>
              </div>
            ) : ("""

code = code.replace(old_lyrics, new_lyrics)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied full lyrics view")
