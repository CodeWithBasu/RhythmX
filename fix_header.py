import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""        \{/\* Top Header \(Glass UI\) \*/\}
        <div className="sticky top-0 z-40 bg-transparent px-6 pt-12 pb-4 flex flex-col gap-6 max-w-7xl mx-auto w-full">.*?<main className="py-2 space-y-6 max-w-7xl mx-auto w-full">
            \{activeTab === 'home' && \("""

replacement = """        <main className="py-2 space-y-6 max-w-7xl mx-auto w-full">
            {activeTab === 'home' && (
              <div className="space-y-6">
              
        {/* Top Header (Glass UI) */}
        <div className="bg-transparent px-6 pt-8 pb-4 flex flex-col gap-6 w-full">
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
                <button onClick={() => setIsAddingSong(true)} className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white shadow-lg">
                  <Upload className="w-5 h-5" />
                </button>
              )}
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white shadow-lg relative">
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
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-full py-3 pl-10 pr-4 outline-none focus:bg-white/20 transition-all text-sm shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button className="w-11 h-11 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white shrink-0 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7"></path><path d="M4 10V3"></path><path d="M12 21v-9"></path><path d="M12 8V3"></path><path d="M20 21v-5"></path><path d="M20 12V3"></path><path d="M1 14h6"></path><path d="M9 8h6"></path><path d="M17 16h6"></path></svg>
             </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
            <button className="px-5 py-2 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] text-white font-medium whitespace-nowrap text-xs">All</button>
            <button className="px-5 py-2 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-white/60 font-medium whitespace-nowrap text-xs hover:bg-white/10 transition-all">Hotel Package</button>
            <button className="px-5 py-2 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-white/60 font-medium whitespace-nowrap text-xs hover:bg-white/10 transition-all">Flight</button>
          </div>
        </div>"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved Top Header into activeTab === 'home'")
