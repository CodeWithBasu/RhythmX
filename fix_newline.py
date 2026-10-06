import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the newline issue
code = re.sub(r"\.join\('[\r\n]+'\)", r".join('\\n')", code)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
