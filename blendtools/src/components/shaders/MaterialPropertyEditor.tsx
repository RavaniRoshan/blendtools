import React from 'react';
import type { MaterialProperties } from '../../types';

interface MaterialPropertyEditorProps {
  properties: MaterialProperties;
}

const MaterialPropertyEditor: React.FC<MaterialPropertyEditorProps> = ({ properties }) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">Material Properties</h3>
      <div className="space-y-2">
        {properties.baseColor && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Color</label>
            <input type="color" value={properties.baseColor} className="mt-1 block w-full" />
          </div>
        )}
        {typeof properties.metallic === 'number' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Metallic</label>
            <input type="range" min="0" max="1" step="0.01" value={properties.metallic} className="mt-1 block w-full" />
          </div>
        )}
        {typeof properties.roughness === 'number' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Roughness</label>
            <input type="range" min="0" max="1" step="0.01" value={properties.roughness} className="mt-1 block w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialPropertyEditor;
