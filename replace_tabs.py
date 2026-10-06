import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_marker = 'const tabItems: TabItem[] = ['
end_marker = '];\n\nexport default function Component()'

start_idx = code.find(start_marker)
end_idx = code.find(end_marker)

if start_idx != -1 and end_idx != -1:
    NEW_TABS = """const tabItems: TabItem[] = [
  {
    color: "#a855f7",
    icon: <Home className="icon" />,
  },
  {
    color: "#a855f7",
    icon: <Search className="icon" />,
  },
  {
    color: "#a855f7",
    icon: <Library className="icon" />,
  },
  {
    color: "#a855f7",
    icon: <PlusCircle className="icon" />,
  },
"""
    
    code = code[:start_idx] + NEW_TABS + code[end_idx:]
    with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Replaced tabItems")
else:
    print("Could not find markers")
