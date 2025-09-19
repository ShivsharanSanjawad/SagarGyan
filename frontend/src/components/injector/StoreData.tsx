import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Upload, FileText } from "lucide-react";

export const StoreData: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    datasetName: "",
    latitude: "",
    longitude: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          alert("Data uploaded successfully!");
          setFormData({
            projectName: "",
            datasetName: "",
            latitude: "",
            longitude: "",
          });
          setFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Actual upload call
    const form = new FormData();
    form.append("projectName", formData.projectName);
    form.append("datasetName", formData.datasetName);
    form.append("latitude", formData.latitude);
    form.append("longitude", formData.longitude);
    files.forEach((file) => form.append("files", file));

    await fetch("http://localhost:3000/api/ingestdata", {
      method: "POST",
      body: form,
    });
  };

  return (
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Retrieve Data</h1>
        <p className="text-gray-600">Search and access oceanographic datasets</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-4xl mx-auto w-full">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-sky-50 rounded-t-lg border-b">
            <CardTitle className="text-sky-700">Upload Dataset</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* File Upload & Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-sky-500 transition cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <label className="text-sm font-medium text-sky-600 hover:underline cursor-pointer">
                  Click to upload dataset
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                    accept=".csv,.xlsx,.nc,.json,.txt,.zip,.gz"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  CSV, Excel, NetCDF, JSON, TXT (Max: 500MB)
                </p>
              </div>

              {/* User Inputs */}
              <div className="space-y-4">
                <Input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter Project Name"
                  required
                />
                <Input
                  name="datasetName"
                  value={formData.datasetName}
                  onChange={handleInputChange}
                  placeholder="Enter Dataset Name"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Latitude"
                    required
                  />
                  <Input
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Longitude"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-700">Selected Files:</h4>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            {isUploading && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-sky-700 font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isUploading || files.length === 0}
                className="px-6 py-2"
              >
                {isUploading ? "Uploading..." : "Upload Dataset"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
