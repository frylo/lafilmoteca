/* eslint-disable @typescript-eslint/no-explicit-any */
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
  isActive: boolean;
}

// Review related types
export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isApproved: boolean;
  likes: number;
  userPhotoURL?: string;
}

// Auth related types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Stats related types
export interface DetailedStats {
  newUsers: number;
  newReviews: number;
  newCollections?: number;
  newMoviesInCollections?: number;
  newUsersChange?: number;
  newReviewsChange?: number;
  newCollectionsChange?: number;
  newMoviesChange?: number;
  topRatedMovies: {
    id: string;
    title: string;
    rating: number;
  }[];
  mostActiveUsers: {
    userId: string;
    userName: string;
    count: number;
  }[];
  ratingsDistribution: number[];
  activeUsersData?: any;
  reviewsCreatedData?: any;
  popularMovies?: {
    title: string;
    reviewCount: number;
    averageRating: number;
    collectionCount: number;
  }[];
  activeUsers?: {
    displayName: string;
    reviewCount: number;
    collectionCount: number;
    lastActivity: string | Date;
  }[];
}

export interface MonthlyGrowthData {
  month: string;
  users: number;
  reviews: number;
}