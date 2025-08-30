import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ProjectCreationWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    template: '',
    team: [],
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setProjectData({ ...projectData, template: value });
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold">Project Details</h3>
            <Input name="name" placeholder="Project Name" onChange={handleChange} className="mb-2" />
            <Textarea name="description" placeholder="Project Description" onChange={handleChange} className="mb-2" />
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank Project</SelectItem>
                <SelectItem value="archviz">Architectural Visualization</SelectItem>
                <SelectItem value="game_asset">Game Asset</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold">Invite Team Members</h3>
            <Input placeholder="Enter email to invite" className="mb-2" />
            <Button>Invite</Button>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold">Confirmation</h3>
            <p><strong>Name:</strong> {projectData.name}</p>
            <p><strong>Description:</strong> {projectData.description}</p>
            <p><strong>Template:</strong> {projectData.template}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Project</CardTitle>
      </CardHeader>
      <CardContent>
        {renderStep()}
        <div className="flex justify-between mt-4">
          {step > 1 && <Button onClick={prevStep}>Previous</Button>}
          {step < 3 && <Button onClick={nextStep}>Next</Button>}
          {step === 3 && <Button>Create Project</Button>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCreationWizard;