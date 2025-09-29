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
  { lat: 18.5, lng: 67.2, prob: 0.95 },
  { lat: 20.1, lng: 63.8, prob: 0.88 },
  { lat: 15.7, lng: 70.5, prob: 0.92 },
  { lat: 12.3, lng: 69.1, prob: 0.78 },
  { lat: 22.8, lng: 64.3, prob: 0.65 },
  { lat: 25.2, lng: 66.7, prob: 0.58 },
  { lat: 8.9, lng: 71.2, prob: 0.82 },

  { lat: 18.2, lng: 87.5, prob: 0.89 },
  { lat: 15.8, lng: 85.3, prob: 0.76 },
  { lat: 21.3, lng: 88.9, prob: 0.93 },
  { lat: 13.1, lng: 83.7, prob: 0.71 },
  { lat: 19.7, lng: 86.4, prob: 0.84 },
  { lat: 11.5, lng: 82.1, prob: 0.69 },
  { lat: 16.9, lng: 89.2, prob: 0.87 },

  { lat: 6.2, lng: 75.8, prob: 0.74 },
  { lat: 4.1, lng: 78.3, prob: 0.81 },
  { lat: 2.8, lng: 80.9, prob: 0.66 },
  { lat: 0.5, lng: 77.4, prob: 0.72 },
  { lat: -1.2, lng: 82.1, prob: 0.79 },
];

const oceanCountPoints = [
  { lat: 18.5, lng: 65.2, count: 125000 },
  { lat: 20.1, lng: 63.8, count: 98000 },
  { lat: 15.7, lng: 67.5, count: 87000 },
  { lat: 12.3, lng: 69.1, count: 76000 },
  { lat: 22.8, lng: 64.3, count: 54000 },

  { lat: 18.2, lng: 87.5, count: 142000 },
  { lat: 21.3, lng: 88.9, count: 156000 },
  { lat: 15.8, lng: 85.3, count: 89000 },
  { lat: 19.7, lng: 86.4, count: 134000 },

  { lat: 6.2, lng: 75.8, count: 67000 },
  { lat: 4.1, lng: 78.3, count: 92000 },
  { lat: 2.8, lng: 80.9, count: 58000 },
];

const INDIA_CENTER: [number, number] = [15.5, 78.0];

