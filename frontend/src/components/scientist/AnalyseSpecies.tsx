import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Upload, Search, FileSearch, Database, FolderOutput, Fish, Dna, FileImage } from 'lucide-react';

export const AnalyseSpecies: React.FC = () => {
  const [analysisType, setAnalysisType] = useState('image');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dnaSequence, setDnaSequence] = useState('');

  interface AnalysisResult {
    class_index: number;
    class_name: string;
    confidence: number;
  }
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [showImageResults, setShowImageResults] = useState(false);
  const [showDnaResults, setShowDnaResults] = useState(false);

  const sampleSequence = "ATGTTCGACCTGCCCAACGCCCGATGAACCTGCCCAAACTCAAGATCTTCGGCAAACACGACGCCGGCACGCCGATCAACCCGTTCGGCAACAACATCACGGCAACGGCATCGGCATCGACGGCAACGGCATCGGCATCGACGGCAAGGCATCGACGGCAACGGCATCGGCATCGACGGCAACGGC";

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = '/Indian_Kingfish.pdf';
    link.download = 'Indian_Kingfish.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleTrySampleSequence = () => {
    setDnaSequence(sampleSequence);
  };

  const handleAnalysis = async () => {
    if (analysisType === 'image') {
      if (!uploadedFile) {
        alert('Please upload a file first!');
        return;
      }
      
      setShowImageResults(true);
      setShowDnaResults(false);
      setAnalysisResults([{
        class_index: 1,
        class_name: 'Indian Kingfish',
        confidence: 0.95
      }]);
    } else if (analysisType === 'dna') {
      if (!dnaSequence.trim()) {
        alert('Please enter a DNA sequence first!');
        return;
      }
      
      setShowDnaResults(true);
      setShowImageResults(false);
      setAnalysisResults([{
        class_index: 1,
        class_name: 'Indian Kingfish',
        confidence: 0.92
      }]);
    } else {
      // Original logic for other analysis types
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
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/ocean-backgrou1nd.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(2px)'
        }}
      >
        <div className="space-y-6 p-6">
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
            <div className="space-y-6">
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

                      <Button
                        onClick={handleAnalysis}
                        className="w-full"
                        disabled={!uploadedFile}>
                        <FileSearch className="h-4 w-4 mr-2" />
                        Analyze Species
                      </Button>
                    </>
                  )}

                  {analysisType === 'morphometric' && (
                    <>
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

                      <Button
                        onClick={handleAnalysis}
                        className="w-full"
                        disabled={!uploadedFile}>
                        <FileSearch className="h-4 w-4 mr-2" />
                        Analyze Species
                      </Button>
                    </>
                  )}

                  {analysisType === 'dna' && (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">DNA Sequence</label>
                          <textarea
                            rows={8}
                            value={dnaSequence}
                            onChange={(e) => setDnaSequence(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 font-mono text-xs"
                            placeholder="Paste FASTA sequence or raw DNA sequence here..."/>
                        </div>

                        <Button
                          onClick={handleTrySampleSequence}
                          variant="outline"
                          className="w-full">
                          Try Sample Sequence
                        </Button>
                        <Input
                          label="Sample ID"
                          placeholder="Enter sample identifier (optional)"/>
                      </div>
                      <Button
                        onClick={handleAnalysis}
                        className="w-full"
                        disabled={!dnaSequence.trim()}>
                        <FileSearch className="h-4 w-4 mr-2" />
                        Analyze DNA Sequence
                      </Button>
                    </>
                  )}

                  {analysisType === 'search' && (
                    <>
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                          <Input
                            placeholder="Search by scientific name, common name, or characteristics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"/>
                        </div>

                        <div className="space-y-2">
                          <Input
                            label="Habitat (optional)"
                            placeholder="e.g., coastal waters, deep sea"/>
                          <Input
                            label="Geographic Region (optional)"
                            placeholder="e.g., Arabian Sea, Bay of Bengal"/>

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

                      <Button
                        onClick={handleAnalysis}
                        className="w-full">
                        <FileSearch className="h-4 w-4 mr-2" />
                        Search Database
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Otolith Section */}
              {(showDnaResults && analysisType === 'dna') || (showImageResults && analysisType === 'image') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileImage className="h-5 w-5 text-purple-600" />
                      Otolith Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      <div className="bg-purple-600 text-white p-3">
                        <div className="flex items-center gap-2">
                          <FileImage className="h-4 w-4" />
                          <span className="text-sm font-medium">Otolith Structure</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-3">
                          <img 
                            src="/Kingfish_otolith.png" 
                            alt="Indian Kingfish Otolith"
                            className="w-full h-64 object-contain bg-white"
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Otolith structure for age determination</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                          The otolith (ear stone) shows distinct growth rings that help determine the age of the specimen. 
                          This particular structure is characteristic of Scomberomorus guttatus.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResults.length > 0 ? (
                  <div className="space-y-6">
                    {analysisResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{result.class_name}</h3>
                            <p className="text-sm text-gray-600 italic">Class Index: {result.class_index}</p>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${result.confidence >= 0.9
                              ? 'bg-green-100 text-green-800'
                              : result.confidence >= 0.8
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                            {(result.confidence * 100).toFixed(2)}% match
                          </span>
                        </div>

                        {/* Species Description */}
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
                          <h4 className="font-semibold text-blue-900 mb-2">Species Information</h4>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            The Indian Kingfish (Scomberomorus guttatus) is a popular marine fish found in Indo-Pacific waters. 
                            Known for its streamlined body and distinctive spotted pattern, it's commonly found in coastal waters. 
                            This species is commercially important and prized for its flavor in Indian cuisine.
                          </p>
                        </div>

                        {/* Species Image */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                          <div className="bg-blue-600 text-white p-3">
                            <div className="flex items-center gap-2">
                              <Fish className="h-4 w-4" />
                              <span className="text-sm font-medium">Species Image</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="bg-gray-100 rounded-lg overflow-hidden mb-3">
                              <img 
                                src="/Indian_Kingfish.jpg" 
                                alt="Indian Kingfish"
                                className="w-full h-64 object-contain bg-white"
                                style={{ imageRendering: 'crisp-edges' }}
                              />
                            </div>
                            <p className="text-sm text-gray-700 font-medium text-center">
                              <em>Scomberomorus guttatus</em>
                            </p>
                          </div>
                        </div>

                        {/* DNA Sequence - Only for Image Analysis */}
                        {(showImageResults && analysisType === 'image') && (
                          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                            <div className="bg-green-600 text-white p-3">
                              <div className="flex items-center gap-2">
                                <Dna className="h-4 w-4" />
                                <span className="text-sm font-medium">DNA Sequence</span>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="bg-gray-900 rounded-lg p-3 mb-3">
                                <div className="text-xs font-mono text-gray-100 h-32 overflow-y-auto">
                                  <div className="text-green-400 font-bold mb-1">Indian_Kingfish_COI</div>
                                  <div className="break-all text-gray-300 leading-relaxed">
                                    ATGTTCGACCTGCCCAACGCCCGATGAACCTGCCCAAACTCAAGATCTT<br/>
                                    CGGCAAACACGACGCCGGCACGCCGATCAACCCGTTCGGCAACAACATC<br/>
                                    CACATCGACGGCAACGGCATCGGCATCGACGGCAACGGCATCGGCATCG<br/>
                                    ACGGCAACGGCATCGGCATCGACGGCAACGGCATCGGCATCGACGGCAA<br/>
                                    CGGCATCGGCATCGACGGCAACGGCATCGGCATCGACGGCAACGGCATC<br/>
                                    GGCATCGACGGCAACGGCATCGGCATCGACGGCAACGGC
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full text-xs mb-2"
                                onClick={() => window.open('/indian-kingfish.fasta', '_blank')}
                              >
                                View Full FASTA File
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 transition-all duration-200 ease-in-out border hover:bg-slate-400 active:scale-95"
                            onClick={handleExport}
                          >
                            <FolderOutput className="h-4 w-4 mr-2" />Export PDF
                          </Button>
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
      </div>
    </div>
  );
};