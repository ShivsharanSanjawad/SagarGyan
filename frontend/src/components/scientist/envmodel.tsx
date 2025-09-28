import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { Brain, BarChart3, Map, Database, File, Cloud } from "lucide-react";
import "leaflet/dist/leaflet.css";

const algorithms = [
  "GLM",
  "GAM", 
  "RF",
  "MaxEnt",
  "BRT",
  "SVM",
  "NN",
  "VAST",
  "GJAM",
];

const speciesList = [
  "Sardinella longiceps",
  "Alectis indica",
  "Indian Mackerel",
  "Rastrelliger kanagurta",
  "Thunnus albacares",
  "Caranx ignobilis",
];

const oceanProbabilityPoints = [
  // Arabian Sea
  { lat: 18.5, lng: 67.2, prob: 0.95 },
  { lat: 20.1, lng: 63.8, prob: 0.88 },
  { lat: 15.7, lng: 70.5, prob: 0.92 },
  { lat: 12.3, lng: 69.1, prob: 0.78 },
  { lat: 22.8, lng: 64.3, prob: 0.65 },
  { lat: 25.2, lng: 66.7, prob: 0.58 },
  { lat: 8.9, lng: 71.2, prob: 0.82 },
  
  // Bay of Bengal
  { lat: 18.2, lng: 87.5, prob: 0.89 },
  { lat: 15.8, lng: 85.3, prob: 0.76 },
  { lat: 21.3, lng: 88.9, prob: 0.93 },
  { lat: 13.1, lng: 83.7, prob: 0.71 },
  { lat: 19.7, lng: 86.4, prob: 0.84 },
  { lat: 11.5, lng: 82.1, prob: 0.69 },
  { lat: 16.9, lng: 89.2, prob: 0.87 },
  
  // Indian Ocean
  { lat: 6.2, lng: 75.8, prob: 0.74 },
  { lat: 4.1, lng: 78.3, prob: 0.81 },
  { lat: 2.8, lng: 80.9, prob: 0.66 },
  { lat: 0.5, lng: 77.4, prob: 0.72 },
  { lat: -1.2, lng: 82.1, prob: 0.79 },
];

// Ocean-focused count points
const oceanCountPoints = [
  // Arabian Sea
  { lat: 18.5, lng: 65.2, count: 125000 },
  { lat: 20.1, lng: 63.8, count: 98000 },
  { lat: 15.7, lng: 67.5, count: 87000 },
  { lat: 12.3, lng: 69.1, count: 76000 },
  { lat: 22.8, lng: 64.3, count: 54000 },
  
  // Bay of Bengal
  { lat: 18.2, lng: 87.5, count: 142000 },
  { lat: 21.3, lng: 88.9, count: 156000 },
  { lat: 15.8, lng: 85.3, count: 89000 },
  { lat: 19.7, lng: 86.4, count: 134000 },
  
  // Indian Ocean
  { lat: 6.2, lng: 75.8, count: 67000 },
  { lat: 4.1, lng: 78.3, count: 92000 },
  { lat: 2.8, lng: 80.9, count: 58000 },
];

