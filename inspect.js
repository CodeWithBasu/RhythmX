const fs = require('fs');
let code = fs.readFileSync('components/music-visualizer.tsx', 'utf8');

const searchStr = '<div className="h-[100dvh] w-full bg-[#0C0414] flex flex-col overflow-hidden font-sans">';
const startIndex = code.indexOf(searchStr);
console.log('Found wrapper at:', startIndex);

// Also let's extract the header part to make sure I don't lose the admin logic
const headerStart = code.indexOf('<!-- Header -->');
// Wait, it is {/* Header */}
const headerSearch = '{/* Header */}';
const headerIndex = code.indexOf(headerSearch);
console.log('Found Header at:', headerIndex);

