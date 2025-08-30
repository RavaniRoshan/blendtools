import React from 'react';
import type { Review } from '../../types';

interface ScriptReviewsProps {
  reviews: Review[];
}

const ScriptReviews: React.FC<ScriptReviewsProps> = ({ reviews }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      {reviews.map(review => (
        <div key={review.id} className="border-b py-4">
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">{review.user}</span>
            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
            <span className="text-gray-400">{'★'.repeat(5 - review.rating)}</span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ScriptReviews;
