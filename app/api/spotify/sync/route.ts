import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentlyPlaying, getAudioAnalysis } from "@/lib/spotify";

export const dynamic = "force-dynamic";

/**
 * Spotify Sync Endpoint
 * 
 * Fetches real-time playback state and audio analysis using the auth() session.
 */
export async function GET() {
  const session: any = await auth();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const currentlyPlaying = await getCurrentlyPlaying(session.accessToken as string);

    if (!currentlyPlaying || !currentlyPlaying.item) {
      return NextResponse.json({ playing: false });
    }

    const { item, progress_ms, is_playing } = currentlyPlaying;
    const trackId = (item as any).id;

    // Fetch audio analysis for the track
    const analysis = await getAudioAnalysis(session.accessToken as string, trackId);

    return NextResponse.json({
      playing: true,
      trackId,
      trackName: (item as any).name,
      trackArtist: (item as any).artists.map((a: any) => a.name).join(", "),
      progress_ms,
      isPlaying: is_playing,
      analysis,
    });
  } catch (error: any) {
    console.error("Error in Spotify Sync API:", error);
    return NextResponse.json({ error: "Failed to sync playback state" }, { status: 500 });
  }
}
