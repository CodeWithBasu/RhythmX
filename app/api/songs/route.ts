import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db() // Uses the DB from the connection string (RhythmX)
    
    const songs = await db
      .collection('songs')
      .find({})
      .sort({ createdAt: 1 })
      .toArray()
      
    // Transform _id to id for frontend compatibility
    const formattedSongs = songs.map(song => ({
      ...song,
      id: song._id.toString(),
    }))

    return NextResponse.json(formattedSongs)
  } catch (error) {
    console.error('Error fetching songs in API:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
