import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix setAudioData error
code = re.sub(
    r'setAudioData\(new Array\(activeBars\)\.fill\(0\.01\)\)',
    r'audioDataRef.current = new Array(activeBars).fill(0.01)',
    code
)

# Fix theme used before declaration
# Find where themeRef is defined
theme_ref_code = """  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])
  
  const isPlayingRef = useRef(isPlaying)
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])
  
  const audioDataRef = useRef<number[]>(new Array(80).fill(0.01))"""

code = code.replace(theme_ref_code, "  const audioDataRef = useRef<number[]>(new Array(80).fill(0.01))")

# Add it after theme is defined
target = """  const [theme, setTheme] = useState("neon")"""
replacement = """  const [theme, setTheme] = useState("neon")
  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])
  
  const isPlayingRef = useRef(isPlaying)
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])"""

code = code.replace(target, replacement)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed TS errors")
