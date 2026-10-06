import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add max-w-7xl mx-auto to Header
code = code.replace('<div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between">',
                    '<div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-xl px-4 py-4"><div className="max-w-7xl mx-auto flex items-center justify-between w-full">')
# Close the inner div of the header (which ends before <main>)
header_end = code.find('</main>')
if header_end != -1:
    header_start = code.rfind('</div>', 0, code.find('<main', 0, header_end))
    if header_start != -1:
        # Actually it's easier to just find the exact header structure
        pass
    
# Let's just do targeted replaces for the layout containers.
def replace_class(tag_string, new_class):
    return tag_string.replace('className="', f'className="{new_class} ')

code = code.replace('<main className="px-4 py-2 space-y-8">', '<main className="px-4 py-2 space-y-8 max-w-7xl mx-auto w-full">')

# Header inner wrap
code = code.replace('<div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between">',
                    '<div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">')


# 2. Fix the grid to have more columns on ultrawide
code = code.replace('grid-cols-2 sm:grid-cols-3 md:grid-cols-4', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6')

# 3. Make square cards responsive (120px on mobile, 160px on desktop)
# I previously changed w-[140px] to w-[112px]. Let's change them to responsive classes.
code = code.replace('w-[112px]', 'w-[120px] sm:w-[160px]')
code = code.replace('h-[112px]', 'h-[120px] sm:h-[160px]')

# 4. Constrain the bottom nav bar
old_bottom = 'flex items-center justify-around px-2 sm:px-8 pb-2'
new_bottom = 'flex items-center justify-around px-2 sm:px-8 pb-2 max-w-md mx-auto w-full'
code = code.replace(old_bottom, new_bottom)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied responsive layout tweaks")
