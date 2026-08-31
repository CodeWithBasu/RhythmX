import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    console.log('Fetching songs from MongoDB...')
    const songs = await db
      .collection('songs')
      .find({})
      .project({ url: 0 })
      .sort({ createdAt: 1 })
      .toArray()
    
    const formattedSongs = songs.map(song => ({
      ...song,
      id: song._id?.toString() || Math.random().toString(),
    }))

    return NextResponse.json(formattedSongs)
  } catch (error: any) {
    console.error('[API] Critical Error:', error)
    return new NextResponse(JSON.stringify({ error: error.message || String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, url, language, duration } = body

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
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      song: newSong 
    })
  } catch (error: any) {
    console.error('[API] POST Error:', error)
    return new NextResponse(JSON.stringify({ error: error.message || 'Failed to add song' }), { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || id.length !== 24) {
      return new NextResponse(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('RhythmX')
    
    await db.collection('songs').deleteOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API] DELETE Error:', error)
    return new NextResponse(JSON.stringify({ error: error.message || 'Failed to delete song' }), { status: 500 })
  }
}
