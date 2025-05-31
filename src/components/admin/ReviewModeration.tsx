import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import StarRating from '../ui/StarRating';
import { getPendingReviews, moderateReview } from '../../lib/admin';
import { getMovieDetails } from '../../lib/tmdb';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ReviewWithMovie extends Review {
  movieTitle: string;
}

const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        setLoading(true);
        const pendingReviews = await getPendingReviews();
        
        const reviewsWithMovies = await Promise.all(
          pendingReviews.map(async (review) => {
            try {
              const movie = await getMovieDetails(review.movieId);
              return {
                ...review,
                movieTitle: movie.title
              };
            } catch (err) {
              console.error(`Error fetching movie ${review.movieId}:`, err);
              return {
                ...review,
                movieTitle: 'Película no disponible'
              };
            }
          })
        );
        
        setReviews(reviewsWithMovies);
        setError(null);
      } catch (err) {
        setError('Error al cargar reseñas pendientes. Por favor, inténtalo de nuevo.');
        console.error('Error fetching pending reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleModerateReview = async (reviewId: string, isApproved: boolean) => {
    try {
      await moderateReview(reviewId, isApproved);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      setError('Error al moderar la reseña. Por favor, inténtalo de nuevo.');
      console.error('Error moderating review:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold p-6 text-filmoteca-white">Moderación de Reseñas</h2>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-6 p-6">
        {currentReviews.map(review => (
          <div key={review.id} className="bg-filmoteca-dark p-6 rounded-lg border border-filmoteca-gray border-opacity-30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-filmoteca-white">Título: {review.title}</h3>
                <p className="text-filmoteca-light">
                  Usuario: {review.userName}
                </p>
                <p className="text-filmoteca-light">
                  Película: {review.movieTitle}
                </p>
                <div className="mt-1">
                  <StarRating initialRating={review.rating} />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleModerateReview(review.id, true)}
                  className="btn-primary"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleModerateReview(review.id, false)}
                  className="btn-secondary"
                >
                  Rechazar
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-filmoteca-dark rounded border border-filmoteca-gray border-opacity-30">
              <p className="whitespace-pre-line text-filmoteca-light">{review.content}</p>
            </div>
            
            <div className="mt-4 text-sm text-filmoteca-light">
              Creada el: {new Date(review.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex">
              <li>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`btn-secondary ${
                      currentPage === page ? 'bg-filmoteca-olive text-filmoteca-white' : ''
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {reviews.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-filmoteca-light">No hay reseñas pendientes de moderación.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewModeration;