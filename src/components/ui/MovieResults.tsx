import { Link } from 'react-router-dom';
import { Movie } from '../../types';

interface MovieResultsProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  query: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const MovieResults = ({
  movies,
  loading,
  error,
  query,
  totalPages,
  currentPage,
  onPageChange,
}: MovieResultsProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  if (movies.length === 0 && query.trim()) {
    return (
      <div className="text-center py-8 text-gray-400">
        No se encontraron películas para "{query}"
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
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
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
            >
              Anterior
            </button>
            <span className="text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MovieResults;