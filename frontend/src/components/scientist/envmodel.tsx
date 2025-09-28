import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { Upload, Brain, BarChart3, Map, Database } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dummy algorithms
const algorithms = [
  "Random Forest",
  "SVM",
  "Logistic Regression",
  "Naive Bayes",
  "XGBoost",
  "KNN",
];

// Dummy species
const speciesList = [
  "Sardinella longiceps",
  "Alectis indica",
  "Indian Mackerel",
  "Rastrelliger kanagurta",
  "Thunnus albacares",
  "Caranx ignobilis",
];

// Enhanced probability points with gradients around India's waters
const dummyProbabilityPoints = [
  { lat: 15.2, lng: 73.8, prob: 0.85 }, // Arabian Sea - Goa
  { lat: 18.9, lng: 72.8, prob: 0.72 }, // Arabian Sea - Mumbai
  { lat: 20.5, lng: 70.1, prob: 0.65 }, // Arabian Sea - Gujarat
  { lat: 22.3, lng: 68.7, prob: 0.58 }, // Arabian Sea - Gujarat coast
  { lat: 11.0, lng: 75.8, prob: 0.78 }, // Arabian Sea - Kerala
  { lat: 8.5, lng: 76.9, prob: 0.82 }, // Arabian Sea - Kerala south
  { lat: 13.0, lng: 80.3, prob: 0.75 }, // Bay of Bengal - Chennai
  { lat: 17.7, lng: 83.3, prob: 0.68 }, // Bay of Bengal - Visakhapatnam
  { lat: 20.3, lng: 85.8, prob: 0.71 }, // Bay of Bengal - Bhubaneswar
  { lat: 22.5, lng: 88.3, prob: 0.79 }, // Bay of Bengal - Kolkata
  { lat: 9.9, lng: 78.1, prob: 0.73 }, // Palk Strait
  { lat: 6.9, lng: 79.8, prob: 0.69 }, // Sri Lanka waters
  { lat: 15.8, lng: 82.2, prob: 0.66 }, // Bay of Bengal - Andhra
  { lat: 19.1, lng: 84.8, prob: 0.74 }, // Bay of Bengal - Odisha
];

// Enhanced count points with more data around India's waters
const dummyCountPoints = [
  { lat: 15.2, lng: 73.8, count: 145 }, // Arabian Sea - Goa
  { lat: 18.9, lng: 72.8, count: 89 }, // Arabian Sea - Mumbai
  { lat: 20.5, lng: 70.1, count: 67 }, // Arabian Sea - Gujarat
  { lat: 22.3, lng: 68.7, count: 52 }, // Arabian Sea - Gujarat coast
  { lat: 11.0, lng: 75.8, count: 98 }, // Arabian Sea - Kerala
  { lat: 8.5, lng: 76.9, count: 134 }, // Arabian Sea - Kerala south
  { lat: 13.0, lng: 80.3, count: 112 }, // Bay of Bengal - Chennai
  { lat: 17.7, lng: 83.3, count: 76 }, // Bay of Bengal - Visakhapatnam
  { lat: 20.3, lng: 85.8, count: 83 }, // Bay of Bengal - Bhubaneswar
  { lat: 22.5, lng: 88.3, count: 91 }, // Bay of Bengal - Kolkata
  { lat: 9.9, lng: 78.1, count: 105 }, // Palk Strait
  { lat: 6.9, lng: 79.8, count: 73 }, // Sri Lanka waters
  { lat: 15.8, lng: 82.2, count: 64 }, // Bay of Bengal - Andhra
  { lat: 19.1, lng: 84.8, count: 87 }, // Bay of Bengal - Odisha
  { lat: 12.3, lng: 75.1, count: 156 }, // Karnataka coast
  { lat: 16.5, lng: 81.8, count: 78 }, // Andhra coast
  { lat: 21.6, lng: 87.8, count: 94 }, // West Bengal coast
  { lat: 14.5, lng: 74.2, count: 118 }, // Konkan coast
];

