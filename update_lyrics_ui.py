import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add getSongColor outside the component
if "const getSongColor" not in code:
    code = code.replace("export default function Component() {", """
const getSongColor = (title: string) => {
   let hash = 0;
   for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
   const hue = Math.abs(hash) % 360;
   return `hsl(${hue}, 40%, 20%)`;
}

export default function Component() {""")

# 2. Add lyricsBgColor inside the component
if "const lyricsBgColor" not in code:
    code = code.replace("const [dragActive, setDragActive] = useState(false)", """const [dragActive, setDragActive] = useState(false)
    const lyricsBgColor = getSongColor(currentTrack)""")

# 3. Modify Lyrics Preview Card Outer Div
old_card_outer = r'<div className=\{\`bg-\[\#603B2C\] shadow-2xl transition-all duration-500 \$\{isLyricsExpanded \? "rounded-3xl min-h-\[85vh\] flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-16" : "rounded-2xl relative p-6 max-h-\[300px\] overflow-hidden group"\}\`\}>'
new_card_outer = r'<div className={`shadow-2xl transition-all duration-500 ${isLyricsExpanded ? "rounded-3xl min-h-[85vh] flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-16" : "rounded-2xl relative p-6 max-h-[300px] overflow-hidden group"}`} style={{ backgroundColor: lyricsBgColor }}>'
code = re.sub(old_card_outer, new_card_outer, code)

# 4. Modify Buttons in Lyrics Card Header
old_header_buttons = """                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-white font-bold text-lg md:text-2xl">Lyrics</h3>
                    <button 
                      onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
                      className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                    >
                      {isLyricsExpanded ? 'Close' : 'Show full'}
                    </button>
                  </div>"""

new_header_buttons = """                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-white font-bold text-lg md:text-2xl">Lyrics</h3>
                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        onClick={() => {
                          const text = lyrics.map(l => l.text).join('\\n');
                          const blob = new Blob([text], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${currentTrack} - Lyrics.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        style={{ backgroundColor: lyricsBgColor }}
                        className="text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button 
                        onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
                        className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                      >
                        {isLyricsExpanded ? 'Close' : 'Show full'}
                      </button>
                    </div>
                  </div>"""
code = code.replace(old_header_buttons, new_header_buttons)

# 5. Modify Lyrics Text Colors
old_lyrics_text = """                        className={`font-bold transition-all duration-300 ${
                          isLyricsExpanded ? 'text-3xl sm:text-4xl md:text-5xl py-2' : 'text-xl sm:text-2xl'
                        } ${
                          isActive ? 'text-white scale-105 origin-left' : 
                          isPast ? 'text-white/40' : 'text-white/20 hover:text-white/40'
                        }`}"""
new_lyrics_text = """                        className={`font-bold transition-all duration-300 ${
                          isLyricsExpanded ? 'text-3xl sm:text-4xl md:text-5xl py-2' : 'text-xl sm:text-2xl'
                        } ${
                          isActive ? 'text-white scale-105 origin-left drop-shadow-md' : 
                          isPast ? 'text-white/80' : 'text-white/70 hover:text-white'
                        }`}"""
code = code.replace(old_lyrics_text, new_lyrics_text)

# 6. Modify the bottom gradient
old_gradient = r'\{!isLyricsExpanded && <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-\[\#603B2C\] to-transparent pointer-events-none" />\}'
new_gradient = r'{!isLyricsExpanded && <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: `linear-gradient(to top, ${lyricsBgColor}, transparent)` }} />}'
code = re.sub(old_gradient, new_gradient, code)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied UI tweaks to lyrics")
