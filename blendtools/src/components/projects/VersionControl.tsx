import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GitCommit } from 'lucide-react';

const VersionControl: React.FC = () => {
  const commits = [
    { hash: 'a1b2c3d', message: 'Initial commit', author: 'John Doe', date: '2023-10-27' },
    { hash: 'e4f5g6h', message: 'Added new model', author: 'Jane Smith', date: '2023-10-28' },
    { hash: 'i7j8k9l', message: 'Fixed lighting issue', author: 'John Doe', date: '2023-10-29' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Commit History</h3>
          <ul>
            {commits.map((commit) => (
              <li key={commit.hash} className="flex items-center py-2 border-b">
                <GitCommit className="h-4 w-4 mr-2" />
                <div>
                  <p className="font-semibold">{commit.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {commit.author} committed on {commit.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Diff View</h3>
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-sm text-muted-foreground">Select a commit to see the changes.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionControl;