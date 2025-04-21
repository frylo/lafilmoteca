import { useState, useEffect } from 'react';
import { Review } from '../../types';
import { getMovieReviews } from '../../lib/reviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewListProps {
  movieId: string;
  movieTitle: string;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-liked';

const ReviewList = ({ movieId, movieTitle }: ReviewListProps) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let sortField = 'createdAt';
      let sortOrder: 'asc' | 'desc' = 'desc';

      switch (sortBy) {
        case 'newest':
          sortField = 'createdAt';
          sortOrder = 'desc';
          break;
        case 'oldest':
          sortField = 'createdAt';
          sortOrder = 'asc';
          break;
        case 'highest':
          sortField = 'rating';
          sortOrder = 'desc';
          break;
        case 'lowest':
          sortField = 'rating';
          sortOrder = 'asc';
          break;
        case 'most-liked':
          sortField = 'likes';
          sortOrder = 'desc';
          break;
      }

      const reviewsData = await getMovieReviews(movieId, sortField, sortOrder);
      setReviews(reviewsData);

      // Check if current user has already reviewed this movie
      if (currentUser) {
        const hasReviewed = reviewsData.some(review => review.userId === currentUser.uid);
        setUserHasReviewed(hasReviewed);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('No se pudieron cargar las reseñas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId, sortBy]);

  const handleReviewSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    fetchReviews();
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = () => {
    fetchReviews();
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reseñas</h2>
        
        <div className="flex space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-filmoteca-gray bg-opacity-20 border border-filmoteca-gray border-opacity-30 rounded-md p-2 text-filmoteca-white focus:outline-none focus:ring-2 focus:ring-filmoteca-olive"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="highest">Mayor puntuación</option>
            <option value="lowest">Menor puntuación</option>
            <option value="most-liked">Más populares</option>
          </select>
          
          {currentUser && !userHasReviewed && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-filmoteca-olive text-filmoteca-dark rounded-md hover:bg-opacity-90 transition-colors duration-200"
            >
              Escribir reseña
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <ReviewForm
            movieId={movieId}
            movieTitle={movieTitle}
            existingReview={editingReview || undefined}
            onSuccess={handleReviewSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-filmoteca-olive"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div>
          {reviews.map(review => (
            <ReviewItem
              key={review.id}
              review={review}
              onEdit={() => handleEditReview(review)}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      ) : (
        <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30 text-center">
          <p className="text-filmoteca-light">
            No hay reseñas para esta película. {currentUser ? '¡Sé el primero en escribir una!' : 'Inicia sesión para escribir una reseña.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;