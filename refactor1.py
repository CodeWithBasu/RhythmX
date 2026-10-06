import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add ChevronDown
if 'ChevronDown' not in content:
    content = content.replace('from \"lucide-react\"', ', ChevronDown from \"lucide-react\"')

# 2. Add isPlayerExpanded state
state_injection = '''    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)
    const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)'''

if 'isPlayerExpanded' not in content:
    content = content.replace('const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)', state_injection)

# 3. Replace the entire return statement.
# We need to find the eturn ( at the end of the file.
match = re.search(r'return \(\s*<div className=\"h-\[100dvh\]', content)
if match:
    start_idx = match.start()
    # Everything before the return
    top_part = content[:start_idx]
    
    # We will completely replace the JSX return block.
    # We must ensure we close all the logic brackets.
    new_return = '''return (
      <div className="h-[100dvh] w-full bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
        
        {/* --- HOME SCREEN --- */}
        <div className={lex-1 overflow-y-auto pb-24 transition-opacity duration-300 }>
          {/* Header */}
          <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleAdminLogin}>
              <img src="/rhythmx-logo.png" alt="RhythmX Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-purple-500/20" />
              <div className="flex flex-col justify-center">
                <div className="flex items-center text-xl tracking-tight uppercase text-white leading-none" style={{ fontFamily: "'Pixer', monospace" }}>
                  Rhythm<span className="text-purple-500">X</span>
                  {isAdmin && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-sans tracking-normal">ADMIN</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="https://github.com/CodeWithBasu" target="_blank" className="text-white/40 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <ProfileDropdown user={user} />
            </div>
          </div>

          {/* Main Content */}
          <main className="px-4 sm:px-8 py-6 space-y-10 max-w-7xl mx-auto">
            
            {/* Upload & Search Area */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h1 className="text-3xl font-bold tracking-tight">Good Evening</h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search songs, artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <svg className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={() => setIsAddingSong(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 border border-white/5"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">
                    {error}
                </div>
            )}

            {/* Horizontal Sections */}
            
            {/* 1. New Releases (Last 10 songs) */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                New Releases
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold hover:text-white cursor-pointer">View All</span>
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                {songs.slice(0, 10).map((song) => (
                  <div key={song.id} onClick={() => { playSong(song); setIsPlayerExpanded(true); }} className="snap-start shrink-0 w-36 sm:w-44 group cursor-pointer">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl bg-gradient-to-br from-purple-900/40 to-black/80 mb-3 flex items-center justify-center relative overflow-hidden shadow-lg group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-shadow">
                      <GridAlbumArt song={song} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white ml-1">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-white/90 text-sm truncate group-hover:text-white transition-colors">{song.title}</h3>
                    <p className="text-white/40 text-xs truncate mt-0.5">{song.artist || 'Unknown Artist'}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Your Library (All songs, filtered by search) */}
            <section>
              <h2 className="text-xl font-bold mb-4">Your Library</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.language?.toLowerCase().includes(searchQuery.toLowerCase())).map((song) => (
                      <div 
                          key={song.id} 
                          onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                          className="group relative bg-white/[0.02] rounded-2xl p-3 hover:bg-white/[0.06] transition-all cursor-pointer border border-white/5 hover:border-purple-500/30 flex flex-col"
                      >
                          <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-900/40 to-black/80 mb-3 flex items-center justify-center relative overflow-hidden">
                              <GridAlbumArt song={song} />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white ml-1">
                                          <path d="M8 5v14l11-7z" fill="currentColor"/>
                                      </svg>
                                  </div>
                              </div>
                          </div>
                          <h3 className="font-bold text-white/90 text-sm truncate group-hover:text-white transition-colors">{song.title}</h3>
                          <div className="flex justify-between items-center mt-1">
                              <p className="text-white/40 text-xs truncate pr-2">{song.artist || 'Unknown Artist'}</p>
                              {song.language && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 shrink-0 font-medium tracking-wide uppercase">
                                      {song.language}
                                  </span>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
              
              {songs.length === 0 && !error && (
                <div className="p-12 text-center flex flex-col items-center border border-white/5 rounded-2xl mt-4">
                    <Database className="w-12 h-12 text-white/10 mb-4" />
                    <div className="text-white/30 text-base font-medium">Your library is empty</div>
                    <div className="text-white/20 text-xs mt-2">Upload some tracks to get started.</div>
                </div>
              )}
            </section>
          </main>
        </div>

        {/* --- MINI PLAYER (Floating at Bottom) --- */}
        <AnimatePresence>
          {!isPlayerExpanded && hasAudio && currentSongObj && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-[#222]/95 transition-colors z-40"
              onClick={() => setIsPlayerExpanded(true)}
            >
              {/* Mini Art */}
              <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden relative">
                {albumArtUrl ? (
                  <img src={albumArtUrl} alt="Album Art" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white/40" />
                  </div>
                )}
              </div>
              
              {/* Mini Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{currentSongObj.title}</div>
                <div className="text-xs text-white/50 truncate">{currentSongObj.artist || 'Unknown Artist'}</div>
              </div>

              {/* Mini Controls */}
              <div className="flex items-center gap-2 pr-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors" onClick={() => {/* Like Logic Here */}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
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

        {/* --- EXPANDED PLAYER (Visualizer) --- */}
        <div className={ixed inset-0 z-50 bg-[#0C0414] flex flex-col overflow-hidden transition-transform duration-500 ease-out }>
          
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-4 bg-transparent">
            <button 
              onClick={() => setIsPlayerExpanded(false)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="flex gap-4">
               {/* Keep Admin / Share / Users Buttons inside Visualizer? Let's just keep the visualizer clean or include them */}
               {isAdmin && (
                <button onClick={() => setIsAddingSong(true)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Upload className="w-5 h-5" />
                </button>
               )}
            </div>
          </div>

          {/* Visualizer Canvas & Bars */}
          <div className="flex-1 relative flex flex-col items-center justify-center w-full">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0C0414]/50 to-[#0C0414] pointer-events-none" />
            
            {!hasAudio && (
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10 px-4">
                <TextType 
                  texts={DEFAULT_TEXT} 
                  speed={80} 
                  pauseTime={3000} 
                  className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] uppercase tracking-[0.2em] text-center"
                />
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full z-0 opacity-40 mix-blend-screen"
            />
            
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[40vh] max-h-[400px] flex items-end justify-center gap-[2px] sm:gap-[3px] md:gap-1 px-4 z-10">
              {barHeights.map((height, index) => {
                const colors = getBarColors(index, barHeights.length, height, isPlaying, theme);
                return (
                  <motion.div
                    key={index}
                    className="rounded-t-sm flex-1 max-w-[4px] sm:max-w-[5px] md:max-w-[6px] lg:max-w-[8px]"
                    style={{
                      backgroundColor: colors.bg,
                      opacity: height > 0 ? 1 : 0,
                      boxShadow: isPlaying ? \  0 \px \\ : 'none'
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{
                      height: \\%\,
                      opacity: height > 0 ? 1 : 0,
                      scaleX: showInitialAnimation ? 1 : 1,
                    }}
                    transition={{
                      height: { type: "spring", stiffness: height > 0 ? 400 : 200, damping: height > 0 ? 25 : 35, mass: 0.2 },
                      opacity: { duration: height > 0 ? 0.1 : 0.8, ease: "easeOut" },
                      scaleX: { duration: 2, delay: Math.abs(index - 40) * 0.015, ease: "easeOut" },
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Section: Current Song Info & Controls */}
          <div className="w-full bg-black/40 backdrop-blur-2xl border-t border-white/5 pt-6 pb-12 px-6 sm:px-12 relative z-20 shrink-0">
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                
                <div className="flex items-center gap-6">
                  <motion.div 
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 bg-white/5 flex items-center justify-center relative"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                  >
                      {albumArtUrl ? (
                          <img src={albumArtUrl} alt="Album Art" className="w-full h-full object-cover" />
                      ) : (
                          <Headphones className="w-8 h-8 sm:w-12 sm:h-12 text-white/40" />
                      )}
                      
                      {is8DMode && (
                        <div className="absolute top-2 right-2 bg-purple-500/80 backdrop-blur text-[10px] px-2 py-0.5 rounded text-white font-bold tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                          8D
                        </div>
                      )}
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                      <motion.div 
                        className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white truncate drop-shadow-md mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                          {currentTrack}
                      </motion.div>
                      {currentSongObj?.artist && (
                        <motion.div 
                          className="text-sm sm:text-base md:text-lg text-white/60 font-medium truncate tracking-wide"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {currentSongObj.artist}
                        </motion.div>
                      )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[280px]">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40 font-medium w-10 text-right">{formatTime(currentTime)}</span>
                    <div 
                      className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const percent = (e.clientX - rect.left) / rect.width
                        seekAudio(percent)
                      }}
                    >
                      <motion.div 
                        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: \\%\ }}
                        layoutId="progress"
                      />
                      <div className="absolute top-0 bottom-0 left-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity w-full" />
                    </div>
                    <span className="text-xs text-white/40 font-medium w-10">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <button 
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={\p-2.5 rounded-full transition-all \\}
                    >
                      <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <button 
                      onClick={playPreviousSong}
                      className="p-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                      <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    
                    <button 
                      onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                    
                    <button 
                      onClick={playNextSong}
                      className="p-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                      <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button 
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={\p-2.5 rounded-full transition-all \\}
                    >
                      <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Extras (Theme / 8D Audio) */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={toggle8DMode}
                  className={\px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wider transition-all \\}
                >
                  <span className="flex items-center gap-2">
                    <Headphones className="w-3 h-3 sm:w-4 sm:h-4" />
                    8D AUDIO {is8DMode ? 'ON' : 'OFF'}
                  </span>
                </button>
                <div className="flex gap-2 bg-white/5 p-1 rounded-full">
                  {["neon", "synthwave", "matrix", "ocean"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={\px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all \\}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Modals & Audio Element */}
        <AnimatePresence>
          {isAddingSong && (
            // ... Use the existing upload modal but we need to fetch it dynamically
            <UploadModal setIsAddingSong={setIsAddingSong} />
          )}
        </AnimatePresence>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onCanPlayThrough={handleCanPlay}
          onEnded={handleEnded}
          onError={handleError}
          crossOrigin="anonymous"
          style={{ display: 'none' }}
        />
        
        {/* Style tag to hide scrollbars globally */}
        <style dangerouslySetInnerHTML={{__html: \
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        \}} />
      </div>
    );
}'''

    # Wait, the upload modal is a big block of code! I shouldn't just replace it with <UploadModal /> because it's defined inside Component right now.
    # I MUST KEEP the Upload Modal from the original file!
    pass

print("Script parsed")
