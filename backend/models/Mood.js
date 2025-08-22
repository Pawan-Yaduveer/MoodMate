const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodText: {
    type: String,
    required: [true, 'Mood description is required'],
    trim: true,
    maxlength: [500, 'Mood description cannot exceed 500 characters']
  },
  moodType: {
    type: String,
    required: [true, 'Mood type is required'],
    enum: ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed', 'grateful', 'lonely', 'confident', 'other'],
    default: 'other'
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  activities: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  weather: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodSchema.index({ userId: 1, date: -1 });
moodSchema.index({ userId: 1, moodType: 1 });

// Virtual for formatted date
moodSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtuals are serialized
moodSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Mood', moodSchema);
