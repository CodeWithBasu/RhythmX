import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const hitSongs = [
  // HINDI HITS
  {
    title: "Aankh Marey (Simmba)",
    language: "Hindi",
    url: "/songs/Aankh Marey Simmba.mp3",
    duration: 213
  },
  {
    title: "Bom Diggy Diggy (Sonu Ke Titu Ki Sweety)",
    language: "Hindi",
    url: "/songs/Bom Diggy Diggy.mp3",
    duration: 238
  },
  {
    title: "Dj Waley Babu (Badshah)",
    language: "Hindi",
    url: "/songs/Dj Waley Babu.mp3",
    duration: 169
  },
  {
    title: "Kala Chashma (Baar Baar Dekho)",
    language: "Hindi",
    url: "/songs/Kala Chashma.mp3",
    duration: 187
  },
  {
    title: "Kar Gayi Chull (Kapoor & Sons)",
    language: "Hindi",
    url: "/songs/Kar Gayi Chull.mp3",
    duration: 189
  },
  {
    title: "Taambdi Chaamdi (Shreyas & Kratex)",
    language: "Hindi",
    url: "/songs/Taambdi Chaamdi.mp3",
    duration: 200
  },
  {
    title: "Wakhra Swag (Badshah)",
    language: "Hindi",
    url: "/songs/Wakhra Swag Badshah.mp3",
    duration: 180
  },
  {
    title: "Hindi Hit (Demo)",
    language: "Hindi",
    url: "/songs/hindi_song.mp3",
    duration: 425
  },
  
  // ENGLISH HITS
  {
    title: "Faded (Alan Walker)",
    language: "English",
    url: "/songs/Alan Walker.mp3",
    duration: 212
  },
  {
    title: "Attention (Charlie Puth)",
    language: "English",
    url: "/songs/Attention.mp3",
    duration: 211
  },
  {
    title: "Bad Guy (Billie Eilish)",
    language: "English",
    url: "/songs/Billie Eilish  bad guy Lyrics.mp3",
    duration: 194
  },
  {
    title: "Turn Down for What (DJ Snake & Lil Jon)",
    language: "English",
    url: "/songs/DJ Snake and Lil Jon.mp3",
    duration: 213
  },
  {
    title: "Don't Start Now (Dua Lipa)",
    language: "English",
    url: "/songs/Don't Start Now.mp3",
    duration: 183
  },
  {
    title: "Levitating (Dua Lipa)",
    language: "English",
    url: "/songs/Dua Lipa.mp3",
    duration: 203
  },
  {
    title: "INDUSTRY BABY (Lil Nas X)",
    language: "English",
    url: "/songs/INDUSTRY BABY.mp3",
    duration: 212
  },
  {
    title: "Blinding Lights (The Weeknd)",
    language: "English",
    url: "/songs/The Weeknd - Blinding Lights (Official Audio).mp3",
    duration: 200
  },
  {
    title: "Starboy (The Weeknd)",
    language: "English",
    url: "/songs/The Weeknd.mp3",
    duration: 230
  },
  {
    title: "English Hit (Demo)",
    language: "English",
    url: "/songs/english_song.mp3",
    duration: 372
  }
]

async function main() {
  console.log(`Clearing existing records...`)
  await prisma.song.deleteMany()
  
  console.log(`Start seeding ${hitSongs.length} songs...`)
  for (const s of hitSongs) {
    const song = await prisma.song.create({
      data: s,
    })
    console.log(`Created: ${song.title} (${song.language})`)
  }
  console.log(`Seeding finished. Please refresh your browser!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
