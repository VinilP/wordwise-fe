import React, { useState } from 'react';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  className?: string;
}

const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  maxRating = 5,
  size = 'md',
  disabled = false,
  error,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || value;
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= displayRating;
      
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={`
            ${sizeClasses[size]} 
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'} 
            transition-all duration-150 ease-in-out
            ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
            ${!disabled && 'hover:text-yellow-500'}
          `}
          aria-label={`Rate ${i} out of ${maxRating} stars`}
          data-testid={`rating-${i}`}
        >
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className={className}>
      <div className="flex items-center space-x-1">
        {renderStars()}
        {value > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            ({value} out of {maxRating})
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default RatingInput;