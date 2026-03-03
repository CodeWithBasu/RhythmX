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
      .sort({ createdAt: 1 })
      .toArray()
    
    console.log(`[API] Success: Found ${songs.length} songs in collection 'songs'`)
      
    // Transform _id to id for frontend compatibility
    const formattedSongs = songs.map(song => ({
      ...song,
      id: song._id?.toString() || Math.random().toString(),
    }))

    return NextResponse.json(formattedSongs)
  } catch (error) {
    console.error('[API] Critical Error:', error)
    if (error instanceof Error) {
      console.error('[API] Error Name:', error.name)
      console.error('[API] Error Message:', error.message)
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch songs' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
