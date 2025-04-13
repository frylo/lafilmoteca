// Shared type definitions for the application

// Movie related types
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  poster: string;
  year: number;
  director: string;
  runtime?: number; // in minutes
  genres?: string[];
  plot?: string;
  cast?: string[];
  rating?: number;
}

// User related types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: 'guest' | 'user' | 'admin';
  bio?: string;
  followers?: string[];
  following?: string[];
}

// Review related types
export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Auth related types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}