import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Music, Play, ExternalLink } from 'lucide-react';

const MOODS = [
  { value: 'happy', label: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sad', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
  { value: 'calm', label: 'Calm', color: 'bg-green-100 text-green-800' },
  { value: 'energetic', label: 'Energetic', color: 'bg-orange-100 text-orange-800' },
  { value: 'focus', label: 'Focus', color: 'bg-purple-100 text-purple-800' },
  { value: 'chill', label: 'Chill', color: 'bg-indigo-100 text-indigo-800' }
];

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
        const { data } = await api.get(`/api/music/${encodeURIComponent(selectedMood)}`);
        setPlaylists(data.playlists || []);
      } else {
        const res = await fetch(`/api/music/${encodeURIComponent(selectedMood)}`);
        const data = await res.json();
        setPlaylists(data.playlists || []);
      }
    } catch (e) {
      setError('Failed to load playlists');
      console.error('Music fetch error:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleMoodChange = (newMood) => {
    setMood(newMood);
    fetchPlaylists(newMood);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Music Recommendations</h3>
            <p className="text-purple-100 text-sm">Discover playlists that match your mood</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Mood
            </label>
            <select 
              value={mood} 
              onChange={(e) => handleMoodChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              {MOODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => fetchPlaylists(mood)}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Loading...' : 'Get Playlists'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-gray-50 rounded-b-xl min-h-96">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">{error}</div>
            <button 
              onClick={() => fetchPlaylists(mood)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && playlists.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No playlists found for this mood.</p>
            <p className="text-sm">Try selecting a different mood or check back later.</p>
          </div>
        )}
        
        {!loading && !error && playlists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <a 
                key={playlist.id} 
                href={playlist.url} 
                target="_blank" 
                rel="noreferrer" 
                className="group block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 overflow-hidden"
              >
                <div className="relative">
                  {playlist.image ? (
                    <img 
                      src={playlist.image} 
                      alt={playlist.name} 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      <Music className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                    {playlist.name}
                  </h4>
                  
                  {playlist.owner && (
                    <p className="text-sm text-gray-600 mb-1">
                      by {playlist.owner}
                    </p>
                  )}
                  
                  {typeof playlist.tracks === 'number' && (
                    <p className="text-sm text-gray-500">
                      {playlist.tracks} tracks
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


