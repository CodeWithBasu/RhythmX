import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# find all useEffect occurrences
for m in re.finditer(r'useEffect\(\(\) => \{', code):
    start = m.end()
    # find the matching closing bracket } for the arrow function
    depth = 1
    idx = start
    while depth > 0 and idx < len(code):
        if code[idx] == '{': depth += 1
        elif code[idx] == '}': depth -= 1
        idx += 1
    
    # After the }, what follows?
    # Usually it's either `)` or `, [...] )`
    remainder = code[idx:idx+20].strip()
    if not remainder.startswith(','):
        print(f"NO DEP ARRAY: {code[start-20:start+50]}...")

