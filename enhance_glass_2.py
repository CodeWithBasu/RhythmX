import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Enhance main background
content = content.replace('bg-gradient-to-br from-[#5c0a15] via-[#240106] to-black', 'bg-[#290008] bg-[radial-gradient(circle_at_20%_20%,_#9e0b23_0%,_#420210_50%,_#0a0002_100%)]')

# Enhance Mini Player
content = content.replace('bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-white/20 transition-colors z-[60] border border-white/20', 'bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl rounded-[24px] p-2 flex items-center gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] cursor-pointer hover:bg-white/20 transition-colors z-[60] border-t border-l border-white/20 border-b border-r border-white/5')

# Make sure Expanded Player background is enhanced
content = content.replace('background: `radial-gradient(circle at 50% 50%, #7d0b17 0%, #300208 60%, #0d0002 100%)`', 'background: `radial-gradient(circle at 50% 30%, #9c091e 0%, #3d020d 60%, #0d0002 100%)`')

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enhanced remaining glass elements.")
