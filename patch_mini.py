import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""className="fixed bottom-\[70px\] left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-\[500px\] bg-\[#3d1515\] rounded-lg p-2 flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-\[#4d1a1a\] transition-colors z-\[60\] border-b-2 border-white/10\""""

replacement = """className="fixed bottom-[70px] left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-white/20 transition-colors z-[60] border border-white/20\""""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced mini player")
