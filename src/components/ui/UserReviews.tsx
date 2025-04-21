import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Review } from '../../types';
import { getUserReviews } from '../../lib/reviews';
import { getMovieDetails } from '../../lib/tmdb';
import StarRating from './StarRating';

interface UserReviewsProps {
  userId: string;
  isCurrentUser?: boolean;
}

interface ReviewWithMovie extends Review {
  movieTitle: string;
  moviePoster: string;
}

const UserReviews = ({ userId, isCurrentUser = false }: UserReviewsProps) => {
  const [reviews, setReviews] = useState<ReviewWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user reviews
        const userReviews = await getUserReviews(userId);
        
        // Fetch movie details for each review
        const reviewsWithMovies = await Promise.all(
          userReviews.map(async (review) => {
            try {
              const movie = await getMovieDetails(review.movieId);
              return {
                ...review,
                movieTitle: movie.title,
                moviePoster: movie.poster
              };
            } catch (err) {
              console.error(`Error fetching movie ${review.movieId}:`, err);
              return {
                ...review,
                movieTitle: 'Película no disponible',
                moviePoster: ''
              };
            }
          })
        );
        
        setReviews(reviewsWithMovies);
      } catch (err) {
        console.error('Error fetching user reviews:', err);
        setError('No se pudieron cargar las reseñas. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-filmoteca-olive"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30 text-center">
        <p className="text-filmoteca-light">
          {isCurrentUser 
            ? 'No has escrito ninguna reseña todavía. ¡Busca películas y comparte tu opinión!'
            : 'Este usuario no ha escrito ninguna reseña todavía.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-filmoteca-dark p-4 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
          <div className="flex mb-3">
            <div className="w-16 h-24 flex-shrink-0 mr-3">
              {review.moviePoster ? (
                <img 
                  src={review.moviePoster} 
                  alt={review.movieTitle} 
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-filmoteca-gray bg-opacity-20 flex items-center justify-center rounded">
                  <span className="text-xs text-filmoteca-gray">Sin imagen</span>
                </div>
              )}
            </div>
            <div>
              <Link 
                to={`/movie/${review.movieId}`} 
                className="font-semibold hover:text-filmoteca-olive transition-colors duration-200"
              >
                {review.movieTitle}
              </Link>
              <div className="flex items-center mt-1">
                <StarRating initialRating={review.rating} onChange={() => {}} readonly size="sm" />
              </div>
              <div className="text-xs text-filmoteca-gray mt-1">
                {new Date(review.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          <h4 className="font-medium mb-1">{review.title}</h4>
          <p className="text-sm text-filmoteca-light line-clamp-3">{review.content}</p>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center text-sm text-filmoteca-gray">
              <span className="mr-1">♥</span>
              <span>{review.likes}</span>
            </div>
            <Link 
              to={`/movie/${review.movieId}`} 
              className="text-xs text-filmoteca-olive hover:underline"
            >
              Ver reseña completa
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserReviews;