MoodMate 🌟

A comprehensive mood tracking and wellness application built with the MERN stack, featuring AI-powered chatbot support and personalized music recommendations.

MoodMate helps users track their daily moods, analyze patterns, and receive personalized wellness support through an intelligent AI chatbot and mood-based music suggestions.

Features

🧠 Core Mood Tracking
- Daily Mood Recording: Track mood type, intensity, activities, location, and weather
- Mood History: View and manage your mood entries over time
- Real-time Dashboard: Live updates of mood statistics and trends
- Personalized Insights: Track patterns and correlations in your mood data

🤖 AI-Powered Wellness Support
- Intelligent Chatbot: Powered by Groq API (llama3-8b-8192 model)
- Wellness Tips: Get personalized advice and coping strategies
- Mood Analysis: AI helps understand your mood patterns
- 24/7 Support: Always available when you need someone to talk to

🎵 Mood-Based Music Recommendations
- Spotify Integration: Get personalized playlists based on your current mood
- Mood-Matched Music: Happy, sad, calm, excited - find the perfect soundtrack
- Curated Playlists: Discover new music that matches your emotional state

👤 User Management
- Secure Authentication: JWT-based login/registration system
- Profile Management: Update personal information and profile pictures
- Photo Upload: Support for both file uploads and URL-based images
- Privacy Controls: Your data stays private and secure

📊 Analytics & Insights
- Mood Trends: Visual charts showing your mood patterns over time
- Statistics Dashboard: Total moods, average mood, most common moods
- Real-time Updates: Dashboard refreshes automatically with new data
- Multiple Chart Types: Bar charts, line charts, and pie charts

Project Structure

```
MoodMate/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # API logic handlers
│   ├── middleware/         # Authentication & validation
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Application pages
│   │   ├── utils/          # Helper functions
│   │   └── main.jsx        # Application entry point
│   └── package.json        # Frontend dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

Quick Start

Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Groq API key
- Spotify API credentials

1. Clone & Setup
```bash
git clone <your-repo-url>
cd MoodMate
```

2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# See Environment Variables section below

# Start development server
npm run dev
```

3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Groq API (for AI chatbot)
GROQ_API_KEY=your_groq_api_key_here

# Spotify API (for mood-based music)
SPOTIFY_CLIENT_ID=your-spotify-client-id-here
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret-here

# Frontend Configuration
VITE_API_URL=http://localhost:5000
```

API Endpoints

Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

Mood Management
- `POST /api/moods` - Create new mood entry
- `GET /api/moods` - Get user's mood history
- `GET /api/moods/trends` - Get mood trends and analytics
- `GET /api/moods/mood/:id` - Get specific mood entry
- `PUT /api/moods/mood/:id` - Update mood entry
- `DELETE /api/moods/mood/:id` - Delete mood entry

AI Chatbot
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/tips/mood/:moodType` - Get wellness tips for specific mood

Music Recommendations
- `GET /api/music/:mood` - Get Spotify playlists for specific mood

Frontend Components

Core Pages
- Home: Landing page with app introduction
- Dashboard: Main interface with mood tracking and analytics
- Login/Register: Authentication forms
- Profile: User settings and profile management

Key Components
- MoodInput: Form for recording daily moods
- MoodHistory: Display and manage mood entries
- StatsGraph: Visual charts and analytics
- ChatbotUI: AI chatbot interface
- MusicRecs: Spotify music recommendations
- Navbar: Navigation and user menu

Technology Stack

Backend
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT - JSON Web Token authentication
- bcryptjs - Password hashing
- express-validator - Input validation

Frontend
- React - UI library
- Vite - Build tool and dev server
- Tailwind CSS - Utility-first CSS framework
- React Router - Client-side routing
- Axios - HTTP client
- Recharts - Chart components
- Lucide React - Icon library

External APIs
- Groq API - AI chatbot (llama3-8b-8192 model)
- Spotify API - Music recommendations

Authentication Flow

1. Registration: User creates account with name, email, and password
2. Login: User authenticates and receives JWT token
3. Token Storage: JWT stored in localStorage and HTTP headers
4. Protected Routes: Dashboard and profile require valid token
5. Auto-logout: Token expiration automatically logs user out

User Experience Features

Mood Tracking
- 9 Mood Types: Happy, sad, angry, anxious, excited, calm, stressed, grateful, lonely, confident
- Intensity Scale: 1-10 scale for mood intensity
- Activity Tracking: Log what you're doing when recording mood
- Location & Weather: Track environmental factors
- Notes: Add personal thoughts and feelings

Dashboard Features
- Real-time Updates: Statistics update immediately after mood entry
- Multiple Views: Overview, history, trends, and settings tabs
- Responsive Design: Works on desktop, tablet, and mobile
- Loading States: Smooth transitions and feedback

Profile Management
- Photo Upload: Drag & drop or URL-based profile pictures
- File Validation: Image type and size restrictions (max 5MB)
- Live Preview: See changes before saving
- Data Persistence: All changes saved to database

Development Commands

Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Start development server with nodemon
npm start           # Start production server
```

Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

Root Directory
```bash
npm install          # Install root dependencies (concurrently)
npm run dev         # Start both backend and frontend
```

Troubleshooting

Common Issues

1. MongoDB Connection Error
   - Check your MONGO_URI in .env file
   - Ensure MongoDB Atlas IP whitelist includes your IP
   - Verify username/password are correct

2. API Key Errors
   - Verify GROQ_API_KEY is set correctly
   - Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
   - Ensure API keys have proper permissions

3. Port Conflicts
   - Backend runs on port 5000 by default
   - Frontend runs on port 5173 by default
   - Change ports in .env if needed

4. CORS Issues
   - Backend CORS is configured for localhost:5173
   - Update CORS settings for production domains

Performance Features

- Real-time Updates: Dashboard refreshes automatically
- Optimized Queries: Efficient MongoDB queries with pagination
- Image Optimization: Profile pictures converted to base64 for fast loading
- Lazy Loading: Components load only when needed
- Error Boundaries: Graceful error handling throughout the app

Security Features

- JWT Authentication: Secure token-based authentication
- Password Hashing: bcrypt with salt rounds
- Input Validation: Server-side validation for all inputs
- CORS Protection: Configured for specific origins
- Environment Variables: Sensitive data stored securely

What Makes MoodMate Special

1. AI-Powered Support: Intelligent chatbot for 24/7 wellness guidance
2. Personalized Music: Mood-based Spotify recommendations
3. Real-time Analytics: Live dashboard with instant updates
4. User-Friendly Design: Intuitive interface for all skill levels
5. Comprehensive Tracking: Detailed mood analysis with multiple factors
6. Privacy-First: Your data stays private and secure
7. Cross-Platform: Works seamlessly on all devices

Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

License

This project is licensed under the ISC License.

Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all environment variables are set correctly
4. Verify API keys have proper permissions

---

Built with ❤️ using the MERN stack

