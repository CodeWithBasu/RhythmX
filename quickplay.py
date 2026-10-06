import sys
import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the quick play grid entirely
start_marker = '{/* Quick Play Grid (2 Columns) */}'
end_marker = '{/* Today\'s biggest hits */}'
start_idx = code.find(start_marker)
end_idx = code.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find quick play grid block")
    sys.exit(1)

NEW_GRID = """{/* Quick Play Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            
            {/* Liked Songs Tile */}
            <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14">
                <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 flex items-center justify-center shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
                <div className="font-bold text-xs text-white truncate">Liked Songs</div>
            </div>

            {songs.slice(0, 5).map((song) => (
              <div 
                key={`quick-${song.id}`}
                onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14"
              >
                <div className="w-14 h-14 shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.3)] bg-black/40">
                  <GridAlbumArt song={song} />
                </div>
                <div className="font-bold text-xs text-white truncate">{song.title}</div>
              </div>
            ))}
          </div>

          """

new_code = code[:start_idx] + NEW_GRID + code[end_idx:]

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Applied liked songs tile")
