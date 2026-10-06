import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

match = re.search(r'\}\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\*\s*Modals', code)
if match:
    print("Found it!")
else:
    print("Not found with that regex.")
