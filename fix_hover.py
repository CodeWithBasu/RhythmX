import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('const SongCarousel =')
end_idx = code.find('</section>', start_idx)

if start_idx != -1 and end_idx != -1:
    carousel = code[start_idx:end_idx]
    
    # Change outer group
    carousel = carousel.replace('className="relative group -mx-4"', 'className="relative group/carousel -mx-4"')
    
    # Change arrow hovers
    carousel = carousel.replace('group-hover:opacity-100', 'group-hover/carousel:opacity-100')
    
    # Change song item group
    carousel = carousel.replace('group/item', 'group')
    
    code = code[:start_idx] + carousel + code[end_idx:]
    
    with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed hover states")
else:
    print("Could not find SongCarousel")
