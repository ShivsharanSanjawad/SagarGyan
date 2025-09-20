import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Upload, Search, FileSearch, Database, FolderOutput} from 'lucide-react';

export const AnalyseSpecies: React.FC = () => {
  const [analysisType, setAnalysisType] = useState('image');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  interface AnalysisResult {
    class_index: number;
    class_name: string;
    confidence: number;
  }
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAnalysis = async () => {
    if (!uploadedFile) {
      alert('Please upload a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch('http://localhost:8000/taxonomyImage', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Analysis results:', data);

      // Wrap single object in array so map() works
      setAnalysisResults([data]);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze image');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analyse Species</h1>
        <p className="text-gray-600">Identify marine species using advanced AI analysis</p>
      </div>

      {/* Analysis Type Selector */}
      <CardContent className="p-0 pb-2">
        <div className="flex w-full">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${analysisType === 'image'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
            onClick={() => setAnalysisType('image')}>
            Image Analysis
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${analysisType === 'morphometric'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
            onClick={() => setAnalysisType('morphometric')}
          >
            Morphometric Data
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${analysisType === 'dna'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
            onClick={() => setAnalysisType('dna')}
          >
            DNA Sequence
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 ${analysisType === 'search'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
            onClick={() => setAnalysisType('search')}
          >
            Database Search
          </Button>
        </div>
      </CardContent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              {analysisType === 'image' && 'Upload Species Image'}
              {analysisType === 'morphometric' && 'Enter Morphometric Data'}
              {analysisType === 'dna' && 'DNA Sequence Analysis'}
              {analysisType === 'search' && 'Species Database Search'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisType === 'image' && (
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-sm font-medium text-sky-600 hover:text-sky-500">
                        Upload fish/marine species image
                      </span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="sr-only"
                        accept=".jpg,.jpeg,.png,.tiff"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG, TIFF up to 10MB
                    </p>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    ✓ {uploadedFile.name} uploaded successfully
                  </div>
                )}

                <div className="space-y-2">
                  <Input
                    label="Location (optional)"
                    placeholder="Where was this specimen found?"
                  />
                  <Input
                    label="Estimated size (cm)"
                    type="number"
                    placeholder="Length in centimeters"
                  />
                </div>
              </>
            )}

            {analysisType === 'morphometric' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Total Length (cm)" type="number" />
                  <Input label="Standard Length (cm)" type="number" />
                  <Input label="Body Height (cm)" type="number" />
                  <Input label="Head Length (cm)" type="number" />
                  <Input label="Eye Diameter (cm)" type="number" />
                  <Input label="Weight (g)" type="number" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Shape</label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500">
                    <option>Select body shape</option>
                    <option>Streamlined (fusiform)</option>
                    <option>Compressed laterally</option>
                    <option>Depressed (flattened)</option>
                    <option>Elongated (eel-like)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin Configuration</label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    placeholder="Describe fin types and positions..."
                  />
                </div>
              </div>
            )}

            {analysisType === 'dna' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNA Sequence</label>
                  <textarea
                    rows={8}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 font-mono text-xs"
                    placeholder="Paste FASTA sequence or raw DNA sequence here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sequence Type</label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500">
                    <option>COI (Cytochrome Oxidase I)</option>
                    <option>16S rRNA</option>
                    <option>18S rRNA</option>
                    <option>ITS (Internal Transcribed Spacer)</option>
                    <option>Other</option>
                  </select>
                </div>

                <Input
                  label="Sample ID"
                  placeholder="Enter sample identifier"
                />
              </div>
            )}

            {analysisType === 'search' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by scientific name, common name, or characteristics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    label="Habitat (optional)"
                    placeholder="e.g., coastal waters, deep sea"
                  />
                  <Input
                    label="Geographic Region (optional)"
                    placeholder="e.g., Arabian Sea, Bay of Bengal"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                    <select className="block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500">
                      <option>All</option>
                      <option>Fish</option>
                      <option>Crustacean</option>
                      <option>Mollusk</option>
                      <option>Coral</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleAnalysis}
              className="w-full"
              disabled={analysisType === 'image' && !uploadedFile}
            >
              <FileSearch className="h-4 w-4 mr-2" />
              {analysisType === 'search' ? 'Search Database' : 'Analyze Species'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResults.length > 0 ? (
              <div className="space-y-4">
                {analysisResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold">{result.class_name}</h3>
                        <p className="text-sm text-gray-600 italic">Class Index: {result.class_index}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${result.confidence >= 0.9
                          ? 'bg-green-100 text-green-800'
                          : result.confidence >= 0.8
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                        {(result.confidence * 100).toFixed(2)}% match
                      </span>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" className="transition-all duration-200 ease-in-out border hover:bg-slate-400 active:scale-95">
                        <FolderOutput className="h-4 w-4 mr-2" />Export</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload data or start analysis to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Species Database Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Species Database Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">1,487</p>
              <p className="text-sm text-blue-800">Total Species</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">878</p>
              <p className="text-sm text-green-800">Fish Species</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">492</p>
              <p className="text-sm text-purple-800">Invertebrates</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">329</p>
              <p className="text-sm text-amber-800">Other Taxa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};