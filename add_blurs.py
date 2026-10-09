import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""    <div className="h-\[100dvh\] w-full bg-\[#290008\] bg-\[radial-gradient\(circle_at_20%_20%,_#9e0b23_0%,_#420210_50%,_#0a0002_100%\)\] text-white flex flex-col font-sans overflow-hidden relative">"""

replacement = """    <div className="h-[100dvh] w-full bg-[#1a0005] text-white flex flex-col font-sans overflow-hidden relative">
      {/* Background Lighting Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Blur */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[50vh] bg-red-600/30 blur-[120px] rounded-full mix-blend-screen"></div>
        {/* Bottom Blur */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[50vh] bg-red-600/30 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>"""

content = re.sub(target, replacement, content)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added red blur shapes")
