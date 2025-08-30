import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UploadCloud } from 'lucide-react';

const AssetManager: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
  }, [uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-md text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-border'}`}>
          <input {...getInputProps()} />
          <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive ? 'Drop the files here ...' : 'Drag \'n\' drop some files here, or click to select files'}
          </p>
        </div>
        <ul className="mt-4">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="text-sm">{file.name}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AssetManager;