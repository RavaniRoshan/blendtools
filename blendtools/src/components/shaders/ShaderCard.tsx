import React from 'react';
import type { Shader } from '../../types';

interface ShaderCardProps {
  shader: Shader;
  onView: (shader: Shader) => void;
}

const ShaderCard: React.FC<ShaderCardProps> = ({ shader, onView }) => {
  return (
    <div className="border p-4 rounded cursor-pointer" onClick={() => onView(shader)}>
      <img src={shader.thumbnail} alt={shader.name} className="w-full h-32 object-cover mb-2" />
      <h3 className="text-lg font-bold">{shader.name}</h3>
      <p className="text-sm text-gray-500">{shader.category}</p>
      <div className="flex items-center my-1">
        <span className="text-yellow-500">{'★'.repeat(shader.rating)}</span>
        <span className="text-gray-400">{'★'.repeat(5 - shader.rating)}</span>
      </div>
      <p className="text-sm">Downloads: {shader.downloads}</p>
    </div>
  );
};

export default ShaderCard;
