// TMDB API service for LaFilmoteca
import { Movie } from '../types';

// TMDB API configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Interface for TMDB movie search response
interface TMDBMovieSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

// Interface for TMDB movie object
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

/**
 * Search for movies in TMDB API
 * @param query Search query string
 * @param page Page number for pagination (default: 1)
 * @returns Promise with search results
 */
export const searchMovies = async (query: string, page: number = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined. Please add VITE_TMDB_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBMovieSearchResponse = await response.json();
    
    // Transform TMDB movie format to our app's Movie format
    const movies: Movie[] = data.results.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.original_title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      director: '',
      plot: movie.overview,
      rating: movie.vote_average,
    }));

    return {
      movies,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Get movie details from TMDB API
 * @param movieId TMDB movie ID
 * @returns Promise with movie details
 */
export const getMovieDetails = async (movieId: string): Promise<Movie> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined. Please add VITE_TMDB_API_KEY to your environment variables.');
  }

  try {
    // Get movie details
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits`
    );

    if (!movieResponse.ok) {
      throw new Error(`TMDB API error: ${movieResponse.status}`);
    }

    const movieData = await movieResponse.json();
    
    // Extract director from credits
    const director = movieData.credits?.crew?.find((person: { job: string; name: string }) => person.job === 'Director')?.name || '';
    
    // Extract cast
    const cast = movieData.credits?.cast?.slice(0, 10).map((person: { name: string }) => person.name) || [];

    // Transform to our Movie format
    const movie: Movie = {
      id: movieData.id.toString(),
      title: movieData.title,
      originalTitle: movieData.original_title,
      poster: movieData.poster_path ? `${TMDB_IMAGE_BASE_URL}${movieData.poster_path}` : '',
      year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : 0,
      director,
      runtime: movieData.runtime || 0,
      genres: movieData.genres?.map((genre: { name: string }) => genre.name) || [],
      plot: movieData.overview,
      cast,
      rating: movieData.vote_average,
    };

    return movie;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};

/**
 * Get popular movies from TMDB API
 * @param page Page number for pagination (default: 1)
 * @returns Promise with popular movies
 */
export const getPopularMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined. Please add VITE_TMDB_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBMovieSearchResponse = await response.json();
    
    // Transform TMDB movie format to our app's Movie format
    const movies: Movie[] = data.results.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.original_title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      director: '', // TMDB doesn't provide director in popular movies
      plot: movie.overview,
      rating: movie.vote_average,
    }));

    return {
      movies,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('Error getting popular movies:', error);
    throw error;
  }
};

/**
 * Get top rated movies from TMDB API
 * @param page Page number for pagination (default: 1)
 * @returns Promise with top rated movies
 */
export const getTopRatedMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined. Please add VITE_TMDB_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBMovieSearchResponse = await response.json();
    
    const movies: Movie[] = data.results.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.original_title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      director: '',
      plot: movie.overview,
      rating: movie.vote_average,
    }));

    return {
      movies,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('Error getting top rated movies:', error);
    throw error;
  }
};

/**
 * Get upcoming movies from TMDB API
 * @param page Page number for pagination (default: 1)
 * @returns Promise with upcoming movies
 */
export const getUpcomingMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined. Please add VITE_TMDB_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBMovieSearchResponse = await response.json();
    
    const movies: Movie[] = data.results.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.original_title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      director: '',
      plot: movie.overview,
      rating: movie.vote_average,
    }));

    return {
      movies,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('Error getting upcoming movies:', error);
    throw error;
  }
};

/**
 * Get now playing movies from TMDB API
 * @param page Page number for pagination (default: 1)
 * @returns Promise with now playing movies
 */
export const getNowPlayingMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not defined. Please add VITE_TMDB_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBMovieSearchResponse = await response.json();
    
    const movies: Movie[] = data.results.map(movie => ({
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.original_title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      director: '',
      plot: movie.overview,
      rating: movie.vote_average,
    }));

    return {
      movies,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('Error getting now playing movies:', error);
    throw error;
  }
};