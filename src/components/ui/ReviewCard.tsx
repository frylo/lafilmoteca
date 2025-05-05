import { Review } from '../../types/review';
import { Timestamp } from 'firebase/firestore';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < rating ? 'text-filmoteca-olive' : 'text-filmoteca-gray'}>
        ★
      </span>
    ));
  };

  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-filmoteca-dark p-4 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
      <div className="mb-4">
        <h3 className="text-filmoteca-white font-semibold mb-2">{review.userName}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {renderStars(review.rating)}
          </div>
          <span className="text-filmoteca-light text-sm">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>
      
      {review.title && (
        <h4 className="text-filmoteca-white font-medium mb-2">{review.title}</h4>
      )}
      
      <p className="text-filmoteca-light">{review.content}</p>
      
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-filmoteca-light">{review.likes}</span>
          <span className="text-filmoteca-light">me gusta</span>
        </div>
      </div>
    </div>
  );
}; 