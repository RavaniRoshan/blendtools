import { useState, useMemo } from 'react';
import ScriptFilter from '../components/scripts/ScriptFilter';
import ScriptGrid from '../components/scripts/ScriptGrid';
import ScriptUploadForm from '../components/scripts/ScriptUploadForm';
import ScriptPreviewModal from '../components/scripts/ScriptPreviewModal';
import type { Script, Review } from '../types';

const initialScripts: Script[] = [
  {
    id: '1',
    name: 'Rigify',
    category: 'Animation',
    rating: 5,
    downloads: 10000,
    author: 'Blender Foundation',
    description: 'A tool for creating character rigs.',
    tags: ['rigging', 'character', 'animation'],
    version: '1.0',
    installed: true,
    reviews: [
      { id: '1', user: 'Alice', rating: 5, comment: 'Amazing script!' },
      { id: '2', user: 'Bob', rating: 4, comment: 'Very useful.' },
    ],
  },
  {
    id: '2',
    name: 'Node Wrangler',
    category: 'Modeling',
    rating: 5,
    downloads: 25000,
    author: 'Blender Foundation',
    description: 'A tool for working with nodes.',
    tags: ['nodes', 'materials', 'shading'],
    version: '1.2',
    installed: true,
    reviews: [],
  },
  {
    id: '3',
    name: 'Animation Nodes',
    category: 'Animation',
    rating: 4,
    downloads: 5000,
    author: 'Jacques Lucke',
    description: 'A visual scripting system for motion graphics.',
    tags: ['animation', 'motion graphics', 'visual scripting'],
    version: '2.1',
    installed: false,
    reviews: [],
  },
];

const ScriptHub = () => {
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredScripts = useMemo(() => {
    return scripts
      .filter(script =>
        script.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(script => (category ? script.category === category : true))
      .filter(script => (rating ? script.rating >= parseInt(rating, 10) : true));
  }, [scripts, searchQuery, category, rating]);

  const handleViewScript = (script: Script) => {
    setSelectedScript(script);
  };

  const handleCloseModal = () => {
    setSelectedScript(null);
  };

  const handleToggleInstall = (scriptToToggle: Script) => {
    setScripts(prevScripts =>
      prevScripts.map(script =>
        script.id === scriptToToggle.id
          ? { ...script, installed: !script.installed }
          : script
      )
    );
  };

  const handleAddReview = (scriptToReview: Script, rating: number, comment: string) => {
    const newReview: Review = {
      id: `${Date.now()}`,
      user: 'CurrentUser', // Replace with actual user
      rating,
      comment,
    };

    setScripts(prevScripts =>
      prevScripts.map(script =>
        script.id === scriptToReview.id
          ? { ...script, reviews: [...script.reviews, newReview] }
          : script
      )
    );

    // Also update the selected script to show the new review immediately
    setSelectedScript(prevSelectedScript =>
      prevSelectedScript && prevSelectedScript.id === scriptToReview.id
        ? { ...prevSelectedScript, reviews: [...prevSelectedScript.reviews, newReview] }
        : prevSelectedScript
    );
  };

  const handleUploadScript = (name: string, category: string, description: string) => {
    const newScript: Script = {
      id: `${Date.now()}`,
      name,
      category,
      description,
      author: 'CurrentUser', // Replace with actual user
      rating: 0,
      downloads: 0,
      tags: [],
      version: '1.0',
      installed: false,
      reviews: [],
    };
    setScripts(prevScripts => [...prevScripts, newScript]);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Script Hub</h1>
        <button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload Script
        </button>
      </div>
      <ScriptFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        rating={rating}
        setRating={setRating}
      />
      <ScriptGrid scripts={filteredScripts} onView={handleViewScript} onToggleInstall={handleToggleInstall} />
      {selectedScript && (
        <ScriptPreviewModal
          script={selectedScript}
          onClose={handleCloseModal}
          onToggleInstall={handleToggleInstall}
          onAddReview={handleAddReview}
        />
      )}
      {isUploadModalOpen && (
        <ScriptUploadForm
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadScript}
        />
      )}
    </div>
  );
};

export default ScriptHub;
