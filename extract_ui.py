import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

def extract_balanced(text, start_str):
    start = text.find(start_str)
    if start == -1: return None
    brace_count = 0
    in_block = False
    for i in range(start, len(text)):
        if text[i] == '{': 
            brace_count += 1
            in_block = True
        elif text[i] == '}': 
            brace_count -= 1
        if in_block and brace_count == 0:
            return text[start:i+1]
    return None

upload_modal = extract_balanced(code, '{isAddingSong && (')
if not upload_modal: print('Upload Modal failed')
else: print('Upload Modal size:', len(upload_modal))

bars = extract_balanced(code, '{audioData.slice(0, activeBars).map((height, index) => {')
if not bars: print('Bars failed')
else: print('Bars size:', len(bars))

audio = extract_balanced(code, '<audio')
# audio is HTML tag, so we need a different extractor.
audio_start = code.find('<audio')
audio_end = code.find('/>', audio_start) + 2
audio_tag = code[audio_start:audio_end]
print('Audio Tag size:', len(audio_tag))

# Let's save these to a JSON or just print them.
with open('extracted_ui.py', 'w', encoding='utf-8') as f:
    f.write(f'UPLOAD_MODAL = \"\"\"{upload_modal}\"\"\"\\n')
    f.write(f'BARS = \"\"\"{bars}\"\"\"\\n')
    f.write(f'AUDIO_TAG = \"\"\"{audio_tag}\"\"\"\\n')
