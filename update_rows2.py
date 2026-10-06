import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find("{/* Today's biggest hits */}")
end_idx = code.find("              {activeTab === 'search' && (")

if start_idx != -1 and end_idx != -1:
    old_block = code[start_idx:end_idx]
    
    new_rows = """{/* Home Screen Rows */}
              {songs.length > 0 && (
                <>
                  <SongCarousel 
                    title="Today's biggest hits" 
                    songs={songs} 
                    onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
                  />
                  
                  <SongCarousel 
                    title="Recently Played" 
                    songs={[...songs].reverse()} 
                    onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
                  />
                  
                  <SongCarousel 
                    title="Chill" 
                    songs={[...songs].sort((a,b) => a.title.localeCompare(b.title))} 
                    onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
                  />
                  
                  <SongCarousel 
                    title="Sad Songs" 
                    songs={[...songs].sort((a,b) => (a.artist||'').localeCompare(b.artist||''))} 
                    onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
                  />
                  
                  <SongCarousel 
                    title="India's Best" 
                    songs={[...songs].sort((a,b) => b.title.localeCompare(a.title))} 
                    onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
                  />
                </>
              )}
            </div>
"""
    
    code = code[:start_idx] + new_rows + code[end_idx:]
    
    with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Added 5 unique rows")
else:
    print("Could not find rows block")
