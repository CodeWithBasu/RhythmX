import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add isLoadingSongs state
state_marker = 'const [songs, setSongs] = useState<any[]>([])'
if state_marker in code and 'const [isLoadingSongs, setIsLoadingSongs]' not in code:
    code = code.replace(state_marker, state_marker + '\n  const [isLoadingSongs, setIsLoadingSongs] = useState(true)')

# 2. Add finally block to fetchSongs
fetch_marker = """  const fetchSongs = () => {
    fetch(`${API_BASE}/api/songs`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setSongs(data)
      })
      .catch(e => {
        console.error("Fetch songs error", e)
      })
  }"""
  
# Wait, fetch_marker formatting might be different. Let's use string find and replace.
start_fetch = code.find('const fetchSongs = () => {')
end_fetch = code.find('}', code.find('console.error("Fetch songs error", e)'))

if start_fetch != -1 and end_fetch != -1:
    old_fetch = code[start_fetch:end_fetch+1]
    if 'setIsLoadingSongs(false)' not in old_fetch:
        new_fetch = old_fetch.replace('.catch(e => {', '.catch(e => {\n        setError(e.message)\n        console.error("Fetch songs error", e)\n      })\n      .finally(() => {\n        setIsLoadingSongs(false)\n      ')
        code = code.replace(old_fetch, new_fetch)

# 3. Add Skeletons to Quick Play Grid
quick_play_marker = '              {songs.slice(0, 5).map((song) => ('
quick_play_skel = """
              {isLoadingSongs && [...Array(5)].map((_, i) => (
                <div key={`quick-skel-${i}`} className="bg-white/5 rounded-md flex items-center gap-3 pr-3 overflow-hidden h-14 animate-pulse">
                  <div className="w-14 h-14 shrink-0 bg-white/10" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              ))}
              {songs.slice(0, 5).map((song) => ("""
if '{isLoadingSongs && [...Array(5)]' not in code:
    code = code.replace(quick_play_marker, quick_play_skel)


# 4. Add Skeleton Carousels
hits_marker = "{/* Today's biggest hits */}"
hits_skel = """{/* Skeleton Loading Rows */}
            {isLoadingSongs && (
              <>
                <section>
                  <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={`hits-skel-${i}`} className="shrink-0 w-[120px] sm:w-[160px] animate-pulse">
                        <div className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] mb-3 bg-white/10 rounded-md" />
                        <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </section>
                <section className="mt-8">
                  <div className="h-6 w-32 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={`chill-skel-${i}`} className="shrink-0 w-[120px] sm:w-[160px] animate-pulse">
                        <div className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] mb-3 bg-white/10 rounded-md" />
                        <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/3" />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
            
            {/* Today's biggest hits */}"""

if '{/* Skeleton Loading Rows */}' not in code:
    code = code.replace(hits_marker, hits_skel)


with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Added skeleton loaders!")
