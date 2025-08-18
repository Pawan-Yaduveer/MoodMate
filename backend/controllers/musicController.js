import axios from 'axios';
import asyncHandler from '../middleware/asyncHandler.js';

async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    const error = new Error('Spotify credentials are not configured');
    error.status = 500;
    throw error;
  }
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

export const getPlaylistsByMood = asyncHandler(async (req, res) => {
  const { mood } = req.params;
  if (!mood || typeof mood !== 'string') {
    return res.status(400).json({ message: 'Mood is required' });
  }

  const token = await getSpotifyAccessToken();
  const query = encodeURIComponent(`${mood} mood playlist`);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=10`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const playlists = (data?.playlists?.items || []).map((p) => ({
    id: p.id,
    name: p.name,
    url: p.external_urls?.spotify,
    image: p.images?.[0]?.url,
    owner: p.owner?.display_name,
    tracks: p.tracks?.total,
  }));

  res.json({ mood, playlists });
});

