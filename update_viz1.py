import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace AnimatedTabBar import with SlideTabs
code = code.replace('import { AnimatedTabBar } from "@/components/ui/animated-tab-bar";', 
                    'import { SlideTabs } from "@/components/ui/slide-tabs";')

# Replace the tabItems and AnimatedTabBar block
# Find where the tabItems array starts
start_marker = 'import type { TabItem }'
start_idx = code.find(start_marker)
if start_idx == -1:
    print("Could not find start marker")
    sys.exit(1)

# Find where it ends
end_marker = 'export default function Component()'
end_idx = code.find(end_marker, start_idx)
if end_idx == -1:
    print("Could not find end marker")
    sys.exit(1)

NEW_IMPORTS = """
"""

code = code[:start_idx] + NEW_IMPORTS + code[end_idx:]


# Now find the actual render block for AnimatedTabBar
start_render = '{/* BOTTOM NAVIGATION BAR */}'
start_render_idx = code.find(start_render)

end_render = '{/* EXPANDED PLAYER (Visualizer) */}'
end_render_idx = code.find(end_render, start_render_idx)

if start_render_idx != -1 and end_render_idx != -1:
    # Inside the component, we need activeTab state. Wait, we can just use `activeTab` or hardcode it since it's just a visualizer.
    # Actually, we can add `activeTab` to the state block!
    pass

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Removed old tab items")
