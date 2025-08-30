import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Cloud, History } from 'lucide-react';

const BackupSync: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup and Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Cloud Backup</h3>
            <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
          </div>
          <Button><Cloud className="h-4 w-4 mr-2" /> Backup Now</Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Sync Status</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Sync is up to date</p>
            <Button variant="outline"><History className="h-4 w-4 mr-2" /> Sync History</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupSync;