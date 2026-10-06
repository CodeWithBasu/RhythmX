import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'  return \(\n    <div className="h-\[100dvh\].*?<audio ref=\{audioRef\} />', content, flags=re.DOTALL)
if match:
    with open('temp_current_layout.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(0))
    print("Extracted")
else:
    # try looser
    match2 = re.search(r'  return \(\s*<div.*?<audio ref=\{audioRef\} />', content, flags=re.DOTALL)
    if match2:
        with open('temp_current_layout.txt', 'w', encoding='utf-8') as out:
            out.write(match2.group(0))
        print("Extracted loose")
    else:
        print("Still not found")
