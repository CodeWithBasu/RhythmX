import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { LRUCache } from 'lru-cache'

// Cache for binary audio data to avoid repeated base64 decoding and DB fetches
const audioCache = new LRUCache<string, { buffer: Buffer; mimeType: string }>({
  max: 30, // Store ~30 decoded songs in memory to prevent OOM
  maxSize: 100 * 1024 * 1024, // 100MB hard limit for cache size
  sizeCalculation: (value) => value.buffer.byteLength,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
})

// Cache for standard redirects (non-base64 songs)
const redirectCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || id.length !== 24) {
       return new NextResponse('Invalid Song ID', { status: 400 })
    }

    // 1. Check in-memory fast caches
    const cachedData = audioCache.get(id)
    if (cachedData) {
      console.log(`[API Stream] Cache HIT for: ${id}`)
      return new NextResponse(new Uint8Array(cachedData.buffer), {
        headers: {
          'Content-Type': cachedData.mimeType,
          'Content-Length': cachedData.buffer.byteLength.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400, immutable'
        }
      })
    }

    const cachedRedirect = redirectCache.get(id)
    if (cachedRedirect) {
      console.log(`[API Stream] Redirect Cache HIT for: ${id}`)
      return NextResponse.redirect(new URL(cachedRedirect, request.url))
    }

    console.log(`[API Stream] Cache MISS for: ${id}`)

    // 2. Fetch from DB if not cached
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    const song = await db.collection('songs').findOne({ _id: new ObjectId(id) })

    if (!song || !song.url) {
      return new NextResponse('Song not found', { status: 404 })
    }

    const dataUrl = song.url as string

    // Check if it's a standard URL or file path (e.g. /songs/..., http://...)
    if (!dataUrl.startsWith('data:')) {
      redirectCache.set(id, dataUrl)
      return NextResponse.redirect(new URL(dataUrl, request.url))
    }

    // Otherwise, parse Base64 data URI format
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
    
    if (!match) {
      return new NextResponse('Invalid audio format in database', { status: 500 })
    }

    const mimeType = match[1]
    const base64Data = match[2]
    
    // Decode base64 to binary buffer
    const buffer = Buffer.from(base64Data, 'base64')

    // 3. Save to cache
    audioCache.set(id, { buffer, mimeType })

    // 4. Send direct binary response
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, immutable'
      }
    })

  } catch (error) {
    console.error('[API Stream] Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
