import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Upload, FileText, X, Database, MapPin } from "lucide-react";

export const StoreData: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    datasetName: "",
    latitude: "",
    longitude: "",
    dataFormat: "",
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

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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
            dataFormat: "",
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
    form.append("dataFormat", formData.dataFormat);
    files.forEach((file) => form.append("files", file));

    let endpoint = "http://localhost:3000/api/ingestdata";
    if (files.length > 0) {
      const ext = files[0].name.split(".").pop()?.toLowerCase();
      switch (ext) {
        case "csv":
        case "xlsx":
          endpoint = "http://localhost:3000/api/ingestcsv";
          break;
        case "zip":
        case "gz":
          endpoint = "http://localhost:3000/api/ingestdwca";
          break;
        case "json":
          endpoint = "http://localhost:3000/api/ingestjson";
          break;
        case "nc":
          endpoint = "http://localhost:3000/api/ingestnetcdf";
          break;
        case "txt":
          endpoint = "http://localhost:3000/api/ingesttxt";
          break;
        default:
          endpoint = "http://localhost:3000/api/ingestdata";
      }
    }

    await fetch(endpoint, {
      method: "POST",
      body: form,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg">
            <Database className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Oceanographic Data Storage</h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Upload and store your marine research datasets in our secure cloud infrastructure
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* File Upload Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r text-cyan-600 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Dataset Upload</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Upload Area */}
                <div className="relative group">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-12 hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100">
                    <div className="bg-white rounded-full p-4 shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <label className="cursor-pointer text-center">
                      <span className="text-xl font-semibold text-blue-700 hover:text-blue-800 block mb-2">
                        Drop files here or click to browse
                      </span>
                      <span className="text-sm text-slate-500 block mb-4">
                        Support for multiple file formats
                      </span>
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Select Files
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".csv,.xlsx,.nc,.json,.txt,.zip,.gz,.png"
                      />
                    </label>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                      {['.csv', '.xlsx', '.nc', '.json', '.txt', '.zip'].map((ext) => (
                        <span key={ext} className="px-3 py-1 bg-white/70 text-blue-600 text-xs rounded-full border border-blue-200">
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      Selected Files ({files.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 group hover:bg-blue-100 transition-colors duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700">{file.name}</span>
                              <span className="text-xs text-slate-500 block">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress */}
                {isUploading && (
                  <div className="mt-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">Uploading Dataset...</span>
                      <span className="text-blue-700 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metadata Section */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r text-cyan-600 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Dataset Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 space-y-2">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                  <Input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                    className="h-10 bg-white/90 backdrop-blur-sm border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dataset Name</label>
                  <Input
                    name="datasetName"
                    value={formData.datasetName}
                    onChange={handleInputChange}
                    placeholder="Enter dataset name"
                    required
                    className="h-10 bg-white/90 backdrop-blur-sm border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r text-cyan-600 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Geographic Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Latitude</label>
                    <Input
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="e.g. 19.0760"
                      required
                      className="h-12 bg-white/90 backdrop-blur-sm border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Longitude</label>
                    <Input
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="e.g. 72.8777"
                      required
                      className="h-12 bg-white/90 backdrop-blur-sm border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isUploading || files.length === 0}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Dataset</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};