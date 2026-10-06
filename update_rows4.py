import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Search Row
target_search = r"""                        <div \s*
                          key=\{song\.id\} \s*
                          onClick=\{\(\) => \{ playSong\(song\); setIsPlayerExpanded\(true\); \}\} \s*
                          className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group" \s*
                        > \s*
                          <div className="w-12 h-12 shrink-0 rounded overflow-hidden"> \s*
                            <GridAlbumArt song=\{song\} /> \s*
                          </div> \s*
                          <div className="flex-1 min-w-0"> \s*
                            <h4 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">\{song\.title\}</h4> \s*
                            <p className="text-white/60 text-xs truncate">\{song\.artist \|\| 'Unknown Artist'\}</p> \s*
                          </div> \s*
                          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"> \s*
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> \s*
                          </div> \s*
                        </div>"""

replacement_search = """                        <div 
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
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-md mr-1 shrink-0">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </button>
                          </div>
                        </div>"""

content = re.sub(target_search, replacement_search, content, flags=re.DOTALL)

# Replace Library Row
target_library = r"""                      <div \s*
                        key=\{song\.id\} \s*
                        onClick=\{\(\) => \{ playSong\(song\); setIsPlayerExpanded\(true\); \}\} \s*
                        className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer group" \s*
                      > \s*
                        <div className="w-full aspect-square rounded-md overflow-hidden mb-3 shadow-lg relative"> \s*
                          <GridAlbumArt song=\{song\} /> \s*
                          <div className="absolute bottom-2 right-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl"> \s*
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> \s*
                          </div> \s*
                        </div> \s*
                        <h4 className="text-white font-bold text-sm truncate">\{song\.title\}</h4> \s*
                        <p className="text-white/60 text-xs truncate mt-1">\{song\.artist \|\| 'Unknown Artist'\}</p> \s*
                      </div>"""

replacement_library = """                      <div 
                        key={song.id} 
                        onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                        className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 p-4 rounded-3xl transition-all cursor-pointer group shadow-lg"
                      >
                        <div className="w-full aspect-square rounded-full overflow-hidden mb-4 shadow-lg border border-white/10 relative self-center w-3/4">
                          <GridAlbumArt song={song} />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="text-center w-full">
                          <h4 className="text-white font-bold text-sm truncate group-hover:text-white transition-colors">{song.title}</h4>
                          <p className="text-white/60 text-xs truncate mt-1">{song.artist || 'Various Artists'}</p>
                        </div>
                        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-md">
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                      </div>"""

content = re.sub(target_library, replacement_library, content, flags=re.DOTALL)

# Replace <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"> to gap-6
content = content.replace('className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"', 'className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"')

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced all row items successfully.")
