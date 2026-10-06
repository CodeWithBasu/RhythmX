import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

idx1 = code.find('{/* EXPANDED PLAYER (Visualizer) */}')
idx2 = code.find('{/* Modals & Audio Element */}')
print("idx1:", idx1)
print("idx2:", idx2)
if idx1 != -1 and idx2 != -1:
    print(code[idx1:idx1+100])
