import React from 'react';
import ShaderCard from './ShaderCard';
import type { Shader } from '../../types';

interface ShaderGridProps {
  shaders: Shader[];
  onView: (shader: Shader) => void;
}

const ShaderGrid: React.FC<ShaderGridProps> = ({ shaders, onView }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {shaders.map(shader => (
        <ShaderCard key={shader.id} shader={shader} onView={onView} />
      ))}
    </div>
  );
};

export default ShaderGrid;
