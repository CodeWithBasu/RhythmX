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
  // HINDI HITS
  {
    title: "Aankh Marey (Simmba)",
    language: "Hindi",
    url: "/songs/Aankh Marey Simmba.mp3",
    duration: 213,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Bom Diggy Diggy (Sonu Ke Titu Ki Sweety)",
    language: "Hindi",
    url: "/songs/Bom Diggy Diggy.mp3",
    duration: 238,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Dj Waley Babu (Badshah)",
    language: "Hindi",
    url: "/songs/Dj Waley Babu.mp3",
    duration: 169,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Kala Chashma (Baar Baar Dekho)",
    language: "Hindi",
    url: "/songs/Kala Chashma.mp3",
    duration: 187,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Kar Gayi Chull (Kapoor & Sons)",
    language: "Hindi",
    url: "/songs/Kar Gayi Chull.mp3",
    duration: 189,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Taambdi Chaamdi (Shreyas & Kratex)",
    language: "Hindi",
    url: "/songs/Taambdi Chaamdi.mp3",
    duration: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Wakhra Swag (Badshah)",
    language: "Hindi",
    url: "/songs/Wakhra Swag Badshah.mp3",
    duration: 180,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Hindi Hit (Demo)",
    language: "Hindi",
    url: "/songs/hindi_song.mp3",
    duration: 425,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // ENGLISH HITS
  {
    title: "Faded (Alan Walker)",
    language: "English",
    url: "/songs/Alan Walker.mp3",
    duration: 212,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Attention (Charlie Puth)",
    language: "English",
    url: "/songs/Attention.mp3",
    duration: 211,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Bad Guy (Billie Eilish)",
    language: "English",
    url: "/songs/Billie Eilish  bad guy Lyrics.mp3",
    duration: 194,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Turn Down for What (DJ Snake & Lil Jon)",
    language: "English",
    url: "/songs/DJ Snake and Lil Jon.mp3",
    duration: 213,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Don't Start Now (Dua Lipa)",
    language: "English",
    url: "/songs/Don't Start Now.mp3",
    duration: 183,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Levitating (Dua Lipa)",
    language: "English",
    url: "/songs/Dua Lipa.mp3",
    duration: 203,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "INDUSTRY BABY (Lil Nas X)",
    language: "English",
    url: "/songs/INDUSTRY BABY.mp3",
    duration: 212,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Blinding Lights (The Weeknd)",
    language: "English",
    url: "/songs/The Weeknd - Blinding Lights (Official Audio).mp3",
    duration: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Starboy (The Weeknd)",
    language: "English",
    url: "/songs/The Weeknd.mp3",
    duration: 230,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "English Hit (Demo)",
    language: "English",
    url: "/songs/english_song.mp3",
    duration: 372,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
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
