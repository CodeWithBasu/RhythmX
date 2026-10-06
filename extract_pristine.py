with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

idx1 = code.find('{/* EXPANDED PLAYER (Visualizer) */}')
idx2 = code.find('{/* Modals & Audio Element */}')
with open('pristine_expanded.txt', 'w', encoding='utf-8') as f:
    f.write(code[idx1:idx2])
