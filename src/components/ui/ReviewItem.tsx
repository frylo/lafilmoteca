import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { likeReview, unlikeReview, deleteReview } from '../../lib/reviews';
import StarRating from './StarRating';

interface ReviewItemProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ReviewItem = ({ review, onEdit, onDelete }: ReviewItemProps) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(false); // Ideally, this would be fetched from a user-likes collection
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Date(review.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      if (isLiked) {
        await unlikeReview(review.id);
        setLikes(prev => prev - 1);
      } else {
        await likeReview(review.id);
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDelete = async () => {
    if (!currentUser || (currentUser.uid !== review.userId && currentUser.role !== 'admin')) return;

    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.')) {
      try {
        setIsDeleting(true);
        setError(null);
        await deleteReview(review.id);
        if (onDelete) onDelete();
      } catch (err) {
        console.error('Error deleting review:', err);
        setError('No se pudo eliminar la reseña. Por favor, inténtalo de nuevo.');
        setIsDeleting(false);
      }
    }
  };

  const isOwner = currentUser && currentUser.uid === review.userId;
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div className="bg-filmoteca-dark p-4 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30 mb-4">
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-3 rounded-lg mb-3">
          {error}
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {review.userPhotoURL ? (
            <img 
              src={review.userPhotoURL} 
              alt={review.userName} 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-filmoteca-olive flex items-center justify-center mr-3">
              <span className="text-filmoteca-dark font-bold">
                {review.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <Link to={`/profile/${review.userId}`} className="font-medium hover:text-filmoteca-olive transition-colors duration-200">
              {review.userName}
            </Link>
            <div className="text-sm text-filmoteca-gray">{formattedDate}</div>
          </div>
        </div>
        <StarRating initialRating={review.rating} onChange={() => {}} readonly size="sm" />
      </div>

      <h4 className="text-lg font-semibold mb-2">{review.title}</h4>
      <p className="text-filmoteca-light mb-4">{review.content}</p>

      <div className="flex justify-between items-center">
        <button 
          onClick={handleLike}
          disabled={!currentUser}
          className={`flex items-center space-x-1 text-sm ${isLiked ? 'text-filmoteca-olive' : 'text-filmoteca-gray'} hover:text-filmoteca-olive transition-colors duration-200`}
          aria-label={isLiked ? 'Quitar me gusta' : 'Me gusta'}
        >
          <span className="text-lg">{isLiked ? '♥' : '♡'}</span>
          <span>{likes}</span>
        </button>

        {(isOwner || isAdmin) && (
          <div className="flex space-x-3">
            {isOwner && onEdit && (
              <button 
                onClick={onEdit}
                className="text-sm text-filmoteca-gray hover:text-filmoteca-olive transition-colors duration-200"
              >
                Editar
              </button>
            )}
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-500 hover:text-red-400 transition-colors duration-200"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;