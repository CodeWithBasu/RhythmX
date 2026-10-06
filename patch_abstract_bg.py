import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""    <div className="h-\[100dvh\] w-full bg-\[#290008\] bg-\[radial-gradient\(circle_at_20%_20%,_#9e0b23_0%,_#420210_50%,_#0a0002_100%\)\] text-white flex flex-col font-sans overflow-hidden relative">"""

replacement = """    <div className="h-[100dvh] w-full bg-[#1a0002] text-white flex flex-col font-sans overflow-hidden relative">
      {/* Abstract Photo-like Smoke Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
         <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[60%] rounded-full bg-[#ff4d6d]/30 blur-[120px]"></div>
         <div className="absolute top-[20%] right-[-30%] w-[80%] h-[70%] rounded-full bg-[#ffb3c1]/20 blur-[140px]"></div>
         <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-[#c9184a]/30 blur-[130px]"></div>
         <div className="absolute top-[35%] left-[-10%] w-[100%] h-[40%] -rotate-12 rounded-full bg-white/15 blur-[120px]"></div>
      </div>
      {/* Dark overlay to ensure text readability while keeping the smoke effect */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-black/10"></div>"""

content = re.sub(target, replacement, content)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied smoke background to Home")
