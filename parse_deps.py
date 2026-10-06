import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

effects = []
for m in re.finditer(r'useEffect\s*\(', code):
    # extract the block
    start = m.end()
    # just grab the next 1000 characters
    chunk = code[start:start+1000]
    # find the matching closing brace of the arrow function
    # this is hard to do with regex, but we can look for `}, [`
    match = re.search(r'\}\s*,\s*\[(.*?)\]\s*\)', chunk)
    if match:
        print(f"Deps: [{match.group(1)}]")
    else:
        # maybe empty deps or no deps
        match2 = re.search(r'\}\s*\)', chunk)
        if match2:
            print(f"NO DEPS OR ERROR: {chunk[:100]}...")
        else:
            print("Couldn't parse")

