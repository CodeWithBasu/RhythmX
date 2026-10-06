const fs = require('fs');
let code = fs.readFileSync('app/api/songs/route.ts', 'utf8');

code = code.replace(
    /const \{ title, url, language, duration \} = body/,
    "const { title, url, language, duration, imageUrl } = body"
);

code = code.replace(
    /const newSong = \{[\s\S]*?uploadedByEmail: decodedToken.email\n    \}/,
    `const newSong = {
      title,
      url,
      imageUrl: imageUrl || null,
      language: language || 'Unknown',
      duration: duration || 0,
      createdAt: new Date(),
      uploadedBy: decodedToken.uid, // Track who uploaded the song
      uploadedByEmail: decodedToken.email
    }`
);

fs.writeFileSync('app/api/songs/route.ts', code);
console.log("Updated API route to accept imageUrl");
