import React from 'react';
import type { Script } from '../../types';

interface ScriptCardProps {
  script: Script;
  onView: (script: Script) => void;
  onToggleInstall: (script: Script) => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, onView, onToggleInstall }) => {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-bold">{script.name}</h2>
      <p className="text-sm text-gray-500">{script.category}</p>
      <div className="flex items-center my-2">
        <span className="text-yellow-500">{'★'.repeat(script.rating)}</span>
        <span className="text-gray-400">{'★'.repeat(5 - script.rating)}</span>
      </div>
      <p className="text-sm">Downloads: {script.downloads}</p>
      <p className="text-sm">Author: {script.author}</p>
      <p className="text-sm">Version: {script.version}</p>
      <div className="mt-4 flex justify-between">
        <button onClick={() => onView(script)} className="bg-blue-500 text-white px-4 py-2 rounded">
          View Script
        </button>
        <button onClick={() => onToggleInstall(script)} className={`${script.installed ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded`}>
          {script.installed ? 'Uninstall' : 'Install'}
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;
