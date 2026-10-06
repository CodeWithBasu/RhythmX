import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = """        {/* EXPANDED PLAYER (Visualizer) */}"""
replacement = """        {/* SCROLLBAR STYLES */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        {/* EXPANDED PLAYER (Visualizer) */}"""

if "{/* SCROLLBAR STYLES */}" not in code:
    code = code.replace(target, replacement)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
