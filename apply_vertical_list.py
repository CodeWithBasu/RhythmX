import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_carousel = r"""const SongCarousel = \(\{ title, songs, onPlay \}: \{ title: string, songs: any\[\], onPlay: \(song: any\) => void \}\) => \{.*?</section>\n  \);\n\};"""

replacement_carousel = """const SongCarousel = ({ title, songs, onPlay }: { title: string, songs: any[], onPlay: (song: any) => void }) => {
  return (
    <section className="px-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <span className="text-xs text-white/60">View all</span>
      </div>
      <div className="flex flex-col gap-3">
        {songs.map((song) => (
          <div 
            key={`list-${title}-${song.id}`} 
            onClick={() => onPlay(song)} 
            className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] cursor-pointer group hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-md border border-white/5 relative">
              <GridAlbumArt song={song} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
              <p className="text-white/60 text-[10px] truncate mt-0.5">By {song.artist || 'Various Artists'} • 25 Music</p>
            </div>
            <button className="w-8 h-8 mr-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-all shadow-md shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};"""

content = re.sub(target_carousel, replacement_carousel, content, flags=re.DOTALL)

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced carousel with vertical list")
