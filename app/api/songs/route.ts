import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { verifyFirebaseToken } from '@/lib/firebase-verify'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    console.log('Fetching songs from MongoDB...')
    const songs = await db
      .collection('songs')
      .find({})
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
    // 1. Verify User Authentication via Firebase Token
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized. Please log in.' }), { status: 401 })
    }
    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await verifyFirebaseToken(token)
    if (!decodedToken) {
      return new NextResponse(JSON.stringify({ error: 'Invalid or expired authentication token.' }), { status: 401 })
    }

    // 2. Process the valid request
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
      createdAt: new Date(),
      uploadedBy: decodedToken.uid, // Track who uploaded the song
      uploadedByEmail: decodedToken.email
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
    // 1. Verify Admin Password
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== 'rhythmxadmin') {
      return new NextResponse(JSON.stringify({ error: 'Forbidden. Only admins can delete songs.' }), { status: 403 })
    }

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

