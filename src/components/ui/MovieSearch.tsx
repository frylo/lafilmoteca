import { useState } from 'react';
import { searchMovies } from '../../lib/tmdb';
import { Movie } from '../../types';

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
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar películas..."
            className="flex-grow px-4 py-2 text-gray-900 bg-white rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {movies.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleMovieClick(movie)}
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No hay imagen</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{movie.title}</h2>
                  <p className="text-gray-400">
                    {movie.year > 0 ? movie.year : 'Año desconocido'}
                    {movie.director && ` • ${movie.director}`}
                  </p>
                  {movie.rating && (
                    <div className="mt-2 flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{(movie.rating / 2).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
                >
                  Anterior
                </button>
                <span className="text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : query.trim() && !loading ? (
        <div className="text-center py-8 text-gray-400">
          No se encontraron películas para "{query}"
        </div>
      ) : null}
    </div>
  );
};

export default MovieSearch;