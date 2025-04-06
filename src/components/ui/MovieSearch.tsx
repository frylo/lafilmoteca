import { useState } from 'react';
import { searchMovies } from '../../lib/tmdb';
import { Movie } from '../../types';
import MovieResults from './MovieResults';

interface MovieSearchProps {
  onSelectMovie?: (movie: Movie) => void;
}

const MovieSearch = ({ onSelectMovie }: MovieSearchProps) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (page = 1) => {
    if (!query.trim()) return;
    if (!import.meta.env.VITE_TMDB_API_KEY) {
      setError('API key is missing. Please configure the environment variables.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await searchMovies(query, page);
      setMovies(result.movies);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError('Error al buscar películas. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handleMovieClick = (movie: Movie) => {
    if (onSelectMovie) {
      onSelectMovie(movie);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar películas..."
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            Buscar
          </button>
        </div>
      </form>

      <MovieResults
        movies={movies}
        loading={loading}
        error={error}
        query={query}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MovieSearch;