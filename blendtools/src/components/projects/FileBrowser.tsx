import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Folder, File, Upload } from 'lucide-react';

const FileBrowser: React.FC = () => {
  const [files, setFiles] = useState([
    { name: 'scenes', type: 'folder' },
    { name: 'models', type: 'folder' },
    { name: 'textures', type: 'folder' },
    { name: 'project_file.blend', type: 'file' },
  ]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>File Browser</CardTitle>
        <div>
          <Button variant="outline" size="sm" className="mr-2"><Folder className="h-4 w-4 mr-2" /> New Folder</Button>
          <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" /> Upload</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="flex items-center py-1">
              {file.type === 'folder' ? <Folder className="h-4 w-4 mr-2" /> : <File className="h-4 w-4 mr-2" />}
              <span>{file.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FileBrowser;