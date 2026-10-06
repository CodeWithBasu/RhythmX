import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

count = 0
for m in re.finditer(r'useEffect\s*\(', code):
    start = m.end()
    # match closing `}` or `})` or `}, [deps])`
    # We can just extract the whole block by counting braces
    depth = 1
    idx = start
    while depth > 0 and idx < len(code):
        if code[idx] == '{': depth += 1
        elif code[idx] == '}': depth -= 1
        elif code[idx] == '(': depth += 1
        elif code[idx] == ')': depth -= 1
        idx += 1
        
    chunk = code[m.start():idx]
    print(f"--- useEffect {count} ---")
    print(chunk)
    count += 1
