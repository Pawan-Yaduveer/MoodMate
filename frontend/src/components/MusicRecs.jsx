import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const MOODS = ['happy', 'sad', 'calm', 'energetic', 'focus', 'chill'];

export default function MusicRecs() {
  const { api } = useAuth() || {};
  const [mood, setMood] = useState('happy');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlaylists(mood);
  }, []);

  async function fetchPlaylists(selectedMood) {
    setLoading(true);
    setError('');
    try {
      if (api && typeof api.get === 'function') {
        const { data } = await api.get(`/music/${encodeURIComponent(selectedMood)}`);
        setPlaylists(data.playlists || []);
      } else {
        const res = await fetch(`/api/music/${encodeURIComponent(selectedMood)}`);
        const data = await res.json();
        setPlaylists(data.playlists || []);
      }
    } catch (e) {
      setError('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '1rem auto', padding: 16, border: '1px solid #333', borderRadius: 8 }}>
      <h2>Music Recommendations</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          {MOODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button onClick={() => fetchPlaylists(mood)}>Get Playlists</button>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'tomato' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {playlists.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #444', borderRadius: 8, overflow: 'hidden' }}>
              {p.image && (
                <img src={p.image} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                {p.owner && <div style={{ opacity: 0.8, fontSize: 12 }}>by {p.owner}</div>}
                {typeof p.tracks === 'number' && <div style={{ opacity: 0.8, fontSize: 12 }}>{p.tracks} tracks</div>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

