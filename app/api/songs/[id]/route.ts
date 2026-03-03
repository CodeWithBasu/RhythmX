import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!id || id.length !== 24) {
       return new NextResponse(JSON.stringify({ error: 'Invalid Song ID' }), { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('RhythmX')
    
    const song = await db.collection('songs').findOne({ _id: new ObjectId(id) })

    if (!song) {
      return new NextResponse(JSON.stringify({ error: 'Song not found' }), { status: 404 })
    }

    return NextResponse.json({ url: song.url })
  } catch (error) {
    console.error('[API] Single Song Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch song data' }), { status: 500 })
  }
}
