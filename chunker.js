const fs = require('fs');
let code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

function extractChunk(startStr, endStr) {
    const start = code.indexOf(startStr);
    if (start === -1) return null;
    const end = code.indexOf(endStr, start);
    if (end === -1) return null;
    return code.substring(start, end);
}

// Chunks to find:
// 1. Header
const header = extractChunk('{/* Header */}', '{/* Visualizer Canvas & Bars */}');
// 2. Visualizer
const visualizer = extractChunk('{/* Visualizer Canvas & Bars */}', '{/* Bottom Section: Current Song Info & Controls */}');
// 3. Info & Controls
// Wait, the "Bottom Section" contains the controls AND the Discover grid?
// Let's check the code:
// The code has `{/* Bottom Section: Current Song Info & Controls */}`
// and then `{/* Discover Grid */}`? Let's check.
console.log("Header found:", !!header);
console.log("Visualizer found:", !!visualizer);

const controlsStart = code.indexOf('{/* Bottom Section: Current Song Info & Controls */}');
const controlsSnippet = code.substring(controlsStart, controlsStart + 200);
console.log("Controls snippet:", controlsSnippet);

const discoverStart = code.indexOf('Discover</h2>'); // Or similar
console.log("Discover start index:", discoverStart);

