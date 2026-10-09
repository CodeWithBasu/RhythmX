import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Refine Search Bar (Home)
content = content.replace(
    'w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-full py-3 pl-10 pr-4 outline-none focus:bg-white/20 transition-all text-sm shadow-md',
    'w-full bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] text-white placeholder:text-white/50 rounded-full py-3 pl-10 pr-4 outline-none focus:bg-white/[0.15] focus:border-white/30 transition-all text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
)

# Refine Search Bar (Search Tab)
content = content.replace(
    'flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 focus-within:bg-white/20 rounded-full px-4 py-3 transition-all shadow-lg',
    'flex items-center w-full bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] hover:bg-white/[0.12] focus-within:bg-white/[0.15] focus-within:border-white/30 rounded-full px-4 py-3 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
)

# Refine Categories (Selected)
content = content.replace(
    'px-5 py-2 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] text-white font-medium whitespace-nowrap text-xs',
    'px-5 py-2 rounded-full bg-white/[0.15] backdrop-blur-xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.2)] text-white font-medium whitespace-nowrap text-xs'
)

# Refine Categories (Unselected)
content = content.replace(
    'px-5 py-2 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-white/60 font-medium whitespace-nowrap text-xs hover:bg-white/10 transition-all',
    'px-5 py-2 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-white/60 font-medium whitespace-nowrap text-xs hover:bg-white/[0.1] transition-all'
)

# Refine List Items / Rows
content = content.replace(
    'flex items-center gap-4 p-2 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded-[24px] cursor-pointer group hover:bg-white/10 transition-colors',
    'flex items-center gap-4 p-2 bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)] rounded-[24px] cursor-pointer group hover:bg-white/[0.12] transition-colors'
)

# Refine Buttons (Bell, Upload, Settings)
content = content.replace(
    'w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white shadow-lg relative',
    'w-10 h-10 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-white/[0.15] flex items-center justify-center text-white transition-colors relative'
)
content = content.replace(
    'w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white shadow-lg',
    'w-10 h-10 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-white/[0.15] flex items-center justify-center text-white transition-colors'
)
content = content.replace(
    'w-11 h-11 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white shrink-0 shadow-lg',
    'w-11 h-11 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-white/[0.15] flex items-center justify-center text-white shrink-0 transition-colors'
)

# Refine Play Button in Rows
content = content.replace(
    'w-8 h-8 mr-2 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-all shadow-md shrink-0',
    'w-8 h-8 mr-2 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.2] shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:bg-white/[0.2] transition-all shrink-0'
)

# Refine Expanded Player Controls Background
content = content.replace(
    'w-full bg-black/40 backdrop-blur-2xl border-t border-white/5 pt-6 pb-12 px-6 sm:px-12 relative z-20 shrink-0',
    'w-full bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 pt-6 pb-12 px-6 sm:px-12 relative z-20 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]'
)

# Refine SlideTabs Background
with open('components/ui/slide-tabs.tsx', 'r', encoding='utf-8') as f:
    tabs_content = f.read()

tabs_content = tabs_content.replace(
    'bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-2xl border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
    'bg-white/[0.08] backdrop-blur-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
)

with open('components/ui/slide-tabs.tsx', 'w', encoding='utf-8') as f:
    f.write(tabs_content)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied perfect clear glassmorphism.")
