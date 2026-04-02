import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb'

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your Mongo URI to .env')
}

const uri = process.env.DATABASE_URL
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const hitSongs = [
  // --- HINDI: MODERN HITS ---
  { title: "Kesariya (Brahmastra)", language: "Hindi", url: "/songs/Kesariya.mp3", duration: 172, createdAt: new Date(), updatedAt: new Date() },
  { title: "Apna Bana Le (Bhediya)", language: "Hindi", url: "/songs/Apna Bana Le.mp3", duration: 264, createdAt: new Date(), updatedAt: new Date() },
  { title: "Besharam Rang (Pathaan)", language: "Hindi", url: "/songs/Besharam Rang.mp3", duration: 258, createdAt: new Date(), updatedAt: new Date() },
  { title: "Maan Meri Jaan (King)", language: "Hindi", url: "/songs/Maan Meri Jaan.mp3", duration: 194, createdAt: new Date(), updatedAt: new Date() },
  { title: "Raataan Lambiyan (Shershaah)", language: "Hindi", url: "/songs/Raataan Lambiyan.mp3", duration: 230, createdAt: new Date(), updatedAt: new Date() },
  { title: "Tum Hi Ho (Aashiqui 2)", language: "Hindi", url: "/songs/Tum Hi Ho.mp3", duration: 262, createdAt: new Date(), updatedAt: new Date() },
  { title: "Channa Mereya (ADHM)", language: "Hindi", url: "/songs/Channa Mereya.mp3", duration: 289, createdAt: new Date(), updatedAt: new Date() },
  
  // --- HINDI: PARTY ANTHEMS ---
  { title: "Aankh Marey (Simmba)", language: "Hindi", url: "/songs/Aankh Marey Simmba.mp3", duration: 213, createdAt: new Date(), updatedAt: new Date() },
  { title: "Bom Diggy Diggy", language: "Hindi", url: "/songs/Bom Diggy Diggy.mp3", duration: 238, createdAt: new Date(), updatedAt: new Date() },
  { title: "Dj Waley Babu", language: "Hindi", url: "/songs/Dj Waley Babu.mp3", duration: 169, createdAt: new Date(), updatedAt: new Date() },
  { title: "Kala Chashma", language: "Hindi", url: "/songs/Kala Chashma.mp3", duration: 187, createdAt: new Date(), updatedAt: new Date() },
  { title: "Kar Gayi Chull", language: "Hindi", url: "/songs/Kar Gayi Chull.mp3", duration: 189, createdAt: new Date(), updatedAt: new Date() },
  { title: "Wakhra Swag", language: "Hindi", url: "/songs/Wakhra Swag Badshah.mp3", duration: 180, createdAt: new Date(), updatedAt: new Date() },
  { title: "The Humma Song", language: "Hindi", url: "/songs/The Humma Song.mp3", duration: 179, createdAt: new Date(), updatedAt: new Date() },
  { title: "Ghungroo (War)", language: "Hindi", url: "/songs/Ghungroo.mp3", duration: 302, createdAt: new Date(), updatedAt: new Date() },

  // --- HINDI: TIMELESS CLASSICS ---
  { title: "Lag Jaa Gale", language: "Hindi", url: "/songs/Lag Jaa Gale.mp3", duration: 254, createdAt: new Date(), updatedAt: new Date() },
  { title: "Roop Tera Mastana", language: "Hindi", url: "/songs/Roop Tera Mastana.mp3", duration: 220, createdAt: new Date(), updatedAt: new Date() },
  { title: "Gulabi Aankhen", language: "Hindi", url: "/songs/Gulabi Aankhen.mp3", duration: 198, createdAt: new Date(), updatedAt: new Date() },
  { title: "Pehla Nasha", language: "Hindi", url: "/songs/Pehla Nasha.mp3", duration: 270, createdAt: new Date(), updatedAt: new Date() },
  { title: "Dil To Pagal Hai", language: "Hindi", url: "/songs/Dil To Pagal Hai.mp3", duration: 332, createdAt: new Date(), updatedAt: new Date() },
  { title: "Tujhe Dekha To", language: "Hindi", url: "/songs/Tujhe Dekha To.mp3", duration: 302, createdAt: new Date(), updatedAt: new Date() },

  // --- ENGLISH: CHART TOPPERS ---
  { title: "As It Was (Harry Styles)", language: "English", url: "/songs/As It Was.mp3", duration: 167, createdAt: new Date(), updatedAt: new Date() },
  { title: "Flowers (Miley Cyrus)", language: "English", url: "/songs/Flowers.mp3", duration: 200, createdAt: new Date(), updatedAt: new Date() },
  { title: "Stay (Justin Bieber)", language: "English", url: "/songs/Stay.mp3", duration: 141, createdAt: new Date(), updatedAt: new Date() },
  { title: "Blinding Lights", language: "English", url: "/songs/The Weeknd - Blinding Lights (Official Audio).mp3", duration: 200, createdAt: new Date(), updatedAt: new Date() },
  { title: "Starboy", language: "English", url: "/songs/The Weeknd.mp3", duration: 230, createdAt: new Date(), updatedAt: new Date() },
  { title: "Levitating", language: "English", url: "/songs/Dua Lipa.mp3", duration: 203, createdAt: new Date(), updatedAt: new Date() },
  { title: "Don't Start Now", language: "English", url: "/songs/Don't Start Now.mp3", duration: 183, createdAt: new Date(), updatedAt: new Date() },
  { title: "INDUSTRY BABY", language: "English", url: "/songs/INDUSTRY BABY.mp3", duration: 212, createdAt: new Date(), updatedAt: new Date() },
  { title: "Anti-Hero (Taylor Swift)", language: "English", url: "/songs/Anti-Hero.mp3", duration: 200, createdAt: new Date(), updatedAt: new Date() },

  // --- ENGLISH: POP CLASSICS ---
  { title: "Shape of You (Ed Sheeran)", language: "English", url: "/songs/Shape of You.mp3", duration: 233, createdAt: new Date(), updatedAt: new Date() },
  { title: "Rolling in the Deep", language: "English", url: "/songs/Rolling in the Deep.mp3", duration: 228, createdAt: new Date(), updatedAt: new Date() },
  { title: "Uptown Funk", language: "English", url: "/songs/Uptown Funk.mp3", duration: 269, createdAt: new Date(), updatedAt: new Date() },
  { title: "Believer (Imagine Dragons)", language: "English", url: "/songs/Believer.mp3", duration: 204, createdAt: new Date(), updatedAt: new Date() },
  { title: "Closer (Chainsmokers)", language: "English", url: "/songs/Closer.mp3", duration: 244, createdAt: new Date(), updatedAt: new Date() },
  { title: "Faded (Alan Walker)", language: "English", url: "/songs/Alan Walker.mp3", duration: 212, createdAt: new Date(), updatedAt: new Date() },
  { title: "Bad Guy (Billie Eilish)", language: "English", url: "/songs/Billie Eilish  bad guy Lyrics.mp3", duration: 194, createdAt: new Date(), updatedAt: new Date() },
  { title: "Attention (Charlie Puth)", language: "English", url: "/songs/Attention.mp3", duration: 211, createdAt: new Date(), updatedAt: new Date() },

  // --- ENGLISH: LEGENDARY HITS ---
  { title: "Bohemian Rhapsody", language: "English", url: "/songs/Bohemian Rhapsody.mp3", duration: 354, createdAt: new Date(), updatedAt: new Date() },
  { title: "Billie Jean", language: "English", url: "/songs/Billie Jean.mp3", duration: 294, createdAt: new Date(), updatedAt: new Date() },
  { title: "Hotel California", language: "English", url: "/songs/Hotel California.mp3", duration: 391, createdAt: new Date(), updatedAt: new Date() },
  { title: "Imagine (John Lennon)", language: "English", url: "/songs/Imagine.mp3", duration: 183, createdAt: new Date(), updatedAt: new Date() },
  { title: "Smells Like Teen Spirit", language: "English", url: "/songs/Nirvana.mp3", duration: 301, createdAt: new Date(), updatedAt: new Date() }
]

async function main() {
  try {
    await client.connect()
    const db = client.db('RhythmX')
    const songsCollection = db.collection('songs')

    console.log(`Clearing existing records...`)
    await songsCollection.deleteMany({})
    
    console.log(`Start seeding ${hitSongs.length} songs...`)
    const result = await songsCollection.insertMany(hitSongs)
    
    console.log(`Successfully seeded ${result.insertedCount} songs!`)
    console.log(`Seeding finished. Please refresh your browser!`)
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

main()
