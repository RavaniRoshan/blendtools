import React from 'react';
import type { Shader } from '../../types';
import ScriptReviews from '../scripts/ScriptReviews';
import ReviewForm from '../scripts/ReviewForm';

interface ShaderPreviewProps {
  shader: Shader;
  onAddReview: (shader: Shader, rating: number, comment: string) => void;
}

const ShaderPreview: React.FC<ShaderPreviewProps> = ({ shader, onAddReview }) => {
  const handleReviewSubmit = (rating: number, comment: string) => {
    onAddReview(shader, rating, comment);
  };

  return (
    <div className="mb-4">
      <img src={shader.thumbnail} alt={shader.name} className="w-full h-64 object-cover rounded" />
      <h2 className="text-xl font-bold mt-2">{shader.name}</h2>
      <p className="text-gray-600">{shader.description}</p>
      <ScriptReviews reviews={shader.reviews} />
      <ReviewForm onSubmit={handleReviewSubmit} />
    </div>
  );
};

export default ShaderPreview;
