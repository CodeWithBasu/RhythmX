import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Main Background
content = content.replace('bg-gradient-to-br from-[#4a0484] via-[#2a014a] to-black', 'bg-gradient-to-br from-[#5c0a15] via-[#240106] to-black')
content = content.replace('bg-gradient-to-br from-[#4a0484] via-[#2a014a] to-[#12002b]', 'bg-gradient-to-br from-[#5c0a15] via-[#240106] to-black')

# 2. Header and Search bar for HOME
target_header = r"""        \{/\* Top Header \(Glass UI\) \*/\}
        <div className="sticky top-0 z-40 bg-transparent px-4 pt-8 pb-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
.*?
          \{/\* Quick Play / Trending Grid \*/\}"""

replacement_header = """        {/* Top Header (Glass UI) */}
        <div className="sticky top-0 z-40 bg-transparent px-6 pt-12 pb-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Welcome Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user ? <ProfileDropdown /> : <Link href="/signin" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg overflow-hidden"><img src="https://i.pravatar.cc/150?img=68" alt="avatar" className="w-full h-full object-cover opacity-80" /></Link>}
              <div className="flex flex-col">
                <span className="text-white/60 text-[10px] uppercase tracking-wider">Welcome Back</span>
                <span className="text-white text-sm font-bold tracking-wide">{user ? user.displayName || 'William Ione' : 'William Ione'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button onClick={() => setIsAddingSong(true)} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg">
                  <Upload className="w-5 h-5" />
                </button>
              )}
              <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </button>
            </div>
          </div>
          
          {/* Search Bar Row */}
          <div className="flex items-center gap-3 relative">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="text"
                  placeholder="Search here..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-full py-3 pl-10 pr-4 outline-none focus:bg-white/20 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7"></path><path d="M4 10V3"></path><path d="M12 21v-9"></path><path d="M12 8V3"></path><path d="M20 21v-5"></path><path d="M20 12V3"></path><path d="M1 14h6"></path><path d="M9 8h6"></path><path d="M17 16h6"></path></svg>
             </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1 -mx-6 px-6">
            <button className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium whitespace-nowrap text-xs shadow-lg">All</button>
            <button className="px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 font-medium whitespace-nowrap text-xs hover:bg-white/10 transition-all">Hotel Package</button>
            <button className="px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 font-medium whitespace-nowrap text-xs hover:bg-white/10 transition-all">Flight</button>
          </div>
        </div>

        <main className="py-2 space-y-6 max-w-7xl mx-auto w-full">
            {activeTab === 'home' && (
              <div className="space-y-6">
          
          {/* Quick Play / Trending Grid */}"""

content = re.sub(target_header, replacement_header, content, flags=re.DOTALL)

# 3. Trending Card
target_trending = r"""          \{/\* Trending Card \(Glass UI\) \*/\}
          \{songs\.length > 0 && \(
            <div 
              onClick=\{\(\) => \{ playSong\(songs\[0\]\); setIsPlayerExpanded\(true\); \}\}
              className="relative w-full h-\[320px\] rounded-\[32px\] overflow-hidden cursor-pointer shadow-2xl group border border-white/20"
            >.*?
          \)\}"""

replacement_trending = """          {/* Trending Card (Glass UI) */}
          {songs.length > 0 && (
            <div className="flex overflow-x-auto gap-4 hide-scrollbar px-6 pb-4">
              <div 
                onClick={() => { playSong(songs[0]); setIsPlayerExpanded(true); }}
                className="relative w-[280px] h-[280px] shrink-0 rounded-[40px] overflow-hidden cursor-pointer shadow-2xl group border border-white/20 p-5 flex flex-col justify-between"
              >
                <div className="absolute inset-0 z-0">
                  <GridAlbumArt song={songs[0]} />
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4a0210]/80 via-transparent to-transparent"></div>
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-[10px] font-medium border border-white/20">Trending</div>
                  <div className="w-8 h-8 rounded-full bg-[#8b1521]/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <h2 className="text-white text-lg font-bold mb-0.5 drop-shadow-md">{songs[0].title}</h2>
                    <p className="text-white/80 text-[10px]">By {songs[0].artist || 'Various Artists'} • 25 Music</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:scale-105 transition-transform shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </button>
                </div>
              </div>
              
              {songs.length > 1 && (
                <div 
                  onClick={() => { playSong(songs[1]); setIsPlayerExpanded(true); }}
                  className="relative w-[280px] h-[280px] shrink-0 rounded-[40px] overflow-hidden cursor-pointer shadow-2xl group border border-white/20 p-5 flex flex-col justify-between"
                >
                  <div className="absolute inset-0 z-0 opacity-80">
                    <GridAlbumArt song={songs[1]} />
                    <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                  </div>
                </div>
              )}
            </div>
          )}"""

content = re.sub(target_trending, replacement_trending, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied red glass base layout")