const EnvModel: React.FC = () => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCurves, setShowCurves] = useState(false);
  const [curveType, setCurveType] = useState("roc");
  const [selectedSpecies, setSelectedSpecies] = useState(speciesList[0]);
  const [uploadMethod, setUploadMethod] = useState("file");

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowCurves(true);
            setIsTraining(false);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isTraining]);

  return (
    <div>
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(2px)'
        }}
      >
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              Environment Model
            </h1>
            <p className="text-gray-600 mt-1">Train machine learning models to predict marine species distribution</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r text-black">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Model Training & Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Select Data Source
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      uploadMethod === 'file' 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setUploadMethod('file')}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        uploadMethod === 'file' 
                          ? 'border-sky-500 bg-sky-500' 
                          : 'border-gray-300'
                      }`}>
                        {uploadMethod === 'file' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                      <File className="h-5 w-5 text-sky-600" />
                      <span className="font-semibold text-gray-700">Upload File</span>
                    </div>
                    {uploadMethod === 'file' && (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-sky-300 rounded-lg p-4 bg-white">
                          <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Supports CSV, Excel files up to 50MB</p>
                      </div>
                    )}
                  </div>

                  {/* Database Option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      uploadMethod === 'database' 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setUploadMethod('database')}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        uploadMethod === 'database' 
                          ? 'border-sky-500 bg-sky-500' 
                          : 'border-gray-300'
                      }`}>
                        {uploadMethod === 'database' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                      <Cloud className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-gray-700">Select from Database</span>
                    </div>
                    {uploadMethod === 'database' && (
                      <div className="space-y-3">
                        <Select>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Choose dataset from database" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dataset1">Marine Species Dataset 2024</SelectItem>
                            <SelectItem value="dataset2">Coastal Ecosystem Data</SelectItem>
                            <SelectItem value="dataset3">Fisheries Survey Results</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Access pre-loaded datasets from our database</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Select Machine Learning Algorithms ({selectedAlgorithms.length} selected)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {algorithms.map((algo) => (
                    <div 
                      key={algo} 
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedAlgorithms.includes(algo)
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (selectedAlgorithms.includes(algo)) {
                          setSelectedAlgorithms((prev) => prev.filter((a) => a !== algo));
                        } else {
                          setSelectedAlgorithms((prev) => [...prev, algo]);
                        }
                      }}>
                      <Checkbox
                        id={algo}
                        checked={selectedAlgorithms.includes(algo)}
                        readOnly
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"/>
                      <label htmlFor={algo} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                        {algo}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedAlgorithms.length === 0 && (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    Please select at least one algorithm to proceed with training.
                  </p>
                )}
              </div>

              {/* Train Button */}
              <Button 
                onClick={() => setIsTraining(true)} 
                disabled={isTraining || selectedAlgorithms.length === 0}
                className="w-full py-3 text-gray-800 font-semibold bg-gradient-to-r from-sky-600 to-blue-400 hover:from-sky-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50">
                {isTraining ? "Training Models..." : "Start Training"}
              </Button>

              {/* Loading Progress */}
              {isTraining && (
                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <Progress value={progress} className="w-full h-3 mb-3" />
                  <p className="text-sm font-medium text-blue-800">Training Progress: {progress}%</p>
                  <p className="text-xs text-blue-600">Training {selectedAlgorithms.join(', ')} algorithms...</p>
                </div>
              )}

              {/* ROC / AUC curves */}
              {showCurves && (
                <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Model Performance Curves
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">Select Curve Type:</label>
                    <Select value={curveType} onValueChange={setCurveType}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select Curve" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roc">ROC Curve</SelectItem>
                        <SelectItem value="auc">AUC Curve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-center bg-white px-4 rounded-lg">
                    <img
                      src={curveType === "roc" ? "/roc1.jpeg" : "/roc2.jpeg"}
                      alt={`${curveType.toUpperCase()} curve`}
                      className="max-w-lg w-full border rounded-lg shadow-sm"/>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Species Prediction Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r text-black">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Species Distribution Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              {/* Species selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Target Species</label>
                <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                  <SelectTrigger className="w-full max-w-md bg-white">
                    <SelectValue placeholder="Select Species" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesList.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Maps */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Probability Map - Ocean focused with gradient visualization */}
                <Card className="shadow-md">
                  <CardHeader className="bg-blue-50 border-b">
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Probability Map of {selectedSpecies}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MapContainer
                      center={[10, 75]}
                      zoom={4}
                      className="h-[400px] w-full rounded-lg z-0 shadow-sm"
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                      />
                      {oceanProbabilityPoints.map((p, idx) => {
                        const size = 8 + (p.prob * 25);
                        const opacity = 0.3 + (p.prob * 0.5);
                        return (
                          <CircleMarker
                            key={idx}
                            center={[p.lat, p.lng]}
                            radius={size}
                            fillOpacity={opacity}
                            fillColor={`hsl(${210 + p.prob * 30}, 85%, ${45 + p.prob * 25}%)`}
                            stroke={false}
                          >
                            <Tooltip>
                              <div className="text-center">
                                <div className="font-semibold">Probability: {(p.prob * 100).toFixed(1)}%</div>
                                <div className="text-xs text-gray-600">Ocean Location</div>
                              </div>
                            </Tooltip>
                          </CircleMarker>
                        );
                      })}
                    </MapContainer>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>Low Probability</span>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-3 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 rounded"></div>
                      </div>
                      <span>High Probability</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Count Map - Ocean focused */}
                <Card className="shadow-md">
                  <CardHeader className="bg-red-50 border-b">
                    <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Population Count of {selectedSpecies}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MapContainer
                      center={[10, 75]}
                      zoom={4}
                      className="h-[400px] w-full rounded-lg z-0 shadow-sm"
                      scrollWheelZoom={false}>
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                      />
                      {oceanCountPoints.map((p, idx) => {
                        const intensity = Math.min(p.count / 160000, 1);
                        return (
                          <CircleMarker
                            key={idx}
                            center={[p.lat, p.lng]}
                            radius={Math.max(8, Math.min(25, p.count / 6000))}
                            fillOpacity={0.6 + intensity * 0.3}
                            fillColor={`hsl(${0}, ${60 + intensity * 25}%, ${45 + intensity * 20}%)`}
                            stroke={true}
                            color="white"
                            weight={1}>
                            <Tooltip>
                              <div className="text-center">
                                <div className="font-semibold">Count: {p.count.toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Ocean Region</div>
                              </div>
                            </Tooltip>
                          </CircleMarker>
                        );
                      })}
                    </MapContainer>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>Low Count</span>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-3 bg-gradient-to-r from-red-300 via-red-500 to-red-700 rounded"></div>
                      </div>
                      <span>High Count</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The maps above show the distribution patterns for <em>{selectedSpecies}</em>  
                   based on environmental factors across ocean regions. The visualization uses gradient-based rendering 
                  to show probability and population density in marine ecosystems around the Indian subcontinent.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnvModel;