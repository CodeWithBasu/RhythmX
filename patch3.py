import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add formatTime right before handleAdminLogin
format_time_fn = """
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

"""
if 'const formatTime' not in code:
    code = code.replace('const handleAdminLogin = () => {', format_time_fn + '  const handleAdminLogin = () => {')

# 2. Fix ProfileDropdown
code = code.replace('<ProfileDropdown user={user} />', '<ProfileDropdown />')

# 3. Fix TextType
code = code.replace('texts={DEFAULT_TEXT}', 'text={["RHYTHMX", "SONIC REALITY"]}')
code = code.replace('speed={80}', 'typingSpeed={80}')
# TextType might not take pauseTime? Let's just remove it if so, but I'll leave it unless typescript complains.

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched typescript errors!")
