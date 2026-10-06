const fs = require('fs');
let code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

if (!code.includes('ChevronDown')) {
  code = code.replace('from "lucide-react"', ', ChevronDown from "lucide-react"');
}

if (!code.includes('isPlayerExpanded')) {
  code = code.replace('const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)', 'const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)\n  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)');
}

const playCatch = `await audioRef.current.play().catch(err => console.log('Audio play interrupted:', err))`;
code = code.replace('await audioRef.current.play()', playCatch);

fs.writeFileSync('components/music-visualizer.tsx', code);
console.log('Done preliminary fixes');
