import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ value = 0, max = 5, onChange, readonly = false, size = 'md' }) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = [];
  for (let i = 1; i <= max; i++) {
    const isFilled = i <= Math.round(value);
    stars.push(
      <button
        key={i}
        type="button"
        disabled={readonly}
        onClick={() => !readonly && onChange && onChange(i)}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none p-0.5`}
        aria-label={`${i} stars`}
      >
        <Star
          className={`${sizeMap[size] || sizeMap.md} ${
            isFilled
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300'
          }`}
        />
      </button>
    );
  }

  return <div className="inline-flex items-center gap-0.5">{stars}</div>;
};

export default RatingStars;
