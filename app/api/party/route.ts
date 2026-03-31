import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { pusherServer } from '@/lib/pusher-server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id || id.length !== 24) return new NextResponse(JSON.stringify({ error: "Invalid ID" }), { status: 400 })
    
    // Check MongoDB connection
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    const party = await db.collection('parties').findOne({ _id: new ObjectId(id) })
    
    if (!party) return new NextResponse(JSON.stringify({ error: "Party not found" }), { status: 404 })
    
    return NextResponse.json({ ...party, id: party._id.toString(), serverTime: Date.now() })
  } catch (e) {
    console.error("GET Party Error:", e);
    return new NextResponse(JSON.stringify({ error: "Error" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { song, currentTime, isPlaying } = await request.json()
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    const result = await db.collection('parties').insertOne({
      song,
      currentTime,
      isPlaying,
      updatedAt: Date.now()
    })
    
    return NextResponse.json({ id: result.insertedId.toString() })
  } catch (e) {
    console.error("POST Party Error:", e);
    return new NextResponse(JSON.stringify({ error: "Error" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, song, currentTime, isPlaying } = await request.json()
    if (!id || id.length !== 24) return new NextResponse(JSON.stringify({ error: "Invalid ID" }), { status: 400 })
    
    const client = await clientPromise
    const db = client.db('RhythmX')
    
    await db.collection('parties').updateOne(
      { _id: new ObjectId(id) },
      { $set: { song, currentTime, isPlaying, updatedAt: Date.now() } }
    )
    
    try {
      await pusherServer.trigger(`party-${id}`, 'sync', {
        song,
        currentTime,
        isPlaying,
        updatedAt: Date.now(),
        serverTime: Date.now()
      })
    } catch (err) {
      console.error("Pusher trigger error:", err)
    }
    
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("PUT Party Error:", e);
    return new NextResponse(JSON.stringify({ error: "Error" }), { status: 500 })
  }
}
