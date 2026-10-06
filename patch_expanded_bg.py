import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('background: `linear-gradient(135deg, ${lyricsBgColor} 0%, #0C0414 70%)`', 'background: `radial-gradient(circle at 50% 50%, #7d0b17 0%, #300208 60%, #0d0002 100%)`')

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
