import { useState } from 'react';
import { format } from 'date-fns';
import { Heart, MapPin, Cloud, Activity, Edit3, Trash2, MoreVertical } from 'lucide-react';

const MoodHistory = ({ moods = [] }) => {
  const [expandedMood, setExpandedMood] = useState(null);

  const getMoodEmoji = (moodType) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      excited: '🤩',
      calm: '😌',
      stressed: '😤',
      grateful: '🙏',
      lonely: '🥺',
      confident: '😎',
      other: '🤔'
    };
    return emojis[moodType] || '🤔';
  };

  const getMoodColor = (moodType) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-gray-100 text-gray-800',
      angry: 'bg-red-100 text-red-800',
      anxious: 'bg-purple-100 text-purple-800',
      excited: 'bg-pink-100 text-pink-800',
      calm: 'bg-green-100 text-green-800',
      stressed: 'bg-orange-100 text-orange-800',
      grateful: 'bg-lime-100 text-lime-800',
      lonely: 'bg-indigo-100 text-indigo-800',
      confident: 'bg-cyan-100 text-cyan-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[moodType] || 'bg-gray-100 text-gray-800';
  };

  const toggleExpanded = (moodId) => {
    setExpandedMood(expandedMood === moodId ? null : moodId);
  };

  if (moods.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No moods recorded yet</h3>
        <p className="text-gray-600">
          Start tracking your moods to see your emotional journey here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {moods.map((mood) => (
        <div
          key={mood.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
        >
          {/* Mood Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getMoodEmoji(mood.moodType)}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(mood.moodType)}`}>
                    {mood.moodType.charAt(0).toUpperCase() + mood.moodType.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Intensity: {mood.intensity}/10
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(mood.date), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleExpanded(mood.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mood Description */}
          <div className="mb-3">
            <p className="text-gray-900">{mood.moodText}</p>
          </div>

          {/* Quick Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            {mood.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{mood.location}</span>
              </div>
            )}
            {mood.weather && (
              <div className="flex items-center space-x-1">
                <Cloud className="w-4 h-4" />
                <span>{mood.weather}</span>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          {expandedMood === mood.id && (
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-3">
              {/* Activities */}
              {mood.activities && mood.activities.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Activities</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mood.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {mood.notes && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Notes:</span>
                  <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-2">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MoodHistory;
