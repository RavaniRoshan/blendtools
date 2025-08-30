import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Copy, Share2, Download } from 'lucide-react';

const ProjectShare: React.FC = () => {
  const shareableLink = 'https://blendtools.app/share/project/12345';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share & Export</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Shareable Link</h3>
          <div className="flex items-center space-x-2">
            <Input value={shareableLink} readOnly />
            <Button variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Export Project</h3>
          <div className="flex space-x-2">
            <Button variant="outline"><Download className="h-4 w-4 mr-2" /> as .zip</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" /> as .blend</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectShare;