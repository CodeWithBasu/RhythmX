import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the EXACT spot where Top Header ends:
#           </div>
#         </div>
#         <div className="space-y-6">
# 
#         {/* Trending Card (Glass UI) */}

# Replace this precise sequence:
content = re.sub(r'</div>\s+</div>\s+<div className="space-y-6">\s+\{/\* Trending Card \(Glass UI\) \*/\}', r'</div>\n        </div>\n\n        {/* Trending Card (Glass UI) */}', content)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed extra div robustly")
