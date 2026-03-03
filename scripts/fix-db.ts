import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function fix() {
  const uri = process.env.DATABASE_URL
  if (!uri) throw new Error('No URI')
  
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db('RhythmX')
    const songs = db.collection('songs')
    
    console.log('Adding index to createdAt...')
    await songs.createIndex({ createdAt: 1 })
    
    // Check for huge documents
    const count = await songs.countDocuments()
    console.log(`Total songs in DB: ${count}`)
    
    const cursor = songs.find({})
    let totalSize = 0
    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (doc) {
        const size = JSON.stringify(doc).length
        if (size > 1024 * 1024) {
          console.warn(`Huge song found: "${doc.title}" (~${Math.round(size / 1024 / 1024)} MB)`)
        }
        totalSize += size
      }
    }
    console.log(`Total data size: ~${Math.round(totalSize / 1024 / 1024)} MB`)

  } catch (err) {
    console.error('Fix failed:', err)
  } finally {
    await client.close()
  }
}

fix()
