import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add activeTab state
state_marker = 'const [isAddingSong, setIsAddingSong] = useState(false)'
state_idx = code.find(state_marker)
if state_idx != -1:
    code = code[:state_idx] + 'const [activeTab, setActiveTab] = useState("home");\n    ' + code[state_idx:]
else:
    print("Could not find state marker")

# Replace render block
start_render = '{/* BOTTOM NAVIGATION BAR */}'
start_render_idx = code.find(start_render)

end_render = '{/* EXPANDED PLAYER (Visualizer) */}'
end_render_idx = code.find(end_render, start_render_idx)

if start_render_idx != -1 and end_render_idx != -1:
    NEW_NAV = """{/* BOTTOM NAVIGATION BAR */}
      <div className={`fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-0 sm:right-0 z-[50] flex justify-center transition-transform duration-300 ${isPlayerExpanded ? 'translate-y-[150%]' : 'translate-y-0'}`}>
         <SlideTabs 
           activeId={activeTab}
           onChange={(id) => {
             if (id === 'create') {
                 setIsAddingSong(true);
             } else {
                 setActiveTab(id);
             }
           }} 
           tabs={[
             { id: 'home', label: 'Home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
             { id: 'search', label: 'Search', icon: <Search className="w-4 h-4 sm:w-5 sm:h-5" /> },
             { id: 'library', label: 'Library', icon: <Library className="w-4 h-4 sm:w-5 sm:h-5" /> },
             ...(isAdmin ? [{ id: 'create', label: 'Create', icon: <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> }] : [])
           ]}
         />
      </div>
      
      """
    
    code = code[:start_render_idx] + NEW_NAV + code[end_render_idx:]

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Injected SlideTabs!")
