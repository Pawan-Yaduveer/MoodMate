import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, Plus, X, MapPin, Cloud, Activity } from 'lucide-react';

const MoodInput = ({ onMoodAdded }) => {
  const { api } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    moodText: '',
    moodType: 'happy',
    intensity: 5,
    activities: [],
    location: '',
    weather: '',
    notes: ''
  });
  const [newActivity, setNewActivity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodTypes = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'stressed', label: 'Stressed', emoji: '😤' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏' },
    { value: 'lonely', label: 'Lonely', emoji: '🥺' },
    { value: 'confident', label: 'Confident', emoji: '😎' },
    { value: 'other', label: 'Other', emoji: '🤔' }
  ];

  const weatherOptions = [
    'Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Foggy', 'Clear', 'Stormy'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addActivity = () => {
    if (newActivity.trim() && !formData.activities.includes(newActivity.trim())) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (activityToRemove) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity !== activityToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.moodText.trim()) return;

    setIsSubmitting(true);
    
    try {
      console.log('Submitting mood:', formData);
      
      // Send to API
      const response = await api.post('/api/moods', {
        moodType: formData.moodType,
        moodText: formData.moodText,
        intensity: formData.intensity,
        activities: formData.activities,
        location: formData.location,
        weather: formData.weather,
        notes: formData.notes,
        date: new Date()
      });
      
      console.log('Mood API response:', response.data);
      
      // Backend returns: { success: true, data: { mood: moodObject } }
      const newMood = response.data.data.mood;
      
      // Log the actual structure to debug
      console.log('Response structure:', {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
        mood: response.data.data.mood,
        moodType: response.data.data.mood?.moodType,
        moodText: response.data.data.mood?.moodText
      });
      
      // Validate response before calling callback
      if (!newMood || !newMood.moodType || !newMood.moodText) {
        console.error('Invalid mood data structure:', newMood);
        throw new Error(`Invalid response structure: missing ${!newMood ? 'mood object' : !newMood.moodType ? 'moodType' : 'moodText'}`);
      }
      
      // Call the callback to update parent component
      if (onMoodAdded && typeof onMoodAdded === 'function') {
        console.log('Calling onMoodAdded callback');
        onMoodAdded(newMood);
        console.log('onMoodAdded callback completed');
      } else {
        console.log('No onMoodAdded callback provided');
      }
      
      // Show success message
      alert('Mood recorded successfully! 🎉');
      
      // Reset form and close
      setIsSubmitting(false);
      setIsOpen(false);
      setFormData({
        moodText: '',
        moodType: 'happy',
        intensity: 5,
        activities: [],
        location: '',
        weather: '',
        notes: ''
      });
      
      console.log('Mood recorded successfully');
      
    } catch (error) {
      console.error('Error adding mood:', error);
      setIsSubmitting(false);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to record mood: ${errorMessage}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addActivity();
    }
  };

  if (!isOpen) {
    return (
      <div className="text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
        >
          <Plus className="w-6 h-6" />
          <span>How are you feeling today?</span>
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Record Your Mood</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How are you feeling?
          </label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {moodTypes.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, moodType: mood.value }))}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.moodType === mood.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Description */}
        <div>
          <label htmlFor="moodText" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your mood
          </label>
          <textarea
            id="moodText"
            name="moodText"
            value={formData.moodText}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="Tell us more about how you're feeling..."
            required
          />
        </div>

        {/* Intensity Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensity: {formData.intensity}/10
          </label>
          <input
            type="range"
            name="intensity"
            min="1"
            max="10"
            value={formData.intensity}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you doing?
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field flex-1"
              placeholder="Add an activity..."
            />
            <button
              type="button"
              onClick={addActivity}
              className="btn-secondary px-4"
            >
              Add
            </button>
          </div>
          {formData.activities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.activities.map((activity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {activity}
                  <button
                    type="button"
                    onClick={() => removeActivity(activity)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location and Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Where are you?"
            />
          </div>
          <div>
            <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-2">
              <Cloud className="w-4 h-4 inline mr-1" />
              Weather
            </label>
            <select
              id="weather"
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select weather</option>
              {weatherOptions.map((weather) => (
                <option key={weather} value={weather}>{weather}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="input-field"
            placeholder="Any other thoughts or feelings you'd like to share?"
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.moodText.trim()}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Heart className="w-5 h-5" />
            <span>{isSubmitting ? 'Recording...' : 'Record Mood'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn-outline px-6"
          >
            Cancel
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default MoodInput;
