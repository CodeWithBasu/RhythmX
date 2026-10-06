import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_marker = '{/* BOTTOM NAVIGATION BAR */}'
start_idx = code.find(start_marker)

end_marker = '{/* EXPANDED PLAYER (Visualizer) */}'
end_idx = code.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    NEW_NAV = """{/* BOTTOM NAVIGATION BAR */}
      <div className={`fixed bottom-0 left-0 right-0 z-[50] flex justify-center transition-transform duration-300 ${isPlayerExpanded ? 'translate-y-full' : 'translate-y-0'}`}>
         <AnimatedTabBar 
           items={tabItems} 
           onTabChange={(idx) => {
             if (idx === 4 && isAdmin) {
                 setIsAddingSong(true);
             }
           }} 
         />
      </div>
      
      """
    
    code = code[:start_idx] + NEW_NAV + code[end_idx:]
    with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Replaced properly!")
else:
    print("Could not find markers")
