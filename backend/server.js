// Load environment variables
const dotenv = require('dotenv');
dotenv.config();
console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/moods', require('./routes/moods'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/music', require('./routes/music'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MoodMate API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MoodMate server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
