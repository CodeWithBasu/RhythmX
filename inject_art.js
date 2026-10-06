const fs = require('fs');
let code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

const artComponent = `
const GridAlbumArt = ({ song }: { song: any }) => {
  const [imgUrl, setImgUrl] = React.useState<string | null>(song.imageUrl || null)

  React.useEffect(() => {
    if (song.imageUrl) return;

    let isMounted = true;
    const fetchArt = async () => {
      try {
        const cleanTitle = song.title.replace('~/', '').trim();
        const res = await fetch(\`https://itunes.apple.com/search?term=\${encodeURIComponent(cleanTitle)}&entity=song&limit=1\`);
        const data = await res.json();
        if (isMounted && data.results && data.results.length > 0) {
           setImgUrl(data.results[0].artworkUrl100.replace('100x100', '300x300'));
        }
      } catch (e) {
      }
    };
    fetchArt();
    return () => { isMounted = false; };
  }, [song.title, song.imageUrl]);

  if (imgUrl) {
    return <img src={imgUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
  }

  return <Headphones className="text-white/10 w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
}

export default function Component`;

code = code.replace("export default function Component", artComponent);

const gridImageRegex = /\{song\.imageUrl \? \([\s\S]*?<\/Headphones>\s*\)\}/;
code = code.replace(gridImageRegex, "<GridAlbumArt song={song} />");

fs.writeFileSync('components/music-visualizer.tsx', code);
console.log("GridAlbumArt injected successfully.");
