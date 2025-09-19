import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Upload, FileText } from 'lucide-react';

export const StoreData: React.FC = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    projectName: '',
    datasetName: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a dataset file');

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    data.append('projectName', formData.projectName);
    data.append('datasetName', formData.datasetName);

    try {
      const res = await fetch('http://localhost:3000/api/ingestdata', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        alert('Dataset uploaded successfully!');
        setFormData({ latitude: '', longitude: '', projectName: '', datasetName: '' });
        setFile(null);
      } else {
        alert('Upload failed!');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading dataset');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Data</h1>
        <p className="text-gray-600">Upload datasets with location details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dataset Upload</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <label className="cursor-pointer text-sky-600 hover:text-sky-500 font-medium">
                {file ? file.name : 'Click to upload dataset'}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".csv,.xlsx,.json,.txt"
                />
              </label>
              {file && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <Input
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
              <Input
                label="Dataset Name"
                name="datasetName"
                value={formData.datasetName}
                onChange={handleInputChange}
                placeholder="Enter dataset name"
                required
              />
              <Input
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="e.g., 19.0760"
                required
              />
              <Input
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="e.g., 72.8777"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isUploading || !file}>
            {isUploading ? 'Uploading...' : 'Upload Dataset'}
          </Button>
        </div>
      </form>
    </div>
  );
};
