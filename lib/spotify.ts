import SpotifyWebApi from "spotify-web-api-node";

/**
 * Spotify API Service
 * 
 * This service handles interactions with the Spotify Web API.
 * It's used on the server side to fetch currently playing track
 * and its audio analysis for real-time visualization.
 */

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/auth/callback/spotify",
});

/**
 * Get Spotify Access Token for a user session
 * This is used to make authenticated requests from the backend.
 */
export const getSpotifyApi = (accessToken: string) => {
  spotifyApi.setAccessToken(accessToken);
  return spotifyApi;
};

/**
 * Fetch Audio Analysis for a track
 * This data is essential for the visualizer.
 */
export const getAudioAnalysis = async (accessToken: string, trackId: string) => {
  const api = getSpotifyApi(accessToken);
  try {
    const analysisResponse = await api.getAudioAnalysisForTrack(trackId);
    return analysisResponse.body;
  } catch (error) {
    console.error("Error fetching audio analysis:", error);
    return null;
  }
};

/**
 * Fetch the currently playing track
 */
export const getCurrentlyPlaying = async (accessToken: string) => {
  const api = getSpotifyApi(accessToken);
  try {
    const playingResponse = await api.getMyCurrentPlayingTrack();
    return playingResponse.body;
  } catch (error) {
    console.error("Error fetching currently playing track:", error);
    return null;
  }
};
