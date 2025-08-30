import React from 'react';

interface ShaderFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

const ShaderFilter: React.FC<ShaderFilterProps> = ({ searchQuery, setSearchQuery, category, setCategory }) => {
  const handleVisualSearch = () => {
    console.log('Visual Similarity Search clicked');
    alert('Visual Similarity Search functionality coming soon!');
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <input
        type="text"
        placeholder="Search shaders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
        <option value="">All Categories</option>
        <option value="Metal">Metal</option>
        <option value="Glass">Glass</option>
        <option value="Fabric">Fabric</option>
      </select>
      <button onClick={handleVisualSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Visual Search
      </button>
    </div>
  );
};

export default ShaderFilter;
