import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return new NextResponse(JSON.stringify({ error: 'Password is required' }), { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('[API] Admin Auth Error: ADMIN_PASSWORD is not set in .env')
      return new NextResponse(JSON.stringify({ error: 'Server misconfiguration. Admin password not set in environment.' }), { status: 500 })
    }

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
