import React from 'react';
import ScriptCard from './ScriptCard';
import type { Script } from '../../types';

interface ScriptGridProps {
  scripts: Script[];
  onView: (script: Script) => void;
  onToggleInstall: (script: Script) => void;
}

const ScriptGrid: React.FC<ScriptGridProps> = ({ scripts, onView, onToggleInstall }) => {
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
      {scripts.map(script => (
        <ScriptCard key={script.id} script={script} onView={onView} onToggleInstall={onToggleInstall} />
      ))}
    </div>
  );
};

export default ScriptGrid;