const EnvModel: React.FC = () => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCurves, setShowCurves] = useState(false);
  const [curveType, setCurveType] = useState("roc");
  const [selectedSpecies, setSelectedSpecies] = useState(speciesList[0]);
  const [uploadMethod, setUploadMethod] = useState("file");

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
    <div className="min-h-screen" style={{ backgroundColor: "#fbf0dc" }}>
      <div className="max-w-[1400px] mx-auto py-8 px-6">
        {/* Page header */}
        <header className="mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-3 shadow-sm border">
              <Brain className="h-7 w-7 text-sky-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Environment Model</h1>
              <p className="text-sm text-slate-600 mt-1">Train machine learning models to predict marine species distribution</p>
            </div>
          </div>
        </header>

        {/* Main training card */}
        <Card className="rounded-2xl shadow-lg overflow-hidden mb-6 bg-white border border-slate-100">
          <CardHeader className="px-6 py-5 border-b bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-slate-50 border">
                <Database className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Model Training & Configuration</h2>
                <p className="text-xs text-slate-500">Upload training data and pick algorithms to train.</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6 space-y-6 bg-white">
            {/* Upload method */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Select Data Source
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`rounded-lg p-4 cursor-pointer transition-all border ${uploadMethod === "file" ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  onClick={() => setUploadMethod("file")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${uploadMethod === "file" ? "border-sky-500 bg-sky-500" : "border-slate-300"}`}/>
                    <File className="h-5 w-5 text-sky-600" />
                    <span className="font-semibold text-slate-800">Upload File</span>
                  </div>

                  {uploadMethod === "file" && (
                    <>
                      <div className="border-2 border-dashed border-sky-200 rounded-lg p-3 bg-white">
                        <input
                          type="file"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Supports CSV / Excel files up to 50MB</p>
                    </>
                  )}
                </div>

                <div
                  className={`rounded-lg p-4 cursor-pointer transition-all border ${uploadMethod === "database" ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  onClick={() => setUploadMethod("database")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${uploadMethod === "database" ? "border-sky-500 bg-sky-500" : "border-slate-300"}`}/>
                    <Cloud className="h-5 w-5 text-sky-600" />
                    <span className="font-semibold text-slate-800">Select from Database</span>
                  </div>

                  {uploadMethod === "database" && (
                    <>
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
                      <p className="text-xs text-slate-500 mt-2">Access pre-loaded datasets from our database</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Algorithms */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Select Machine Learning Algorithms ({selectedAlgorithms.length} selected)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {algorithms.map((algo) => {
                  const selected = selectedAlgorithms.includes(algo);
                  return (
                    <div
                      key={algo}
                      onClick={() => {
                        if (selected) setSelectedAlgorithms(prev => prev.filter(a => a !== algo));
                        else setSelectedAlgorithms(prev => [...prev, algo]);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${selected ? "bg-sky-50 border-sky-200 shadow-sm" : "bg-white border-slate-100 hover:bg-slate-50"}`}
                    >
                      <Checkbox id={algo} checked={selected} readOnly className="data-[state=checked]:bg-sky-600" />
                      <label htmlFor={algo} className="text-sm font-medium text-slate-800 flex-1 cursor-pointer">
                        {algo}
                      </label>
                    </div>
                  );
                })}
              </div>

              {selectedAlgorithms.length === 0 && (
                <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-100 mt-3">
                  Please select at least one algorithm to proceed with training.
                </div>
              )}
            </div>

            {/* CTA */}
            <div>
              <Button
                onClick={() => setIsTraining(true)}
                disabled={isTraining || selectedAlgorithms.length === 0}
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 disabled:opacity-50"
              >
                {isTraining ? "Training Models..." : "Start Training"}
              </Button>
            </div>

            {/* Progress & Curves */}
            <div className="space-y-4">
              {isTraining && (
                <div className="rounded-lg p-4 bg-sky-50 border-l-4 border-sky-300">
                  <Progress value={progress} className="h-2 rounded" />
                  <div className="flex justify-between mt-2 text-xs text-sky-700 font-medium">
                    <span>Training</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}

              {showCurves && (
                <div className="rounded-lg p-4 bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4 text-slate-700" />
                      <h4 className="text-sm font-semibold text-slate-900">Model Performance Curves</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs text-slate-600">Curve</label>
                      <Select value={curveType} onValueChange={setCurveType}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select Curve" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="roc">ROC Curve</SelectItem>
                          <SelectItem value="auc">AUC Curve</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <img
                      src={curveType === "roc" ? "/roc1.jpeg" : "/roc2.jpeg"}
                      alt={`${curveType} curve`}
                      className="w-full max-w-3xl rounded border shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Species prediction */}
        <Card className="rounded-2xl shadow-lg overflow-hidden bg-white border border-slate-100">
          <CardHeader className="px-6 py-5 border-b bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-slate-50 border">
                <Map className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Species Distribution Prediction</h2>
                <p className="text-xs text-slate-500">Interactive probability and count maps across ocean regions</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Target Species</label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger className="w-full max-w-md bg-white">
                  <SelectValue placeholder="Select Species" />
                </SelectTrigger>
                <SelectContent>
                  {speciesList.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-sky-50 border-b">
                  <CardTitle className="text-lg text-sky-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-500 rounded-full" />
                    Probability Map of {selectedSpecies}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <MapContainer center={INDIA_CENTER} zoom={4} className="h-[400px] w-full rounded-lg" scrollWheelZoom={false}>
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
                            <div className="text-xs text-center">
                              <div className="font-semibold">Probability: {(p.prob * 100).toFixed(1)}%</div>
                              <div className="text-xs text-slate-600">Ocean Location</div>
                            </div>
                          </Tooltip>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>Low Probability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-3 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-700 rounded" />
                      <div className="ml-2 text-xs text-slate-500">Scale</div>
                    </div>
                    <span>High Probability</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="bg-red-50 border-b">
                  <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    Population Count of {selectedSpecies}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <MapContainer center={INDIA_CENTER} zoom={4} className="h-[400px] w-full rounded-lg" scrollWheelZoom={false}>
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
                          weight={1}
                        >
                          <Tooltip>
                            <div className="text-xs text-center">
                              <div className="font-semibold">Count: {p.count.toLocaleString()}</div>
                              <div className="text-xs text-slate-600">Ocean Region</div>
                            </div>
                          </Tooltip>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>Low Count</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-3 bg-gradient-to-r from-red-200 via-red-400 to-red-700 rounded" />
                      <div className="ml-2 text-xs text-slate-500">Scale</div>
                    </div>
                    <span>High Count</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-slate-100 text-sm text-slate-700">
              <strong>Note:</strong> The maps above show the distribution patterns for <em>{selectedSpecies}</em> based on environmental factors across ocean regions. Gradient rendering highlights areas of higher probability and density.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnvModel;
