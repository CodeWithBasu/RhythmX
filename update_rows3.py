import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""                        <div \s*
                          key=\{song\.id\} \s*
                          onClick=\{\(\) => \{ playSong\(song\); setIsPlayerExpanded\(true\); \}\} \s*
                          className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group" \s*
                        > \s*
                          <div className="w-12 h-12 shrink-0 rounded overflow-hidden"> \s*
                            <GridAlbumArt song=\{song\} /> \s*
                          </div> \s*
                          <div className="flex-1 min-w-0"> \s*
                            <h4 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">\{song\.title\}</h4> \s*
                            <p className="text-white/50 text-sm truncate">\{song\.artist \|\| 'Unknown Artist'\}</p> \s*
                          </div> \s*
                          <button onClick=\{\(e\) => toggleLike\(song\.id, e\)\} className="opacity-0 group-hover:opacity-100 p-2 text-white/50 hover:text-white transition-all"> \s*
                            <svg width="20" height="20" viewBox="0 0 24 24" fill=\{likedSongs\.includes\(song\.id\) \? "currentColor" : "none"\} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20\.84 4\.61a5\.5 5\.5 0 0 0-7\.78 0L12 5\.67l-1\.06-1\.06a5\.5 5\.5 0 0 0-7\.78 7\.78l1\.06 1\.06L12 21\.23l7\.78-7\.78 1\.06-1\.06a5\.5 5\.5 0 0 0 0-7\.78z"></path></svg> \s*
                          </button> \s*
                        </div>"""

replacement = """                        <div 
                          key={song.id} 
                          onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                          className="flex items-center gap-4 p-2.5 rounded-[32px] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group shadow-lg mb-3"
                        >
                          <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden shadow-md border border-white/5 relative">
                            <GridAlbumArt song={song} />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate group-hover:text-white transition-colors">{song.title}</h4>
                            <p className="text-white/60 text-xs truncate mt-0.5">{song.artist || 'Various Artists'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={(e) => toggleLike(song.id, e)} className="p-2 text-white/50 hover:text-white transition-all">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill={likedSongs.includes(song.id) ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-md mr-1">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </button>
                          </div>
                        </div>"""

new_content = re.sub(target, replacement, content, flags=re.DOTALL)
if new_content != content:
    with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced row items successfully.")
else:
    print("No matches found for row items.")
