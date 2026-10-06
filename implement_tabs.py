import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Find the start of the main section
main_start_marker = '<main className="px-4 py-2 space-y-8 max-w-7xl mx-auto w-full">'
main_start_idx = code.find(main_start_marker)

main_end_marker = '</main>'
main_end_idx = code.find(main_end_marker, main_start_idx)

if main_start_idx != -1 and main_end_idx != -1:
    old_main_content = code[main_start_idx + len(main_start_marker):main_end_idx]
    
    # We will wrap the old main content in {activeTab === 'home' && ( <>{old_main_content}</> )}
    # Then append Search and Library blocks
    
    new_content = """
            {activeTab === 'home' && (
              <div className="space-y-8">""" + old_main_content + """</div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-6 pt-4">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to listen to?"
                    className="w-full bg-white/10 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
                  />
                </div>
                
                {searchQuery.trim() === "" ? (
                  <div className="text-center text-white/50 pt-10">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Search for songs, artists, or movies</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg mb-4">Search Results</h3>
                    {songs.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || (s.artist && s.artist.toLowerCase().includes(searchQuery.toLowerCase()))).length > 0 ? (
                      songs.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || (s.artist && s.artist.toLowerCase().includes(searchQuery.toLowerCase()))).map(song => (
                        <div 
                          key={song.id} 
                          onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                          className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <div className="w-12 h-12 shrink-0 rounded overflow-hidden">
                            <GridAlbumArt song={song} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">{song.title}</h4>
                            <p className="text-white/60 text-xs truncate">{song.artist || 'Unknown Artist'}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-white/50 pt-10">
                        <p>No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'library' && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Your Library</h2>
                  <button onClick={() => setIsAddingSong(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    Add Song
                  </button>
                </div>
                
                {!user ? (
                  <div className="text-center text-white/50 pt-16 pb-20 border border-white/5 rounded-xl bg-white/5">
                    <Database className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
                    <p className="font-medium mb-4">Log in to view your saved songs</p>
                    <button onClick={() => setIsAddingSong(true)} className="bg-purple-500 text-white px-6 py-2 rounded-full font-medium">Log In</button>
                  </div>
                ) : songs.filter(s => s.uploadedBy === user.uid).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {songs.filter(s => s.uploadedBy === user.uid).map(song => (
                      <div 
                        key={song.id} 
                        onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                        className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="w-full aspect-square rounded-md overflow-hidden mb-3 shadow-lg relative">
                          <GridAlbumArt song={song} />
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
                  <div className="text-center text-white/50 pt-16 pb-20 border border-white/5 rounded-xl bg-white/5">
                    <Database className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
                    <p className="font-medium mb-4">You haven't uploaded any songs yet</p>
                    <button onClick={() => setIsAddingSong(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-colors">Upload Your First Song</button>
                  </div>
                )}
              </div>
            )}
    """
    
    code = code[:main_start_idx + len(main_start_marker)] + new_content + code[main_end_idx:]
    
    with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Added Tab Views!")
else:
    print("Could not find main element")
