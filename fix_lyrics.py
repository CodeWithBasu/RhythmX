import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the button missing issue using a robust regex
target_btn = r'<h3 className="text-white font-bold text-lg md:text-2xl">Lyrics<\/h3>\s*<button\s*onClick=\{\(\) => setIsLyricsExpanded\(\!isLyricsExpanded\)\}\s*className="bg-white text-black[^>]*>\s*\{isLyricsExpanded \? \'Close\' \: \'Show full\'\}\s*<\/button>'

replacement_btn = r'''<h3 className="text-white font-bold text-lg md:text-2xl">Lyrics</h3>
                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        onClick={() => {
                          const text = lyrics.map(l => l.text).join('\n');
                          const blob = new Blob([text], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${currentTrack.replace('~/', '').trim()} - Lyrics.txt`;
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
                    </div>'''

code = re.sub(target_btn, replacement_btn, code)


# Fix the text size
# `isLyricsExpanded ? 'text-3xl sm:text-4xl md:text-5xl py-2' : 'text-xl sm:text-2xl'`
target_text_1 = r"isLyricsExpanded \? 'text-3xl sm:text-4xl md:text-5xl py-2' \: 'text-xl sm:text-2xl'"
replacement_text_1 = r"isLyricsExpanded ? 'text-2xl sm:text-3xl md:text-4xl py-1' : 'text-lg sm:text-xl'"
code = re.sub(target_text_1, replacement_text_1, code)

# `isLyricsExpanded ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-2xl'`
target_text_2 = r"isLyricsExpanded \? 'text-3xl sm:text-4xl md:text-5xl' \: 'text-xl sm:text-2xl'"
replacement_text_2 = r"isLyricsExpanded ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-lg sm:text-xl'"
code = re.sub(target_text_2, replacement_text_2, code)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied fixes")
