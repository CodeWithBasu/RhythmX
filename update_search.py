import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_search = """                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to listen to?"
                    className="w-full bg-white/10 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
                  />
                </div>"""

new_search = """                <div className="max-w-xl mx-auto">
                  <div className="flex items-center w-full bg-[#242424] hover:bg-[#2a2a2a] focus-within:bg-[#2a2a2a] focus-within:ring-1 focus-within:ring-white/20 rounded-full px-4 py-3 transition-all shadow-lg">
                    <Search className="w-6 h-6 text-white/50 shrink-0 mr-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What do you want to listen to?"
                      className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none font-medium text-sm sm:text-base"
                    />
                  </div>
                </div>"""

code = code.replace(old_search, new_search)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated search bar layout")
