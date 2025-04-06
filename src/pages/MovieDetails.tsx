import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../lib/tmdb';
import { Movie } from '../types';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('No se pudo cargar la información de la película. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          No se encontró la película solicitada.
        </div>
        <div className="mt-4">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="md:w-1/3">
          {movie.poster ? (
            <img 
              src={movie.poster} 
              alt={`${movie.title} poster`} 
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-700 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No hay imagen disponible</span>
            </div>
          )}
        </div>
        
        {/* Movie Info */}
        <div className="md:w-2/3">
          <div className="mb-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              &larr; Volver al buscador
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <h2 className="text-xl text-gray-400 mb-4">{movie.originalTitle}</h2>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.year && (
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {movie.year}
              </span>
            )}
            {movie.runtime && (
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
              </span>
            )}
            {movie.rating && (
              <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="mr-1">★</span>
                {(movie.rating / 2).toFixed(1)}
              </span>
            )}
          </div>
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {movie.director && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Director</h3>
              <p>{movie.director}</p>
            </div>
          )}
          
          {movie.cast && movie.cast.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Reparto principal</h3>
              <p>{movie.cast.join(', ')}</p>
            </div>
          )}
          
          {movie.plot && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Sinopsis</h3>
              <p className="text-gray-300">{movie.plot}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;