import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('RhythmX') // Explicitly use RhythmX database
    
    console.log('Fetching songs from MongoDB...')
    const songs = await db
      .collection('songs')
      .find({})
      .project({ url: 0 }) // Optimization: Don't fetch huge Base64 data for the playlist
      .sort({ createdAt: 1 })
      .toArray()
    
    console.log(`[API] Success: Found ${songs.length} songs (Metadata only)`)
      
    // Transform _id to id for frontend compatibility
    const formattedSongs = songs.map(song => ({
      ...song,
      id: song._id?.toString() || Math.random().toString(),
    }))

    return NextResponse.json(formattedSongs)
  } catch (error) {
    console.error('[API] Critical Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch songs' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, url, language, duration } = body

    console.log(`[API] POST: Adding song "${title}" (Size: ~${Math.round(JSON.stringify(body).length / 1024)} KB)`)

    if (!title || !url) {
      return new NextResponse(JSON.stringify({ error: 'Title and URL are required' }), { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('RhythmX')
    
    const newSong = {
      title,
      url,
      language: language || 'Unknown',
      duration: duration || 0,
      createdAt: new Date()
    }

    const result = await db.collection('songs').insertOne(newSong)
    console.log(`[API] Success: Inserted song with ID ${result.insertedId}`)
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      song: newSong 
    })
  } catch (error: any) {
    console.error('[API] POST Error:', error)
    const errorMessage = error.message || 'Failed to add song'
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 })
  }
}
