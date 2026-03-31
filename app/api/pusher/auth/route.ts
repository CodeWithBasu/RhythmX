import { pusherServer } from '@/lib/pusher-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.text()
    const params = new URLSearchParams(data)
    const socketId = params.get('socket_id')
    const channel = params.get('channel_name')

    if (!socketId || !channel) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel)
    return NextResponse.json(authResponse)
  } catch (e) {
    return new NextResponse('Error authorising Pusher channel', { status: 500 })
  }
}
