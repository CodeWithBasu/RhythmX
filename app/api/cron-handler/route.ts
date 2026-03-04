import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Authenticate the Cron Job
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    console.log('[API] Cron Job triggered. Waking up database...');

    // 2. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('RhythmX');
    
    // 3. Waking up the cluster by executing a lightweight command
    const result = await db.command({ ping: 1 });
    
    console.log('[API] Cron Job successful. Database pinged:', result);
    return NextResponse.json({ success: true, message: 'Keep-alive ping successful.' });

  } catch (error: any) {
    console.error('[API] Cron Job Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to ping keep-alive endpoint' }), { status: 500 });
  }
}
