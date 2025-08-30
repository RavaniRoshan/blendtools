import React from 'react';
import ProjectCreationWizard from '../../components/projects/ProjectCreationWizard';
import FileBrowser from '../../components/projects/FileBrowser';
import AssetManager from '../../components/projects/AssetManager';
import TeamManager from '../../components/projects/TeamManager';
import VersionControl from '../../components/projects/VersionControl';
import BackupSync from '../../components/projects/BackupSync';
import ProjectShare from '../../components/projects/ProjectShare';
import ProjectTimeline from '../../components/projects/ProjectTimeline';

const ProjectDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Project Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1"><ProjectCreationWizard /></div>
        <div className="col-span-2"><FileBrowser /></div>
        <div className="col-span-1"><AssetManager /></div>
        <div className="col-span-1"><TeamManager /></div>
        <div className="col-span-1"><VersionControl /></div>
        <div className="col-span-1"><BackupSync /></div>
        <div className="col-span-1"><ProjectShare /></div>
        <div className="col-span-3"><ProjectTimeline /></div>
      </div>
    </div>
  );
};

export default ProjectDashboard;