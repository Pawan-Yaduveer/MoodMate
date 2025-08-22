const Mood = require('../models/Mood');
const { validationResult } = require('express-validator');

// @desc    Add a new mood entry
// @route   POST /api/moods
// @access  Private
const addMood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { moodText, moodType, intensity, activities, location, weather, notes } = req.body;

    const mood = await Mood.create({
      userId: req.user._id,
      moodText,
      moodType,
      intensity,
      activities,
      location,
      weather,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Mood recorded successfully',
      data: { mood }
    });
  } catch (error) {
    console.error('Add mood error:', error);
    res.status(500).json({ message: 'Server error while recording mood' });
  }
};

// @desc    Get user's mood history
// @route   GET /api/moods
// @access  Private
const getMoods = async (req, res) => {
  try {
    const { page = 1, limit = 10, moodType, startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    // Filter by mood type if provided
    if (moodType) {
      query.moodType = moodType;
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const options = {
      sort: { date: -1 },
      populate: {
        path: 'userId',
        select: 'name profilePic'
      }
    };

    const moods = await Mood.find(query, null, options).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit));
    const total = await Mood.countDocuments(query);

    res.json({
      success: true,
      data: {
        docs: moods,
        totalDocs: total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNextPage: parseInt(page) * parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error while fetching moods' });
  }
};

// @desc    Get mood trends and statistics
// @route   GET /api/moods/trends
// @access  Private
const getMoodTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get mood counts by type
    const moodCounts = await Mood.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$moodType',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get daily mood averages
    const dailyMoods = await Mood.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          avgIntensity: { $avg: '$intensity' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get most common activities
    const activities = await Mood.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate },
          activities: { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: '$activities'
      },
      {
        $group: {
          _id: '$activities',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        moodCounts,
        dailyMoods,
        activities,
        totalMoods: moodCounts.reduce((sum, mood) => sum + mood.count, 0),
        averageIntensity: moodCounts.reduce((sum, mood) => sum + mood.avgIntensity, 0) / moodCounts.length || 0
      }
    });
  } catch (error) {
    console.error('Get mood trends error:', error);
    res.status(500).json({ message: 'Server error while fetching mood trends' });
  }
};

// @desc    Get a specific mood entry
// @route   GET /api/moods/:id
// @access  Private
const getMoodById = async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'name profilePic');

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({
      success: true,
      data: { mood }
    });
  } catch (error) {
    console.error('Get mood by id error:', error);
    res.status(500).json({ message: 'Server error while fetching mood' });
  }
};

// @desc    Update a mood entry
// @route   PUT /api/moods/:id
// @access  Private
const updateMood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { moodText, moodType, intensity, activities, location, weather, notes } = req.body;

    const mood = await Mood.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        moodText,
        moodType,
        intensity,
        activities,
        location,
        weather,
        notes
      },
      { new: true, runValidators: true }
    );

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({
      success: true,
      message: 'Mood updated successfully',
      data: { mood }
    });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error while updating mood' });
  }
};

// @desc    Delete a mood entry
// @route   DELETE /api/moods/:id
// @access  Private
const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({
      success: true,
      message: 'Mood deleted successfully'
    });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: 'Server error while deleting mood' });
  }
};

module.exports = {
  addMood,
  getMoods,
  getMoodTrends,
  getMoodById,
  updateMood,
  deleteMood
};
