import sys

with open('app/settings/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix Hardware Acceleration
target_hw = 'w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer shadow-inner'
idx_hw = code.find(target_hw)
if idx_hw != -1:
    # Find the wrapper div's class name "flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
    # and add " cursor-pointer" and onClick
    wrapper_target = 'bg-white/[0.05] transition-colors"'
    wrapper_idx = code.rfind(wrapper_target, 0, idx_hw)
    if wrapper_idx != -1:
        code = code[:wrapper_idx] + 'bg-white/[0.05] transition-colors cursor-pointer" onClick={() => setHardwareAcceleration(!hardwareAcceleration)}' + code[wrapper_idx + len(wrapper_target):]
        
    # Re-find since string changed
    idx_hw = code.find(target_hw)
    code = code[:idx_hw] + 'w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${hardwareAcceleration ? \'bg-purple-500\' : \'bg-black/50 border border-white/10\'}' + code[idx_hw + len(target_hw):]
    
    # Replace inner div
    inner_target_hw = 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm'
    idx_inner = code.find(inner_target_hw, idx_hw)
    code = code[:idx_inner] + 'absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${hardwareAcceleration ? \'right-1 bg-white\' : \'left-1 bg-white/30\'}' + code[idx_inner + len(inner_target_hw):]

    # Convert className="w-12..." to className={`w-12...`}
    # Find the className=" before the target
    idx_class = code.rfind('className="', 0, code.find('w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${hardwareAcceleration'))
    code = code[:idx_class] + 'className={`' + code[idx_class + 11:]
    idx_quote = code.find('"', idx_class + 11)
    code = code[:idx_quote] + '`}' + code[idx_quote + 1:]
    
    # Same for inner div
    idx_inner_class = code.rfind('className="', 0, code.find('absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${hardwareAcceleration'))
    code = code[:idx_inner_class] + 'className={`' + code[idx_inner_class + 11:]
    idx_inner_quote = code.find('"', idx_inner_class + 11)
    code = code[:idx_inner_quote] + '`}' + code[idx_inner_quote + 1:]

# Fix Show Lyrics
target_ly = 'w-12 h-6 bg-black/50 border border-white/10 rounded-full relative cursor-pointer'
idx_ly = code.find(target_ly)
if idx_ly != -1:
    wrapper_target = 'bg-white/[0.05] transition-colors"'
    wrapper_idx = code.rfind(wrapper_target, 0, idx_ly)
    if wrapper_idx != -1:
        code = code[:wrapper_idx] + 'bg-white/[0.05] transition-colors cursor-pointer" onClick={() => setShowLyrics(!showLyrics)}' + code[wrapper_idx + len(wrapper_target):]
        
    idx_ly = code.find(target_ly)
    code = code[:idx_ly] + 'w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${showLyrics ? \'bg-purple-500\' : \'bg-black/50 border border-white/10\'}' + code[idx_ly + len(target_ly):]
    
    inner_target_ly = 'absolute left-1 top-1 w-4 h-4 bg-white/30 rounded-full'
    idx_inner = code.find(inner_target_ly, idx_ly)
    code = code[:idx_inner] + 'absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${showLyrics ? \'right-1 bg-white\' : \'left-1 bg-white/30\'}' + code[idx_inner + len(inner_target_ly):]

    # Convert className=" to className={`
    idx_class = code.rfind('className="', 0, code.find('w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${showLyrics'))
    code = code[:idx_class] + 'className={`' + code[idx_class + 11:]
    idx_quote = code.find('"', idx_class + 11)
    code = code[:idx_quote] + '`}' + code[idx_quote + 1:]
    
    idx_inner_class = code.rfind('className="', 0, code.find('absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${showLyrics'))
    code = code[:idx_inner_class] + 'className={`' + code[idx_inner_class + 11:]
    idx_inner_quote = code.find('"', idx_inner_class + 11)
    code = code[:idx_inner_quote] + '`}' + code[idx_inner_quote + 1:]


with open('app/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Toggles replaced successfully")
