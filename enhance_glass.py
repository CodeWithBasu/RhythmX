import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Enhance general background
content = content.replace('bg-[radial-gradient(circle_at_50%_50%,_#7d0b17_0%,_#300208_60%,_#0d0002_100%)]', 'bg-[radial-gradient(circle_at_20%_20%,_#8a0a1f_0%,_#3a010b_50%,_#0a0002_100%)]')

# Update linear gradient from before
content = content.replace('bg-gradient-to-br from-[#730d17] via-[#350207] to-[#0a0001]', 'bg-[#1a0005] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#aa0d24] via-[#4a0210] to-[#0a0002]')
content = content.replace('bg-gradient-to-br from-[#4a0484] via-[#2a014a] to-black', 'bg-[#1a0005] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#aa0d24] via-[#4a0210] to-[#0a0002]')

# Enhance Header Search Input
content = content.replace('bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-full py-3', 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-white placeholder:text-white/50 rounded-full py-3')

# Enhance Category Pills
content = content.replace('bg-white/20 backdrop-blur-md border border-white/30', 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]')
content = content.replace('bg-white/5 backdrop-blur-md border border-white/10', 'bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.1)]')

# Enhance Trending Card Container
content = content.replace('rounded-[40px] overflow-hidden cursor-pointer shadow-2xl group border border-white/20', 'rounded-[40px] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] group border-t border-l border-white/30 border-b border-r border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl')

# Enhance Row Items (Top Play list)
content = content.replace('p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] cursor-pointer group hover:bg-white/10 transition-colors', 'p-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-white/5 rounded-[24px] cursor-pointer group hover:bg-white/20 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.2)]')
content = content.replace('p-2.5 rounded-[32px] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors', 'p-2.5 rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-white/5 hover:bg-white/20 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.2)]')

# Enhance Small circular buttons (like bell, search filter, row play button)
content = content.replace('rounded-full bg-white/10 backdrop-blur-md border border-white/20', 'rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-t border-l border-white/30 border-b border-r border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]')
content = content.replace('rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20', 'rounded-full bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-xl text-white flex items-center justify-center border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_8px_16px_rgba(0,0,0,0.4)]')
content = content.replace('rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-white', 'rounded-full bg-gradient-to-br from-black/40 to-transparent backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-white/5 text-white shadow-[0_8px_16px_rgba(0,0,0,0.4)]')
content = content.replace('rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-red-500', 'rounded-full bg-gradient-to-br from-black/40 to-transparent backdrop-blur-xl border-t border-l border-white/20 border-b border-r border-white/5 text-red-500 shadow-[0_8px_16px_rgba(0,0,0,0.4)]')

# Enhance Expanded Player Controls Container
content = content.replace('bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl', 'bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border-t border-l border-white/20 border-b border-r border-white/5 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]')

# Enhance Album Art glowing circles in Expanded Player
content = content.replace('border-[20px] border-white/5 backdrop-blur-sm', 'border-[20px] border-white/10 backdrop-blur-md mix-blend-overlay')
content = content.replace('border border-white/10 absolute opacity-50', 'border-2 border-white/20 absolute opacity-40 backdrop-blur-sm mix-blend-overlay')

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enhanced glassmorphism successfully.")
