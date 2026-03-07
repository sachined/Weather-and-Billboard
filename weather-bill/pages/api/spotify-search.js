import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query required' });
  }

  try {
    const data = await spotifyApi.searchTracks(query);
    res.status(200).json(data.body);
  } catch (error) {
    res.status(500).json({ error: 'Spotify API error' });
  }
}