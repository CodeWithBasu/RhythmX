import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

lyric_effect = """
  // Sync lyrics with audio time
  useEffect(() => {
    if (lyrics.length > 0 && currentTime > 0) {
      const idx = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1]
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
      })
      if (idx !== -1 && idx !== currentLyricIndex) {
        setCurrentLyricIndex(idx)
      }
    }
  }, [currentTime, lyrics, currentLyricIndex])
"""
code = code.replace("  // Handle audio events", lyric_effect + "\n  // Handle audio events")

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
