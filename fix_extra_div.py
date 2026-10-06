import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""            </div>
          </div>
              <div className="space-y-6">
              
          \{/\* Trending Card \(Glass UI\) \*/\}"""

replacement = """            </div>
          </div>
              
          {/* Trending Card (Glass UI) */}"""

content = re.sub(target, replacement, content)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed extra div")
