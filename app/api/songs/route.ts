import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
