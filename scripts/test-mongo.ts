import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function test() {
  const uri = process.env.DATABASE_URL
  if (!uri) throw new Error('No URI')
  
  const client = new MongoClient(uri)
  try {
    console.log('Connecting...')
    await client.connect()
    console.log('Connected!')
    const db = client.db()
    console.log('DB Name:', db.databaseName)
    const collections = await db.listCollections().toArray()
    console.log('Collections:', collections.map(c => c.name))
  } catch (err) {
    console.error('Test failed:', err)
  } finally {
    await client.close()
  }
}

test()
