import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""        \{/\* Top Header \(Spotify Style\) \*/\}
        <div className="sticky top-0 z-40 bg-\[#121212\]/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">.*?</div>
          \{isAdmin && \(
            <button onClick=\{\(\) => setIsAddingSong\(true\)\} className="bg-white/10 text-white p-2 rounded-full">
              <Upload className="w-4 h-4" />
            </button>
          \)\}
        </div>

        <main className="px-4 py-2 space-y-8 max-w-7xl mx-auto w-full">
            \{activeTab === 'home' && \(
              <div className="space-y-8">
          
          \{/\* Quick Play Grid \*/\}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">"""

replacement = """        {/* Top Header (Glass UI) */}
        <div className="sticky top-0 z-40 bg-transparent px-4 pt-8 pb-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Welcome Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user ? <ProfileDropdown /> : <Link href="/signin" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg"><User className="w-6 h-6" /></Link>}
              <div className="flex flex-col">
                <span className="text-white/60 text-xs font-medium">Welcome Back</span>
                <span className="text-white text-base font-bold">{user ? user.displayName || 'Guest' : 'Guest'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button onClick={() => setIsAddingSong(true)} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg">
                  <Upload className="w-5 h-5" />
                </button>
              )}
              <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg relative">
                <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </button>
            </div>
          </div>
          
          {/* Search Bar Row */}
          <div className="flex items-center gap-3 relative">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="text"
                  placeholder="Search here..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-full py-3.5 pl-12 pr-4 outline-none focus:bg-white/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7"></path><path d="M4 10V3"></path><path d="M12 21v-9"></path><path d="M12 8V3"></path><path d="M20 21v-5"></path><path d="M20 12V3"></path><path d="M1 14h6"></path><path d="M9 8h6"></path><path d="M17 16h6"></path></svg>
             </button>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            <button className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium whitespace-nowrap text-sm shadow-lg">All</button>
            <button className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 font-medium whitespace-nowrap text-sm hover:bg-white/10 transition-all">Trending</button>
            <button className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 font-medium whitespace-nowrap text-sm hover:bg-white/10 transition-all">Playlists</button>
            <button className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 font-medium whitespace-nowrap text-sm hover:bg-white/10 transition-all">Artists</button>
          </div>
        </div>

        <main className="px-4 py-2 space-y-8 max-w-7xl mx-auto w-full">
            {activeTab === 'home' && (
              <div className="space-y-8">
          
          {/* Quick Play / Trending Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced header section")
