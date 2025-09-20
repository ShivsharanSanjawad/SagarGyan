import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { CustomInput } from '../ui/CustomInput';
import { Microscope, Upload, Search, FileText, FolderOutput } from 'lucide-react';
import { mockSpecies } from '../../data/mockData';

export const Classification: React.FC = () => {
  const [activeModule, setActiveModule] = useState('edna');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const classificationResults = [
    { id: 1, sample: 'Sample_001', species: 'Rastrelliger kanagurta', confidence: 95.2, method: 'eDNA' },
    { id: 2, sample: 'Sample_002', species: 'Chelonia mydas', confidence: 87.8, method: 'Morphology' },
    { id: 3, sample: 'Sample_003', species: 'Acropora cervicornis', confidence: 92.1, method: 'Taxonomy' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Classification Module</h1>
        <p className="text-gray-600">Identify and classify marine species using advanced techniques</p>
      </div>

      {/* Module Selector */}
      <CardContent className="p-2">
        <div className="flex w-full">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${
              activeModule === 'edna'
                ? 'border-sky-500 text-sky-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-sky-500'
            }`}
            onClick={() => setActiveModule('edna')}
          >
            eDNA Analysis
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${
              activeModule === 'taxonomy'
                ? 'border-sky-500 text-sky-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-sky-500'
            }`}
            onClick={() => setActiveModule('taxonomy')}
          >
            Taxonomy
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${
              activeModule === 'otolith'
                ? 'border-sky-500 text-sky-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-sky-500'
            }`}
            onClick={() => setActiveModule('otolith')}
          >
            Otolith Analysis
          </Button>
        </div>
      </CardContent>

      {/* eDNA Module */}
      {activeModule === 'edna' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>eDNA Sample Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-sky-600 hover:text-sky-500">
                      Upload DNA Sequence Files
                    </span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="sr-only"
                      accept=".fasta,.fa,.seq,.txt"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    NetCDF, HDFS, DwCA, XML formats supported
                  </p>
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center space-x-2 text-sm bg-green-50 p-3 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">{uploadedFile.name}</span>
                </div>
              )}

              <Button className="w-full bg-blue-800 text-white " disabled={!uploadedFile}>
                <Microscope className="h-4 w-4 mr-2" />
                Analyze eDNA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classificationResults
                  .filter(result => result.method === 'eDNA')
                  .map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{result.sample}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.confidence >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : result.confidence >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Species:</strong> <em>{result.species}</em>
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" className="transition-all duration-200 ease-in-out border hover:bg-slate-400 active:scale-95">
                         <FolderOutput className="h-4 w-4 mr-2" />Export</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Taxonomy Module */}
      {activeModule === 'taxonomy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Species Database Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <CustomInput
                    placeholder="Search species by name or characteristics..."
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockSpecies.map((species) => (
                    <div key={species.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-semibold">{species.name}</h3>
                      <p className="text-sm text-gray-600 italic">{species.scientificName}</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <p><strong>Classification:</strong> {species.classification}</p>
                        <p><strong>Habitat:</strong> {species.habitat}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-0.5 rounded ${
                            species.status === 'Stable' ? 'bg-green-100 text-green-800' :
                            species.status === 'Endangered' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {species.status}
                          </span>
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="mt-3">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Otolith Module */}
      {activeModule === 'otolith' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Otolith Image Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-sky-600 hover:text-sky-500">
                      Upload Otolith Images
                    </span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.tiff"
                      multiple
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, TIFF formats supported
                  </p>
                </div>
              </div>
                     
            <Button className="w-full">
                <Microscope className="h-4 w-4 mr-2" />
                Analyze Otolith
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Morphometric Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Microscope className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Upload otolith images to begin analysis</p>
                
                <div className="space-y-3 text-sm text-left">
                  <div className="flex justify-between">
                    <span>Length:</span>
                    <span className="font-mono">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Width:</span>
                    <span className="font-mono">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Circularity:</span>
                    <span className="font-mono">-</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};