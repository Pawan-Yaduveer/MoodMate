import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MoodInput from '../components/MoodInput';
import MoodHistory from '../components/MoodHistory';
import StatsGraph from '../components/StatsGraph';
import ChatbotUI from '../components/ChatbotUI';
import MusicRecs from '../components/MusicRecs';
import { BarChart3, History, MessageCircle, Music, TrendingUp, User } from 'lucide-react';

export default function Dashboard() {
  const { user, api } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [recentMoods, setRecentMoods] = useState([]);
  const [stats, setStats] = useState({
    totalMoods: 0,
    averageMood: 0,
    mostCommonMood: 'None'
  });
  const [loading, setLoading] = useState(true);
  const [moodSubmitting, setMoodSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      fetchUserData();
    } catch (error) {
      console.error('Dashboard useEffect error:', error);
      setError(error.message);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent moods
      const moodsResponse = await api.get('/api/moods?page=1&limit=5');
      const moods = moodsResponse.data.data.docs || [];
      setRecentMoods(moods);
      
      // Calculate stats from moods
      if (moods.length > 0) {
        const totalMoods = moodsResponse.data.data.totalDocs || 0;
        const moodTypes = moods.map(m => m.moodType);
        const mostCommonMood = getMostCommonMood(moodTypes);
        const averageMood = calculateAverageMood(moods);
        
        setStats({
          totalMoods,
          averageMood,
          mostCommonMood
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to placeholder data
      setRecentMoods([
        { id: 1, moodType: 'happy', moodText: 'Feeling great today!', date: new Date() },
        { id: 2, moodType: 'calm', moodText: 'Peaceful evening', date: new Date(Date.now() - 86400000) }
      ]);
      setStats({
        totalMoods: 0,
        averageMood: 0,
        mostCommonMood: 'None'
      });
    } finally {
      setLoading(false);
    }
  };

  const getMostCommonMood = (moodTypes) => {
    const counts = {};
    moodTypes.forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'None');
  };

  const calculateAverageMood = (moods) => {
    if (moods.length === 0) return 0;
    const total = moods.reduce((sum, mood) => sum + (mood.intensity || 5), 0);
    return Math.round((total / moods.length) * 10) / 10;
  };

  const handleMoodAdded = async (newMood) => {
    try {
      console.log('Dashboard: handleMoodAdded called with:', newMood);
      setMoodSubmitting(true);
      
      // Validate the mood data before processing
      if (!newMood || !newMood.moodType) {
        console.error('Invalid mood data received:', newMood);
        alert('Invalid mood data received. Please try again.');
        return;
      }
      
      // Add the new mood to the list immediately
      setRecentMoods(prev => {
        const updated = [newMood, ...prev.slice(0, 4)];
        console.log('Updated recent moods:', updated);
        return updated;
      });
      
      // Update stats immediately without triggering loading
      setStats(prev => {
        const newStats = {
          totalMoods: prev.totalMoods + 1,
          averageMood: calculateAverageMood([newMood, ...recentMoods]),
          mostCommonMood: getMostCommonMood([newMood.moodType, ...recentMoods.map(m => m.moodType)])
        };
        console.log('Updated stats:', newStats);
        return newStats;
      });
      
      // Show success message
      console.log('Mood updated successfully in UI');
      
      // Don't refresh data immediately to prevent white screen
      // Just update the local state
      
    } catch (error) {
      console.error('Error updating after mood added:', error);
      alert(`Error updating dashboard: ${error.message}`);
    } finally {
      setMoodSubmitting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'music', label: 'Music', icon: Music }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Moods</p>
                    {loading ? (
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stats.totalMoods}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Mood</p>
                    {loading ? (
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stats.averageMood}/10</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Common</p>
                    {loading ? (
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stats.mostCommonMood}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
              
              {moodSubmitting && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm">Recording your mood...</span>
                </div>
              )}
              
              <MoodInput onMoodAdded={handleMoodAdded} />
            </div>

            {/* Recent Moods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Moods</h3>
              <MoodHistory moods={recentMoods} />
            </div>
          </div>
        );
      
      case 'trends':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trends & Analytics</h3>
            <StatsGraph moods={recentMoods} />
          </div>
        );
      
      case 'history':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood History</h3>
            <MoodHistory moods={recentMoods} showAll={true} />
          </div>
        );
      
      case 'ai-chat':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Wellness Assistant</h3>
            <ChatbotUI />
          </div>
        );
      
      case 'music':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Music Recommendations</h3>
            <MusicRecs />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name ? user.name.split(' ')[0] : (loading ? '...' : 'User')}! 👋
              </h1>
              <p className="text-gray-600 mt-2">Track your mood and get personalized wellness support</p>
            </div>
            <button
              onClick={fetchUserData}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="text-red-700 font-medium">Error loading dashboard</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {(() => {
            try {
              return renderTabContent();
            } catch (error) {
              console.error('Error rendering tab content:', error);
              return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-4">There was an error rendering this content.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Reload Page
                    </button>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}
