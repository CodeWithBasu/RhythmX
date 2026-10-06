import re

with open('components/ui/slide-tabs.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('bg-black/40 backdrop-blur-xl', 'bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-2xl border-t border-l border-white/20 border-b border-r border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]')
content = content.replace('bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]', 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]')

with open('components/ui/slide-tabs.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enhanced slide-tabs glass UI")
