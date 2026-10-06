async function test() {
  const titles = ['Kala Chashma (Baar Baar Dekho)', 'Bad Guy (Billie Eilish)'];
  for (const title of titles) {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=song&limit=1`);
    const data = await res.json();
    console.log(title, data.results.length > 0 ? 'FOUND' : 'NOT FOUND');
  }
}
test();
