import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_left = """<button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-0 bottom-4 w-16 items-center justify-center bg-gradient-to-r from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white"
        >
          <ChevronLeft className="w-10 h-10 drop-shadow-md" />
        </button>"""

new_left = """<button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-2 top-[60px] sm:top-[80px] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>"""

old_right = """<button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-0 bottom-4 w-16 items-center justify-center bg-gradient-to-l from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white"
        >
          <ChevronRight className="w-10 h-10 drop-shadow-md" />
        </button>"""

new_right = """<button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-2 top-[60px] sm:top-[80px] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>"""

code = code.replace(old_left, new_left)
code = code.replace(old_right, new_right)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated arrows to Spotify circular style")
