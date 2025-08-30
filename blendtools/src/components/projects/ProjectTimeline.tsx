import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ProjectTimeline: React.FC = () => {
  const timelineEvents = [
    { id: 1, date: '2023-10-27', title: 'Project Created', description: 'John Doe created the project.' },
    { id: 2, date: '2023-10-28', title: 'Asset Uploaded', description: 'Jane Smith uploaded a new model.' },
    { id: 3, date: '2023-10-29', title: 'Team Member Invited', description: 'John Doe invited a new member.' },
    { id: 4, date: '2023-10-30', title: 'Version Committed', description: 'Jane Smith committed a new version.' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-0">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative mb-8 pl-8">
              <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full"></div>
              <p className="text-sm text-muted-foreground">{event.date}</p>
              <h4 className="font-semibold">{event.title}</h4>
              <p className="text-sm">{event.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;