import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../lib/tmdb';
import { Movie } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AddToCollection from '../components/ui/AddToCollection';
import ReviewList from '../components/ui/ReviewList';
import ReviewForm from '../components/ui/ReviewForm';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-filmoteca-olive"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-filmoteca-olive hover:text-filmoteca-white transition-colors duration-200">
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 text-filmoteca-white p-4 rounded-lg">
          No se encontró la película solicitada.
        </div>
        <div className="mt-4">
          <Link to="/" className="text-filmoteca-olive hover:text-filmoteca-white transition-colors duration-200">
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
              className="w-full rounded-lg shadow-md border border-filmoteca-gray border-opacity-20"
            />
          ) : (
            <div className="w-full h-96 bg-filmoteca-gray bg-opacity-20 flex items-center justify-center rounded-lg border border-filmoteca-gray border-opacity-30">
              <span className="text-filmoteca-gray">No hay imagen disponible</span>
            </div>
          )}
        </div>
        
        {/* Movie Info */}
        <div className="md:w-2/3">
          <div className="mb-4">
            <Link to="/" className="text-filmoteca-olive hover:text-filmoteca-white transition-colors duration-200">
              &larr; Volver al buscador
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <h2 className="text-xl text-filmoteca-gray mb-4">{movie.originalTitle}</h2>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.year && (
              <span className="bg-filmoteca-dark border border-filmoteca-gray border-opacity-50 px-3 py-1 rounded-full text-sm">
                {movie.year}
              </span>
            )}
            {movie.runtime && (
              <span className="bg-filmoteca-dark border border-filmoteca-gray border-opacity-50 px-3 py-1 rounded-full text-sm">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
              </span>
            )}
            {movie.rating && (
              <span className="bg-filmoteca-olive bg-opacity-90 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="mr-1">★</span>
                {(movie.rating / 2).toFixed(1)}
              </span>
            )}
          </div>
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="bg-filmoteca-gray bg-opacity-20 border border-filmoteca-gray border-opacity-30 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {movie.director && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-filmoteca-white">Director</h3>
              <p className="text-filmoteca-light">{movie.director}</p>
            </div>
          )}
          
          {movie.cast && movie.cast.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-filmoteca-white">Reparto principal</h3>
              <p className="text-filmoteca-light">{movie.cast.join(', ')}</p>
            </div>
          )}
          
          {movie.plot && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-filmoteca-white">Sinopsis</h3>
              <p className="text-filmoteca-light">{movie.plot}</p>
            </div>
          )}
          
          {/* Añadir a colección (solo para usuarios autenticados) */}
          {currentUser && (
            <div className="mt-6">
              <AddToCollection userId={currentUser.uid} movieId={id || ''} />
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      {movie && id && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-filmoteca-white">Reseñas</h2>
            {currentUser && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary"
              >
                Escribir una reseña
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                movieId={id}
                movieTitle={movie.title}
                onSuccess={() => {
                  setShowReviewForm(false);
                  // Aquí podrías refrescar la lista de reseñas si es necesario
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewList movieId={id} />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;