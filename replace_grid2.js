const fs = require('fs');
let code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

const regex = /\{song\.imageUrl \? \([\s\S]*?<\/Headphones>\s*\)\}/;

if (regex.test(code)) {
    code = code.replace(regex, "<GridAlbumArt song={song} />");
    fs.writeFileSync('components/music-visualizer.tsx', code);
    console.log("Successfully replaced with GridAlbumArt via Regex!");
} else {
    console.log("Could not find the regex match!");
}
