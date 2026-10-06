import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Make the wrapper scrollable
old_wrapper = """        <div 
          className={`fixed inset-0 z-50 bg-[#0C0414] flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isPlayerExpanded ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {/* Collapse Button */}"""

new_wrapper = """        <div 
          className={`fixed inset-0 z-50 bg-[#0C0414] overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isPlayerExpanded ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="flex flex-col min-h-screen w-full relative">
          {/* Collapse Button */}"""

code = code.replace(old_wrapper, new_wrapper)

# Close the top section right before SCROLLABLE CARDS
old_bottom = """      {/* SCROLLABLE BELOW CARDS SECTION */}"""
new_bottom = """          </div>
      {/* SCROLLABLE BELOW CARDS SECTION */}"""

code = code.replace(old_bottom, new_bottom)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied layout fixes")
