import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface MovieSectionProps {
  title: string;
  fetchMovies: () => Promise<{ movies: Movie[] }>;
  limit?: number;
}

const MovieSection = ({ title, fetchMovies, limit = 8 }: MovieSectionProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const result = await fetchMovies();
        setMovies(result.movies.slice(0, limit));
        setError(null);
      } catch (err) {
        setError('Error al cargar las películas. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [fetchMovies, limit]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-filmoteca-white bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
        {error}
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-filmoteca-white">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="card transition-transform hover:scale-105 hover:shadow-lg"
          >
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-filmoteca-gray bg-opacity-20 flex items-center justify-center">
                <span className="text-filmoteca-gray">No hay imagen</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-filmoteca-white">{movie.title}</h3>
              <p className="text-filmoteca-gray">
                {movie.year > 0 ? movie.year : 'Año desconocido'}
              </p>
              {movie.rating && (
                <div className="mt-2 flex items-center">
                  <span className="text-filmoteca-olive mr-1">★</span>
                  <span className="text-filmoteca-light">{(movie.rating / 2).toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieSection; 