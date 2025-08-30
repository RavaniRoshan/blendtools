import { useState, useMemo } from 'react';
import ShaderFilter from '../components/shaders/ShaderFilter';
import ShaderGrid from '../components/shaders/ShaderGrid';
import ShaderPreview from '../components/shaders/ShaderPreview';
import ShaderNodeGraph from '../components/shaders/ShaderNodeGraph';
import MaterialPropertyEditor from '../components/shaders/MaterialPropertyEditor';
import type { Shader, Review } from '../types';

const initialShaders: Shader[] = [
  {
    id: '1',
    name: 'Glossy Metal',
    category: 'Metal',
    thumbnail: 'https://via.placeholder.com/150/FFD700/000000?text=Metal',
    tags: ['metal', 'glossy', 'pbr'],
    node_data: [],
    properties: { baseColor: '#FFD700', metallic: 1, roughness: 0.2 },
    rating: 5,
    downloads: 1200,
    author: 'ShaderMaster',
    reviews: [],
    description: 'A highly reflective metal shader with adjustable color and roughness.',
  },
  {
    id: '2',
    name: 'Frosted Glass',
    category: 'Glass',
    thumbnail: 'https://via.placeholder.com/150/ADD8E6/000000?text=Glass',
    tags: ['glass', 'transparent', 'frosted'],
    node_data: [],
    properties: { baseColor: '#ADD8E6', metallic: 0, roughness: 0.8 },
    rating: 4,
    downloads: 800,
    author: 'GlassWizard',
    reviews: [],
    description: 'A translucent glass shader with a frosted appearance.',
  },
  {
    id: '3',
    name: 'Rough Fabric',
    category: 'Fabric',
    thumbnail: 'https://via.placeholder.com/150/D2B48C/000000?text=Fabric',
    tags: ['fabric', 'cloth', 'rough'],
    node_data: [],
    properties: { baseColor: '#D2B48C', metallic: 0, roughness: 0.9 },
    rating: 3,
    downloads: 500,
    author: 'TextileGuru',
    reviews: [],
    description: 'A coarse fabric shader with a distinct woven texture.',
  },
];

const ShaderLibrary = () => {
  const [shaders, setShaders] = useState<Shader[]>(initialShaders);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selectedShader, setSelectedShader] = useState<Shader | null>(initialShaders[0]);

  const filteredShaders = useMemo(() => {
    return shaders
      .filter(shader =>
        shader.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(shader => (category ? shader.category === category : true));
  }, [shaders, searchQuery, category]);

  const handleViewShader = (shader: Shader) => {
    setSelectedShader(shader);
  };

  const handleImportShader = () => {
    console.log('Import Shader clicked');
    // Placeholder for actual import logic
    alert('Import Shader functionality coming soon!');
  };

  const handleExportShader = () => {
    console.log('Export Shader clicked');
    // Placeholder for actual export logic
    alert('Export Shader functionality coming soon!');
  };

  const handleAddReview = (shaderToReview: Shader, rating: number, comment: string) => {
    const newReview: Review = {
      id: `${Date.now()}`,
      user: 'CurrentUser', // Replace with actual user
      rating,
      comment,
    };

    setShaders(prevShaders =>
      prevShaders.map(shader =>
        shader.id === shaderToReview.id
          ? { ...shader, reviews: [...shader.reviews, newReview] }
          : shader
      )
    );

    // Also update the selected shader to show the new review immediately
    setSelectedShader(prevSelectedShader =>
      prevSelectedShader && prevSelectedShader.id === shaderToReview.id
        ? { ...prevSelectedShader, reviews: [...prevSelectedShader.reviews, newReview] }
        : prevSelectedShader
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Shader Library</h1>
        <div>
          <button onClick={handleImportShader} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Import Shader
          </button>
          <button onClick={handleExportShader} className="bg-purple-500 text-white px-4 py-2 rounded">
            Export Shader
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <ShaderFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
          />
          <ShaderGrid shaders={filteredShaders} onView={handleViewShader} />
        </div>
        <div className="md:col-span-2">
          {selectedShader && (
            <>
              <ShaderPreview shader={selectedShader} onAddReview={handleAddReview} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ShaderNodeGraph nodeData={selectedShader.node_data} />
                <MaterialPropertyEditor properties={selectedShader.properties} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShaderLibrary;
