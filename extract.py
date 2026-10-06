import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the upload modal
match = re.search(r'(\{isAddingSong && \(\s*<motion\.div.*?)\{/\* Bottom Bar', content, re.DOTALL)
if match:
    upload_modal = match.group(1).strip()
    # It might end with </AnimatePresence> or similar. Let's just find the exact string.
    print(upload_modal[:100])
    print('....')
    print(upload_modal[-100:])
else:
    print("Could not find upload modal")