const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

// Validation middleware
const moodValidation = [
  body('moodText')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Mood description must be between 1 and 500 characters'),
  body('moodType')
    .isIn(['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed', 'grateful', 'lonely', 'confident', 'other'])
    .withMessage('Invalid mood type'),
  body('intensity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be between 1 and 10'),
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  body('activities.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each activity must be between 1 and 100 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('weather')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Weather cannot exceed 50 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// All routes require authentication
router.use(auth);

// Routes - Specific routes must come before parameterized routes
router.post('/', moodValidation, moodController.addMood);
router.get('/', moodController.getMoods);
router.get('/trends', moodController.getMoodTrends);
router.get('/mood/:id', moodController.getMoodById);
router.put('/mood/:id', moodValidation, moodController.updateMood);
router.delete('/mood/:id', moodController.deleteMood);

module.exports = router;
