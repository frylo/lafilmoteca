import { Link } from 'react-router-dom';
import { Movie } from '../../types';
import LoadingSpinner from './LoadingSpinner';

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
      <LoadingSpinner />
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-filmoteca-white bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
        {error}
      </div>
    );
  }

  if (movies.length === 0 && query.trim()) {
    return (
      <div className="text-center py-8 text-filmoteca-gray">
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
              <h2 className="text-xl font-semibold text-filmoteca-white">{movie.title}</h2>
              <p className="text-filmoteca-gray">
                {movie.year > 0 ? movie.year : 'Año desconocido'}
                {movie.director && ` • ${movie.director}`}
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-filmoteca-light px-3">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
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