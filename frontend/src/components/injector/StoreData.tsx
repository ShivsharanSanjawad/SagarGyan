import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import { Upload, FileText, X, Database, MapPin, Cloud, Terminal } from "lucide-react";

/* Utility helpers */
const formatBytes = (bytes: number) =>
  bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const extBadge = (name: string) => {
  const ext = (name.split(".").pop() || "").toLowerCase();
  const color =
    ext === "csv" || ext === "xlsx" ? "bg-sky-50 text-sky-700" :
    ext === "nc" ? "bg-purple-50 text-purple-700" :
    ext === "json" ? "bg-slate-50 text-slate-700" :
    ext === "zip" || ext === "gz" ? "bg-amber-50 text-amber-700" :
    "bg-slate-50 text-slate-700";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color} border border-slate-100`}>.{ext}</span>;
};

export const StoreData: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    datasetName: "",
    latitude: "",
    longitude: "",
    dataFormat: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [activeUploadMethod, setActiveUploadMethod] = useState<'direct' | 'api' | 'cloud'>('direct');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const existingKey = (f: File) => `${f.name}|${f.size}`;
    const existingSet = new Set(files.map(existingKey));
    const unique = arr.filter((f) => !existingSet.has(existingKey(f)));
    if (unique.length) setFiles((p) => [...p, ...unique].slice(0, 20));
  }, [files]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragActive) setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if ((e.target as HTMLElement).getAttribute("data-dropzone") === "true") setDragActive(false);
  };

  const removeFile = (idx: number) => setFiles((p) => p.filter((_, i) => i !== idx));
  const resetForm = () => {
    setFormData({ projectName: "", datasetName: "", latitude: "", longitude: "", dataFormat: "" });
    setFiles([]);
    setUploadProgress(0);
    setUploadMessage(null);
  };

  const simulateUpload = async (endpoint: string, body: FormData) => {
    setIsUploading(true);
    setUploadMessage(null);
    setUploadProgress(2);
    await new Promise((r) => setTimeout(r, 200));
    for (let p of [8, 16, 26, 38, 52, 66, 78, 88, 94, 98]) {
      setUploadProgress(p);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 140 + Math.random() * 120));
    }

    try {
      await fetch(endpoint, { method: "POST", body });
      setUploadProgress(100);
      setUploadMessage("Upload complete. Files queued for processing.");
    } catch {
      setUploadProgress(100);
      setUploadMessage("Upload finished locally, but server request failed. Check network.");
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeUploadMethod !== 'direct') return; // Only allow upload for direct method
    if (!files.length) return setUploadMessage("Please attach at least one file.");

    let endpoint = "http://localhost:3000/api/ingestdata";
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

    const form = new FormData();
    form.append("projectName", formData.projectName);
    form.append("datasetName", formData.datasetName);
    form.append("latitude", formData.latitude);
    form.append("longitude", formData.longitude);
    form.append("dataFormat", formData.dataFormat);
    files.forEach((f) => form.append("files", f));

    await simulateUpload(endpoint, form);
    if (uploadMessage?.includes("Upload complete")) setTimeout(resetForm, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fdf2df]">
      {/* Cream header band like RetrieveData/AdminDashboard */}
      <section className="py-6 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Oceanographic Data Storage</h1>
              <p className="text-slate-600 mt-1">Upload your datasets. Supported: CSV, XLSX, NETCDF, JSON, TXT, ZIP/GZ.</p>
            </div>
            <div className="hidden md:block">
              {/* Optional right-side CTA kept subtle to match RetrieveData layout */}
              <Button
                type="button"
                className="bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg shadow-sm hover:shadow-md"
                onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
              >
                Upload Dataset
              </Button>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Upload className="h-5 w-5 text-sky-600" />
                  Dataset Upload
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Upload Method Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveUploadMethod('direct')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                      activeUploadMethod === 'direct'
                        ? 'text-sky-600 border-b-2 border-sky-600 bg-white'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Direct Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveUploadMethod('api')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                      activeUploadMethod === 'api'
                        ? 'text-sky-600 border-b-2 border-sky-600 bg-white'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Fetch from API
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveUploadMethod('cloud')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                      activeUploadMethod === 'cloud'
                        ? 'text-sky-600 border-b-2 border-sky-600 bg-white'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Fetch from Cloud Storage
                  </button>
                </div>

                {/* Direct Upload Content */}
                {activeUploadMethod === 'direct' && (
                  <div>
                    <div
                      data-dropzone="true"
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      className={`rounded-xl border-2 p-10 text-center transition-all duration-150 ${
                        dragActive ? "border-sky-400 bg-sky-50/40 shadow-inner" : "border-dashed border-slate-200 bg-white"
                      }`}
                      role="region"
                      aria-label="File dropzone"
                    >
                      <div className="mx-auto max-w-xl">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${dragActive ? "bg-sky-600 text-white" : "bg-slate-50 text-sky-600"} shadow-sm`}>
                          <Upload className="h-5 w-5" />
                        </div>

                        <p className="text-lg font-semibold text-slate-900 mb-1">
                          {dragActive ? "Release to upload files" : "Drop files here or click to browse"}
                        </p>
                        <p className="text-sm text-slate-500 mb-4">Support for multiple file formats and bulk uploads</p>

                        <div className="flex items-center justify-center gap-3">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              onChange={onFileInputChange}
                              className="sr-only"
                              accept=".csv,.xlsx,.nc,.json,.txt,.zip,.gz"
                            />
                            <Button type="button" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow">
                              <Upload className="h-4 w-4" />
                              Select files
                            </Button>
                          </label>

                          <button
                            type="button"
                            onClick={() => setFiles([])}
                            disabled={!files.length || isUploading}
                            className="px-3 py-2 text-sm rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                          >
                            Clear
                          </button>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                          {[".csv", ".xlsx", ".nc", ".json", ".txt", ".zip"].map((e) => (
                            <span key={e} className="px-3 py-1 text-xs rounded-full bg-slate-50 text-sky-700 border border-slate-100">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-slate-800 mb-3">Files ({files.length})</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {files.map((f, i) => (
                            <div key={`${f.name}-${f.size}-${i}`} className="flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-lg p-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-md bg-sky-600 flex items-center justify-center text-white">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-slate-900 truncate">{f.name}</div>
                                  <div className="text-xs text-slate-500">{formatBytes(f.size)}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {extBadge(f.name)}
                                <button
                                  type="button"
                                  onClick={() => removeFile(i)}
                                  className="p-1 rounded-full text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                                  disabled={isUploading}
                                  aria-label={`Remove ${f.name}`}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* API Upload Content */}
                {activeUploadMethod === 'api' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-slate-100 rounded-lg">
                          <Terminal className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">Programmatic Data Ingestion</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Use our REST API to push or pull data directly from your applications.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint</label>
                        <Input 
                          value="https://api.oceandata.example/v1/ingest" 
                          readOnly 
                          className="font-mono text-sm bg-slate-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Authentication</label>
                        <Input 
                          value="Bearer YOUR_API_KEY" 
                          readOnly 
                          className="font-mono text-sm bg-slate-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Example Request</label>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
                          {`curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectName": "OceanTempStudy",
    "datasetName": "TemperatureReadings",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "data": [...]
  }' \\
  https://api.oceandata.example/v1/ingest`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        View API Documentation
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cloud Storage Content */}
                {activeUploadMethod === 'cloud' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-slate-100 rounded-lg">
                          <Cloud className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">Cloud Storage Integration</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Connect your AWS S3, Google Cloud Storage, or Azure Blob Storage buckets.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Card className="border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-blue-600">
                              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2v2h-2v-2zm0-4h2v2h-2V8z"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-slate-900">AWS S3</h4>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-red-600">
                              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2v2h-2v-2zm0-4h2v2h-2V8z"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-slate-900">Google Cloud</h4>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-blue-600">
                              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2v2h-2v-2zm0-4h2v2h-2V8z"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-slate-900">Azure Blob</h4>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Storage URI</label>
                        <Input 
                          placeholder="s3://bucket-name/path/to/data" 
                          className="font-mono text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Access Key ID</label>
                          <Input 
                            placeholder="AKIAIOSFODNN7EXAMPLE" 
                            className="font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Secret Access Key</label>
                          <Input 
                            type="password"
                            placeholder="••••••••••••••••••••" 
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Connect Storage
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  {isUploading ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-slate-700 font-medium">Uploading...</div>
                        <div className="text-sm text-slate-800 font-semibold">{uploadProgress}%</div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div className="h-3 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </>
                  ) : uploadMessage ? (
                    <div className="text-sm text-slate-700 py-2">{uploadMessage}</div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Database className="h-5 w-5 text-sky-600" />
                  Dataset Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm text-slate-700 mb-1">Project Name</label>
                <Input name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="Enter project name" required className="mb-3 h-10" />

                <label className="block text-sm text-slate-700 mb-1">Dataset Name</label>
                <Input name="datasetName" value={formData.datasetName} onChange={handleInputChange} placeholder="Enter dataset name" required className="mb-3 h-10" />
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  Geographic Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm text-slate-700 mb-1">Latitude</label>
                <Input name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g. 19.0760" required className="mb-3 h-10" />

                <label className="block text-sm text-slate-700 mb-1">Longitude</label>
                <Input name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g. 72.8777" required className="mb-3 h-10" />
              </CardContent>
            </Card>

            <div>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading || (activeUploadMethod === 'direct' && !files.length)}
                className="w-full h-14 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Upload className="h-5 w-5" />
                    {activeUploadMethod === 'direct' ? 'Upload Dataset' : 'Submit Request'}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};