const EnvModel: React.FC = () => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCurves, setShowCurves] = useState(false);
  const [curveType, setCurveType] = useState("roc");
  const [selectedSpecies, setSelectedSpecies] = useState(speciesList[0]);

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
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/ocean-backgro1und.jpg')",
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
            <CardContent className="px-6 space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-sky-600" />
                  Upload Training Data (CSV/Excel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-500 transition-colors">
                  <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Supports CSV, Excel files up to 50MB</p>
                </div>
              </div>

              {/* Algorithm Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  Select Machine Learning Algorithms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {algorithms.map((algo) => (
                    <div key={algo} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Checkbox
                        id={algo}
                        checked={selectedAlgorithms.includes(algo)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAlgorithms((prev) => [...prev, algo]);
                          } else {
                            setSelectedAlgorithms((prev) =>
                              prev.filter((a) => a !== algo)
                            );
                          }
                        }}
                        className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                      />
                      <label htmlFor={algo} className="text-sm font-medium text-gray-700 cursor-pointer">
                        {algo}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Train Button */}
              <Button 
                onClick={() => setIsTraining(true)} 
                disabled={isTraining || selectedAlgorithms.length === 0}
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 transition-all duration-200"
              >
                {isTraining ? "Training Models..." : "Start Training"}
              </Button>

              {/* Loading Progress */}
              {isTraining && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <Progress value={progress} className="w-full h-2 mb-2" />
                  <p className="text-sm font-medium text-blue-800">Training Progress: {progress}%</p>
                  <p className="text-xs text-blue-600">Training {selectedAlgorithms.join(', ')} algorithms...</p>
                </div>
              )}

              {/* ROC / AUC curves */}
              {showCurves && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Model Performance Curves
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">Select Curve Type:</label>
                    <Select value={curveType} onValueChange={setCurveType}>
                      <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="Select Curve" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roc">ROC Curve</SelectItem>
                        <SelectItem value="auc">AUC Curve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={curveType === "roc" ? "/roc_curve.png" : "/auc_curve.png"}
                      alt={`${curveType.toUpperCase()} curve`}
                      className="max-w-lg w-full border rounded-lg shadow-sm bg-white"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Species Prediction Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Species Distribution Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                {/* Probability Map */}
                <Card className="shadow-md">
                  <CardHeader className="bg-blue-50 border-b">
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Probability Map of {selectedSpecies}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MapContainer
                      center={[15, 77]}
                      zoom={5.5}
                      className="h-[400px] w-full rounded-lg z-0 shadow-sm"
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      {dummyProbabilityPoints.map((p, idx) => (
                        <CircleMarker
                          key={idx}
                          center={[p.lat, p.lng]}
                          radius={12 + p.prob * 8}
                          fillOpacity={0.7}
                          fillColor={`rgba(59, 130, 246, ${p.prob})`}
                          stroke={true}
                          color="white"
                          weight={2}
                        >
                          <Tooltip>
                            <div className="text-center">
                              <div className="font-semibold">Probability: {(p.prob * 100).toFixed(1)}%</div>
                              <div className="text-xs text-gray-600">Lat: {p.lat}, Lng: {p.lng}</div>
                            </div>
                          </Tooltip>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>Low Probability</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-gradient-to-r from-blue-200 to-blue-600 rounded"></div>
                      </div>
                      <span>High Probability</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Count Map */}
                <Card className="shadow-md">
                  <CardHeader className="bg-red-50 border-b">
                    <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Population Count of {selectedSpecies}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MapContainer
                      center={[15, 77]}
                      zoom={5.5}
                      className="h-[400px] w-full rounded-lg z-0 shadow-sm"
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      {dummyCountPoints.map((p, idx) => {
                        const intensity = Math.min(p.count / 160, 1); // Normalize for gradient
                        return (
                          <CircleMarker
                            key={idx}
                            center={[p.lat, p.lng]}
                            radius={Math.max(6, Math.min(20, p.count / 8))}
                            fillOpacity={0.7}
                            fillColor={`rgba(239, 68, 68, ${0.4 + intensity * 0.6})`}
                            stroke={true}
                            color="white"
                            weight={2}
                          >
                            <Tooltip>
                              <div className="text-center">
                                <div className="font-semibold">Count: {p.count}</div>
                                <div className="text-xs text-gray-600">Lat: {p.lat}, Lng: {p.lng}</div>
                              </div>
                            </Tooltip>
                          </CircleMarker>
                        );
                      })}
                    </MapContainer>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>Low Count</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-gradient-to-r from-red-200 to-red-600 rounded"></div>
                      </div>
                      <span>High Count</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The maps above show predicted distribution patterns for <em>{selectedSpecies}</em> 
                  based on environmental factors. Darker/larger circles indicate higher probability or count values 
                  around India's coastal and marine ecosystems.
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