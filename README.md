# LaFilmoteca

A modern web application for movie enthusiasts to discover, search, and manage their personal film collection.

## Features

- Search for movies using The Movie Database (TMDB) API
- Save favorite movies to your personal collection
- User authentication with Firebase
- Responsive design with Tailwind CSS
- Built with React, TypeScript, and Vite

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- TMDB API

## Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- Firebase account
- TMDB API key

## Setup

1. Clone the repository

```bash
git clone https://github.com/frylo/lafilmoteca.git
cd lafilmoteca
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with your API keys (use the provided `.env.example` as a template):

```
# Copy from .env.example and fill with your actual API keys
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
# Add other Firebase environment variables as shown in .env.example
```

> **IMPORTANT SECURITY NOTE**: Never commit your `.env` file to version control. It contains sensitive API keys that should be kept private. The `.env` file is already added to `.gitignore` to prevent accidental commits.

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Build for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The project is configured for Firebase Hosting. To deploy:

```bash
npm run build
firebase deploy
```

## License

MIT