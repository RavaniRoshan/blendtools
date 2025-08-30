import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const TeamManager: React.FC = () => {
  const [team, setTeam] = useState([
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: '' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', avatar: '' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Invite New Member</h3>
          <div className="flex items-center space-x-2">
            <Input placeholder="Enter email to invite" />
            <Button>Invite</Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Team Members</h3>
          <ul>
            {team.map((member, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Select value={member.role}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamManager;