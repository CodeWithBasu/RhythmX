import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

classes = set(re.findall(r'className="([^"]*backdrop-blur[^"]*)"', content))
for c in classes:
    print(c)
