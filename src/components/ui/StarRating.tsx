import { useState } from 'react';

interface StarRatingProps {
  initialRating?: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating = ({ initialRating = 0, onChange, size = 'md', readonly = false }: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (selectedRating: number) => {
    if (readonly) return;
    setRating(selectedRating);
    onChange(selectedRating);
  };

  const handleMouseEnter = (hoveredRating: number) => {
    if (readonly) return;
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  // Determine star size based on prop
  const starSizeClass = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  }[size];

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`${starSizeClass} focus:outline-none transition-colors duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={readonly}
          aria-label={`${star} estrellas`}
        >
          <span className={`${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-400'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;