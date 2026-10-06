import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

state_target = """    const [isLyricsExpanded, setIsLyricsExpanded] = useState(false)"""
state_replace = """    const [isLyricsExpanded, setIsLyricsExpanded] = useState(false)
    const [likedSongs, setLikedSongs] = useState<string[]>([])
    
    useEffect(() => {
      try {
        const saved = localStorage.getItem('rhythmx_liked_songs')
        if (saved) setLikedSongs(JSON.parse(saved))
      } catch (e) {}
    }, [])

    const toggleLike = (songId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation()
      if (!songId) return
      setLikedSongs(prev => {
        const isLiked = prev.includes(songId)
        const next = isLiked ? prev.filter(id => id !== songId) : [...prev, songId]
        localStorage.setItem('rhythmx_liked_songs', JSON.stringify(next))
        return next
      })
    }"""
code = code.replace(state_target, state_replace)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Added likedSongs state")
