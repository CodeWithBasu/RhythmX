import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = r'className=\{\`bg-\[\#603B2C\] rounded-2xl shadow-2xl relative transition-all duration-500 \$\{isLyricsExpanded \? \'fixed inset-0 z-\[100\] rounded-none flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-24\' \: \'p-6 overflow-hidden group\'\}\`\}'
replacement = r'className={`bg-[#603B2C] rounded-2xl shadow-2xl transition-all duration-500 ${isLyricsExpanded ? "fixed inset-0 z-[100] rounded-none flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-24" : "relative p-6 overflow-hidden group"}`}'

code = re.sub(target, replacement, code)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed lyrics card CSS clash")
