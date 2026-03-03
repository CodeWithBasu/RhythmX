import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { LRUCache } from 'lru-cache'

// Initialize a cache to store song URLs locally in the server's memory
// This prevents hitting MongoDB every time a user plays a song
const songCache = new LRUCache<string, string>({
  max: 50, // Store up to 50 songs in memory
  ttl: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || id.length !== 24) {
       return new NextResponse(JSON.stringify({ error: 'Invalid Song ID' }), { status: 400 })
    }

    // 1. Check if the song URL is already in our fast server cache
    const cachedUrl = songCache.get(id)
    if (cachedUrl) {
      console.log(`[API] Cache HIT for song: ${id}`)
      return NextResponse.json({ url: cachedUrl })
    }

    console.log(`[API] Cache MISS. Fetching from MongoDB: ${id}`)
    
    // 2. If not in cache, fetch from the cloud database
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    const song = await db.collection('songs').findOne({ _id: new ObjectId(id) })

    if (!song || !song.url) {
      return new NextResponse(JSON.stringify({ error: 'Song or URL not found' }), { status: 404 })
    }

    // 3. Save it to our cache for the next time someone plays it
    songCache.set(id, song.url)

    return NextResponse.json({ url: song.url })
  } catch (error) {
    console.error('[API] Single Song Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch song data' }), { status: 500 })
  }
}
