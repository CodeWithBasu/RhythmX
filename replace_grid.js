const fs = require('fs');
let code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

const target = `{song.imageUrl ? (
                                <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <Headphones className="text-white/10 w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                            )}`;

if (code.includes(target)) {
    code = code.replace(target, "<GridAlbumArt song={song} />");
    fs.writeFileSync('components/music-visualizer.tsx', code);
    console.log("Successfully replaced with GridAlbumArt!");
} else {
    console.log("Could not find the target string!");
}
