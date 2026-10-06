import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = """      const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(searchTitle)}`)
      if (!res.ok) throw new Error("Network response was not ok")"""

replacement = """      const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(searchTitle)}`)
      if (!res.ok) {
        console.warn("LRCLIB API returned status:", res.status)
        setIsFetchingLyrics(false)
        return
      }"""

code = code.replace(target, replacement)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Removed aggressive error throw for lyrics API")
