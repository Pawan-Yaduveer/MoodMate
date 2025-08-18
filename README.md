# MoodMate

MoodMate with OpenAI Chatbot and Spotify Mood Playlists.

## Backend Setup

1. Create a `.env` file in `backend/` based on `backend/env.example`:

```
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
```

2. Install backend deps and start the server:

```
cd backend
npm install
npm start
```

Health check: `GET http://localhost:5000/api/health` should return status OK.

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Features

- Chatbot: `POST /api/chat` uses OpenAI `gpt-4o-mini` to answer questions like "How to stay positive?".
- Music: `GET /api/music/:mood` fetches Spotify playlists for moods like `happy`, `sad`, `calm` and returns playlist name, link and image.

## Frontend Components

- `src/components/ChatbotUI.jsx`: chat bubbles UI calling `/api/chat`.
- `src/components/MusicRecs.jsx`: mood dropdown and playlist cards calling `/api/music/:mood`.

## Auth Context & API Helper

- `src/context/AuthContext.jsx` exposes `login`, `logout`, `token`, and an Axios instance `api` with Authorization header when logged in.
- `src/utils/api.js` creates an Axios client with `baseURL: /api` and helper to set the bearer token.

## Notes

- To use OpenAI, generate an API key from the OpenAI dashboard and set `OPENAI_API_KEY`.
- To use Spotify, create an app at the Spotify Developer Dashboard, get the Client ID/Secret, and set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.

