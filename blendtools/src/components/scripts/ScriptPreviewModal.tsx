import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import type { Script } from '../../types';
import ScriptReviews from './ScriptReviews';
import ReviewForm from './ReviewForm';

interface ScriptPreviewModalProps {
  script: Script;
  onClose: () => void;
  onToggleInstall: (script: Script) => void;
  onAddReview: (script: Script, rating: number, comment: string) => void;
}

const ScriptPreviewModal: React.FC<ScriptPreviewModalProps> = ({ script, onClose, onToggleInstall, onAddReview }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [script]);

  const scriptCode = `
# ${script.name}
# Author: ${script.author}
# Version: ${script.version}

import bpy

# Your script code here

print("Hello from ${script.name}!")
  `;

  const handleReviewSubmit = (rating: number, comment: string) => {
    onAddReview(script, rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full overflow-auto max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{script.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <pre className="language-python overflow-auto max-h-96"><code>{scriptCode}</code></pre>
        <ScriptReviews reviews={script.reviews} />
        <ReviewForm onSubmit={handleReviewSubmit} />
        <div className="mt-4 flex justify-end">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white px-4 py-2 rounded mr-2">
            View on GitHub
          </a>
          <button onClick={() => onToggleInstall(script)} className={`${script.installed ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded mr-2`}>
            {script.installed ? 'Uninstall' : 'Install'}
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ScriptPreviewModal;
