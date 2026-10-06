import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove audioData state and replace with a ref for theme/isPlaying
old_state = """  const [audioData, setAudioData] = useState<number[]>(() => new Array(80).fill(0.01))"""
new_state = """  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])
  
  const isPlayingRef = useRef(isPlaying)
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])
  
  const audioDataRef = useRef<number[]>(new Array(80).fill(0.01))"""
code = code.replace(old_state, new_state)

# 2. Fix the initial bars reset
old_reset = """    useEffect(() => {
      barsRef.current = activeBars
      setAudioData(new Array(activeBars).fill(0.01))
    }, [activeBars])"""
new_reset = """    useEffect(() => {
      barsRef.current = activeBars
      audioDataRef.current = new Array(activeBars).fill(0.01)
    }, [activeBars])"""
code = code.replace(old_reset, new_reset)

# 3. Update the updateAudioData function
old_update = """    const extraSmoothed = smoothData(smoothedData)

    setAudioData(extraSmoothed)
  }"""
new_update = """    const extraSmoothed = smoothData(smoothedData)
    audioDataRef.current = extraSmoothed
    
    // Direct DOM manipulation for maximum performance
    for (let i = 0; i < bars; i++) {
        const el = document.getElementById(`visualizer-bar-${i}`)
        if (el) {
            const height = extraSmoothed[i] || 0
            const colors = getBarColors(i, bars, height, isPlayingRef.current, themeRef.current)
            el.style.height = `${height * 100}%`
            el.style.opacity = height > 0 ? "1" : "0"
            el.style.backgroundColor = colors.bg
            el.style.boxShadow = isPlayingRef.current ? `0 0 ${Math.floor(height * 6)}px ${colors.glow}` : 'none'
        }
    }
  }"""
code = code.replace(old_update, new_update)

# 4. Replace the JSX rendering of the bars
# We need to find the JSX for the bars mapping
old_jsx_pattern = r'\{audioData\.slice\(0, activeBars\)\.map\(\(height, index\) => \{.*?\}\)\}'
new_jsx = """{Array.from({ length: activeBars }).map((_, index) => {
              return (
                <div
                  key={index}
                  id={`visualizer-bar-${index}`}
                  className="rounded-t-sm flex-1 max-w-[4px] sm:max-w-[5px] md:max-w-[6px] lg:max-w-[8px] transition-all duration-[50ms]"
                  style={{
                    height: '1%',
                    opacity: 0,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    boxShadow: 'none'
                  }}
                />
              );
            })}"""
code = re.sub(old_jsx_pattern, new_jsx, code, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied DOM optimization")
