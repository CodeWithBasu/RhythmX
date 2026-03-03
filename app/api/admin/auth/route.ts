import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return new NextResponse(JSON.stringify({ error: 'Password is required' }), { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'rhythmxadmin'

    if (password === adminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return new NextResponse(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
    }
  } catch (error) {
    console.error('[API] Admin Auth Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Authentication failed' }), { status: 500 })
  }
}
