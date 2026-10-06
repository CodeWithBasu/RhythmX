import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""        <div className="flex flex-col min-h-screen w-full relative pt-12 pb-8 px-6">
          \{/\* Top Bar \*/}"""

replacement = """        <div className="flex flex-col min-h-screen w-full relative pt-12 pb-8 px-6">
          {/* Abstract Photo-like Smoke Background for Expanded Player */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
             <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-[#ff4d6d]/30 blur-[120px]"></div>
             <div className="absolute top-[20%] right-[-40%] w-[90%] h-[70%] rounded-full bg-white/20 blur-[140px]"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[50%] rounded-full bg-[#c9184a]/20 blur-[130px]"></div>
          </div>
          <div className="absolute inset-0 z-0 pointer-events-none bg-black/10"></div>

          {/* Top Bar */}"""

content = re.sub(target, replacement, content)

# I also should remove the radial-gradient from inline style and set base bg.
target_style = r"""        style=\{\{
          background: `radial-gradient\(circle at 50% 30%, #9c091e 0%, #3d020d 60%, #0d0002 100%\)`
        \}\}"""

replacement_style = """        style={{ backgroundColor: '#1a0002' }}"""

content = re.sub(target_style, replacement_style, content)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied smoke background to Expanded Player")
