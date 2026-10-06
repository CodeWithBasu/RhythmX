const fs = require('fs');
const code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');
const match = code.match(/return \(\s*<div \s*className="min-h-screen/m);
if (match) {
    console.log("MATCH_INDEX: " + match.index);
    fs.writeFileSync('top_half.txt', code.substring(0, match.index));
} else {
    console.log("NO MATCH");
}
