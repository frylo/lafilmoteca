import { useState, useEffect } from 'react';
import { Review } from '../../types/review';
import { getMovieReviews } from '../../lib/reviews';
import { ReviewCard } from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';

interface ReviewListProps {
  movieId: string;
}

const ReviewList = ({ movieId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      setLoading(true);
        const movieReviews = await getMovieReviews(movieId);
        setReviews(movieReviews);
      setError(null);
    } catch (err) {
        setError('Error al cargar las reseñas');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchReviews();
  }, [movieId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-gray-500">No hay reseñas todavía</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
          ))}
    </div>
  );
};

export default ReviewList;