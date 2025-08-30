import React from 'react';

interface ScriptFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  rating: string;
  setRating: (rating: string) => void;
}

const ScriptFilter: React.FC<ScriptFilterProps> = ({ searchQuery, setSearchQuery, category, setCategory, rating, setRating }) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search scripts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
        <option value="">All Categories</option>
        <option value="Animation">Animation</option>
        <option value="Modeling">Modeling</option>
        <option value="Rendering">Rendering</option>
      </select>
      <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-2 rounded">
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars & Up</option>
        <option value="3">3 Stars & Up</option>
        <option value="2">2 Stars & Up</option>
        <option value="1">1 Star & Up</option>
      </select>
    </div>
  );
};

export default ScriptFilter;
