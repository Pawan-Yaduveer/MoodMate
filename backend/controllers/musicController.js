const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler.js');

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
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    }
  );
  return response.data.access_token;
}

exports.getPlaylistsByMood = asyncHandler(async (req, res) => {
  const { mood } = req.params;
  if (!mood || typeof mood !== 'string') {
    return res.status(400).json({ message: 'Mood is required' });
  }

  const token = await getSpotifyAccessToken();
  const query = encodeURIComponent(`${mood} mood playlist`);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=12`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 10000,
  });

  const items = Array.isArray(data?.playlists?.items) ? data.playlists.items : [];

  const playlists = items
    .filter((p) => p && p.id && p.name && p.external_urls?.spotify)
    .map((p) => ({
      id: p.id,
      name: p.name,
      url: p.external_urls.spotify,
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.url ?? null : null,
      owner: p.owner?.display_name ?? null,
      tracks: typeof p.tracks?.total === 'number' ? p.tracks.total : null,
    }));

  res.json({ mood, playlists });
});
