import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/components/ui/select";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,BarChart,Bar,ResponsiveContainer,AreaChart,Area,Scatter,ScatterChart
} from "recharts";
import {BarChart3,Globe,Layers,Droplet,Fish,Thermometer,MapPin,TrendingUp,Calendar,
} from "lucide-react";
import Interactive3DView from "./interactive";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as LTooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CrossDomain from "@/components/shared/CrossDomain";


const oceanData = {
  temperature: [
    { month: "Jan", surface: 24.2, mid: 22.8, deep: 18.5, region: "Arabian Sea" },
    { month: "Feb", surface: 25.1, mid: 23.2, deep: 18.7, region: "Arabian Sea" },
    { month: "Mar", surface: 26.8, mid: 24.5, deep: 19.2, region: "Arabian Sea" },
    { month: "Apr", surface: 28.5, mid: 26.1, deep: 20.1, region: "Arabian Sea" },
    { month: "May", surface: 29.2, mid: 27.3, deep: 21.0, region: "Arabian Sea" },
    { month: "Jun", surface: 27.8, mid: 25.9, deep: 20.5, region: "Arabian Sea" },
    { month: "Jul", surface: 26.5, mid: 24.8, deep: 19.8, region: "Arabian Sea" },
    { month: "Aug", surface: 26.2, mid: 24.5, deep: 19.5, region: "Arabian Sea" },
    { month: "Sep", surface: 27.1, mid: 25.2, deep: 20.2, region: "Arabian Sea" },
    { month: "Oct", surface: 28.3, mid: 26.5, deep: 21.1, region: "Arabian Sea" },
    { month: "Nov", surface: 26.9, mid: 25.1, deep: 20.3, region: "Arabian Sea" },
    { month: "Dec", surface: 25.4, mid: 23.8, deep: 19.1, region: "Arabian Sea" },
  ],
  salinity: [
    { month: "Jan", surface: 35.2, mid: 35.5, deep: 35.8, region: "Arabian Sea" },
    { month: "Feb", surface: 35.1, mid: 35.4, deep: 35.7, region: "Arabian Sea" },
    { month: "Mar", surface: 34.9, mid: 35.2, deep: 35.6, region: "Arabian Sea" },
    { month: "Apr", surface: 34.8, mid: 35.1, deep: 35.5, region: "Arabian Sea" },
    { month: "May", surface: 35.0, mid: 35.3, deep: 35.7, region: "Arabian Sea" },
    { month: "Jun", surface: 35.3, mid: 35.6, deep: 35.9, region: "Arabian Sea" },
    { month: "Jul", surface: 35.5, mid: 35.8, deep: 36.1, region: "Arabian Sea" },
    { month: "Aug", surface: 35.4, mid: 35.7, deep: 36.0, region: "Arabian Sea" },
    { month: "Sep", surface: 35.2, mid: 35.5, deep: 35.8, region: "Arabian Sea" },
    { month: "Oct", surface: 35.0, mid: 35.3, deep: 35.6, region: "Arabian Sea" },
    { month: "Nov", surface: 35.1, mid: 35.4, deep: 35.7, region: "Arabian Sea" },
    { month: "Dec", surface: 35.3, mid: 35.6, deep: 35.9, region: "Arabian Sea" },
  ],
  fishAbundance: [
    { species: "Tuna", jan: 45, feb: 52, mar: 48, apr: 55, may: 62, jun: 58, jul: 54, aug: 51, sep: 49, oct: 46, nov: 43, dec: 47 },
    { species: "Mackerel", jan: 78, feb: 82, mar: 85, apr: 91, may: 88, jun: 84, jul: 80, aug: 76, sep: 79, oct: 83, nov: 87, dec: 81 },
    { species: "Sardine", jan: 92, feb: 89, mar: 95, apr: 98, may: 102, jun: 105, jul: 100, aug: 96, sep: 93, oct: 90, nov: 88, dec: 94 },
    { species: "Anchovy", jan: 34, feb: 37, mar: 39, apr: 42, may: 45, jun: 48, jul: 44, aug: 41, sep: 38, oct: 35, nov: 32, dec: 36 },
    { species: "Pomfret", jan: 28, feb: 31, mar: 33, apr: 36, may: 39, jun: 41, jul: 38, aug: 35, sep: 32, oct: 29, nov: 26, dec: 30 },
  ],
  eDNA: [
    { month: "Jan", concentration: 2.1, diversity: 145, region: "Coastal" },
    { month: "Feb", concentration: 2.3, diversity: 152, region: "Coastal" },
    { month: "Mar", concentration: 2.8, diversity: 168, region: "Coastal" },
    { month: "Apr", concentration: 3.2, diversity: 175, region: "Coastal" },
    { month: "May", concentration: 3.5, diversity: 182, region: "Coastal" },
    { month: "Jun", concentration: 3.1, diversity: 178, region: "Coastal" },
    { month: "Jul", concentration: 2.9, diversity: 165, region: "Coastal" },
    { month: "Aug", concentration: 2.7, diversity: 158, region: "Coastal" },
    { month: "Sep", concentration: 2.4, diversity: 148, region: "Coastal" },
    { month: "Oct", concentration: 2.2, diversity: 142, region: "Coastal" },
    { month: "Nov", concentration: 2.0, diversity: 138, region: "Coastal" },
    { month: "Dec", concentration: 2.1, diversity: 143, region: "Coastal" },
  ],
  depth: [
    { range: "0-10m", temp: 27.5, salinity: 34.8, fishCount: 120, ph: 8.1 },
    { range: "10-50m", temp: 25.8, salinity: 35.0, fishCount: 95, ph: 8.0 },
    { range: "50-100m", temp: 23.2, salinity: 35.2, fishCount: 75, ph: 7.9 },
    { range: "100-200m", temp: 20.5, salinity: 35.4, fishCount: 50, ph: 7.8 },
    { range: "200-500m", temp: 18.1, salinity: 35.6, fishCount: 30, ph: 7.7 },
    { range: "500m+", temp: 15.8, salinity: 35.8, fishCount: 15, ph: 7.6 },
  ],
  pH: [
  { month: "Jan", surface: 8.12, mid: 8.05, deep: 7.85, region: "Arabian Sea" },
  { month: "Feb", surface: 8.15, mid: 8.08, deep: 7.88, region: "Arabian Sea" },
  { month: "Mar", surface: 8.18, mid: 8.12, deep: 7.92, region: "Arabian Sea" },
  { month: "Apr", surface: 8.22, mid: 8.15, deep: 7.95, region: "Arabian Sea" },
  { month: "May", surface: 8.25, mid: 8.18, deep: 7.98, region: "Arabian Sea" },
  { month: "Jun", surface: 8.20, mid: 8.13, deep: 7.93, region: "Arabian Sea" },
  { month: "Jul", surface: 8.16, mid: 8.09, deep: 7.89, region: "Arabian Sea" },
  { month: "Aug", surface: 8.14, mid: 8.07, deep: 7.87, region: "Arabian Sea" },
  { month: "Sep", surface: 8.17, mid: 8.10, deep: 7.90, region: "Arabian Sea" },
  { month: "Oct", surface: 8.19, mid: 8.12, deep: 7.92, region: "Arabian Sea" },
  { month: "Nov", surface: 8.16, mid: 8.09, deep: 7.89, region: "Arabian Sea" },
  { month: "Dec", surface: 8.13, mid: 8.06, deep: 7.86, region: "Arabian Sea" },
],

nutrients: [
  { month: "Jan", nitrate: 15.2, phosphate: 1.8, silicate: 28.5, chlorophyll: 0.35, region: "Arabian Sea" },
  { month: "Feb", nitrate: 14.8, phosphate: 1.7, silicate: 27.2, chlorophyll: 0.32, region: "Arabian Sea" },
  { month: "Mar", nitrate: 12.5, phosphate: 1.5, silicate: 24.8, chlorophyll: 0.45, region: "Arabian Sea" },
  { month: "Apr", nitrate: 10.2, phosphate: 1.2, silicate: 21.5, chlorophyll: 0.58, region: "Arabian Sea" },
  { month: "May", nitrate: 8.8, phosphate: 1.0, silicate: 18.9, chlorophyll: 0.72, region: "Arabian Sea" },
  { month: "Jun", nitrate: 11.5, phosphate: 1.3, silicate: 23.2, chlorophyll: 0.62, region: "Arabian Sea" },
  { month: "Jul", nitrate: 13.8, phosphate: 1.6, silicate: 26.1, chlorophyll: 0.48, region: "Arabian Sea" },
  { month: "Aug", nitrate: 14.2, phosphate: 1.7, silicate: 27.8, chlorophyll: 0.42, region: "Arabian Sea" },
  { month: "Sep", nitrate: 13.1, phosphate: 1.5, silicate: 25.5, chlorophyll: 0.38, region: "Arabian Sea" },
  { month: "Oct", nitrate: 11.8, phosphate: 1.4, silicate: 23.8, chlorophyll: 0.41, region: "Arabian Sea" },
  { month: "Nov", nitrate: 13.5, phosphate: 1.6, silicate: 26.5, chlorophyll: 0.36, region: "Arabian Sea" },
  { month: "Dec", nitrate: 14.9, phosphate: 1.8, silicate: 28.1, chlorophyll: 0.33, region: "Arabian Sea" },
],
};

const crossDomainData = [
  { region: "Arabian Sea North", temp: 26.5, salinity: 35.2, fishCount: 150, eDNA: 2.8, depth: 45, ph: 8.1, nutrients: 1.2 },
  { region: "Arabian Sea South", temp: 28.1, salinity: 34.8, fishCount: 220, eDNA: 3.2, depth: 65, ph: 8.0, nutrients: 1.5 },
  { region: "Bay of Bengal East", temp: 27.3, salinity: 35.0, fishCount: 180, eDNA: 2.9, depth: 38, ph: 7.9, nutrients: 1.8 },
  { region: "Bay of Bengal West", temp: 25.8, salinity: 34.5, fishCount: 280, eDNA: 3.5, depth: 42, ph: 8.2, nutrients: 2.1 },
  { region: "Indian Ocean Central", temp: 29.2, salinity: 35.3, fishCount: 95, eDNA: 2.2, depth: 78, ph: 7.8, nutrients: 0.9 },
  { region: "Coastal Waters East", temp: 24.5, salinity: 34.2, fishCount: 320, eDNA: 4.1, depth: 28, ph: 8.3, nutrients: 2.8 },
];

const nutrients = [
  { name: "Nitrates", value: 2.1, unit: "mg/L", color: "#0ea5e9" },
  { name: "Phosphates", value: 0.8, unit: "mg/L", color: "#10b981" },
  { name: "Silicates", value: 1.5, unit: "mg/L", color: "#f59e0b" },
  { name: "Dissolved O2", value: 8.2, unit: "mg/L", color: "#ef4444" },
];

const seasonalTrends = [
  { season: "Pre-Monsoon", biodiversity: 85, fishActivity: 92, temp: 28.5, ph: 8.1 },
  { season: "Monsoon", biodiversity: 72, fishActivity: 68, temp: 25.8, ph: 7.9 },
  { season: "Post-Monsoon", biodiversity: 78, fishActivity: 85, temp: 27.2, ph: 8.0 },
  { season: "Winter", biodiversity: 88, fishActivity: 95, temp: 24.3, ph: 8.2 },
];

const parameters = [
  { value: "temperature", label: "Temperature (°C)", icon: Thermometer },
  { value: "salinity", label: "Salinity (psu)", icon: Droplet },
  { value: "fishCount", label: "Fish Abundance", icon: Fish },
  { value: "eDNA", label: "eDNA Concentration", icon: BarChart3 },
  { value: "depth", label: "Depth (m)", icon: TrendingUp },
  { value: "ph", label: "pH Level", icon: Droplet },
  { value: "nutrients", label: "Nutrients (mg/L)", icon: BarChart3 },
];

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const dummyPoints = {
  temperature: [
    { lat: 18.95, lng: 72.65, value: 29.1 }, // Mumbai coast - warm
    { lat: 16.8, lng: 68.5, value: 28.5 }, // central arabian sea
    { lat: 14.7, lng: 80.3, value: 30.2 }, // chennai coast / bay
    { lat: 9.1, lng: 72.8, value: 27.8 }, // lakshadweep area
    { lat: 11.0, lng: 92.7, value: 30.6 }, // andaman seas
  ],
  salinity: [
    { lat: 19.0, lng: 72.7, value: 35.2 },
    { lat: 21.6, lng: 89.7, value: 34.8 },
    { lat: 15.0, lng: 88.0, value: 35.0 },
    { lat: 9.2, lng: 73.0, value: 36.1 },
    { lat: 7.5, lng: 79.7, value: 34.4 },
  ],
  fishCount: [
    { lat: 19.0, lng: 72.7, value: 82 },
    { lat: 16.8, lng: 71.1, value: 64 },
    { lat: 10.5, lng: 72.6, value: 45 },
    { lat: 14.7, lng: 80.3, value: 70 },
    { lat: 11.0, lng: 92.7, value: 25 },
    { lat: 18.2, lng: 72.9, value: 88 },
  ],
  eDNA: [
    { lat: 18.5, lng: 72.6, value: 3.2 },
    { lat: 15.2, lng: 75.3, value: 2.9 },
    { lat: 9.0, lng: 73.0, value: 3.5 },
    { lat: 21.7, lng: 86.8, value: 2.4 },
    { lat: 7.5, lng: 79.7, value: 2.1 },
  ],
  depth: [
    { lat: 18.0, lng: 72.5, value: 30 },
    { lat: 15.0, lng: 72.5, value: 60 },
    { lat: 11.0, lng: 72.8, value: 200 },
    { lat: 8.5, lng: 76.0, value: 500 },
    { lat: 20.0, lng: 65.5, value: 180 },
  ],
  ph: [
    { lat: 18.95, lng: 72.65, value: 8.1 },
    { lat: 14.7, lng: 80.3, value: 7.9 },
    { lat: 9.1, lng: 72.8, value: 8.2 },
    { lat: 11.0, lng: 92.7, value: 7.7 },
    { lat: 21.6, lng: 86.7, value: 8.0 },
  ],
  nutrients: [
    { lat: 19.0, lng: 72.7, value: 1.2 }, // nitrates
    { lat: 16.8, lng: 74.1, value: 1.5 }, // phosphates
    { lat: 14.7, lng: 80.3, value: 2.1 }, // higher nutrients
    { lat: 11.0, lng: 92.7, value: 0.9 }, // lower nutrients
    { lat: 21.6, lng: 86.7, value: 2.8 }, // coastal rich
  ],
};

// helper to compute radius for circle markers given a value and parameter
const markerRadiusFor = (param: string, value: number) => {
  switch (param) {
    case "temperature":
      // temp range ~ 24 - 31 -> scale to 5..16
      return Math.max(4, Math.round(((value - 22) / 10) * 14));
    case "salinity":
      // salinity ~ 34 - 36 -> scale to 4..12
      return Math.max(3, Math.round(((value - 33) / 4) * 12));
    case "fishCount":
      // fish abundance 0-120 scale
      return Math.max(4, Math.round((value / 120) * 18));
    case "eDNA":
      // eDNA ~1.5 - 4 -> scale
      return Math.max(3, Math.round(((value - 1) / 3) * 12));
    case "depth":
      // depth value large -> smaller radii for deeper points
      return Math.max(3, Math.round(Math.min(18, (1000 / (value + 50)))));
    case "ph":
      return Math.max(3, Math.round(((value - 7) / 1.5) * 12));
    case "nutrients":
      return Math.max(3, Math.round((value / 3) * 16));
    default:
      return 6;
  }
};

// color pallette per parameter for pathOptions
const colorFor = (param: string) => {
  switch (param) {
    case "temperature":
      return "#ef4444";
    case "salinity":
      return "#0ea5e9";
    case "fishCount":
      return "#10b981";
    case "eDNA":
      return "#8b5cf6";
    case "depth":
      return "#f97316";
    case "ph":
      return "#7c3aed";
    case "nutrients":
      return "#f59e0b";
    default:
      return "#3b82f6";
  }
};

// small component to update map view when center changes
const MapUpdater: React.FC<{ center: [number, number] | null; zoom?: number }> = ({ center, zoom = 5 }) => {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const DataVisualization: React.FC = () => {
  const [activeView, setActiveView] = useState("individual");
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [xParameter, setXParameter] = useState("temperature");
  const [yParameter, setYParameter] = useState("salinity");

  // correlation data for cross-domain charts
  const correlationData = useMemo(() => {
    return crossDomainData.map((item) => ({
      ...item,
      x: item[xParameter as keyof typeof item] as number,
      y: item[yParameter as keyof typeof item] as number,
    }));
  }, [xParameter, yParameter]);

  const getParameterLabel = (param: string) => {
    return parameters.find((p) => p.value === param)?.label || param;
  };

  // dataset to display on the Indian map based on selectedParameter
  const activeMapPoints = useMemo(() => {
    // ensure fallback if key missing
    // @ts-ignore
    return dummyPoints[selectedParameter] || [];
  }, [selectedParameter]);

  // Auto-center on cluster of active points (mean lat/lng)
  const activeCenter: [number, number] | null = useMemo(() => {
    const pts = activeMapPoints;
    if (!pts || pts.length === 0) return INDIA_CENTER;
    const avgLat = pts.reduce((s: number, p: any) => s + p.lat, 0) / pts.length;
    const avgLng = pts.reduce((s: number, p: any) => s + p.lng, 0) / pts.length;
    return [avgLat, avgLng];
  }, [activeMapPoints]);

  // ---------------------------
  // IndianMapVisualization: uses react-leaflet to render a real map
  // ---------------------------
  const IndianMapVisualization = () => (
    <div className="relative">
      <div className="w-full h-64 rounded-lg relative overflow-hidden">
        <MapContainer
          center={INDIA_CENTER}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Automatically update map view to activeCenter whenever parameter changes */}
          <MapUpdater center={activeCenter} zoom={5} />

          {/* Render markers for currently selected parameter */}
          {activeMapPoints.map((p: any, idx: number) => (
            <CircleMarker
              key={`pt-${selectedParameter}-${idx}`}
              center={[p.lat, p.lng]}
              radius={markerRadiusFor(selectedParameter, p.value)}
              pathOptions={{ color: colorFor(selectedParameter), fillColor: colorFor(selectedParameter), fillOpacity: 0.75 }}
            >
              <LTooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs">
                  <div><strong>{getParameterLabel(selectedParameter)}</strong></div>
                  <div className="text-xs">{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</div>
                  <div className="text-xs">Lat: {p.lat.toFixed(2)}, Lon: {p.lng.toFixed(2)}</div>
                </div>
              </LTooltip>
              <Popup>
                <div>
                  <h4 className="font-semibold">{getParameterLabel(selectedParameter)}</h4>
                  <div className="text-sm text-gray-700">Value: {p.value}</div>
                  <div className="mt-1 text-xs text-gray-600">Coords: {p.lat.toFixed(3)}, {p.lng.toFixed(3)}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend (kept visually similar to original) */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 rounded text-xs">
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" /> Temperature
          </div>
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" /> Salinity
          </div>
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" /> Fish Activity
          </div>
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-1" /> eDNA
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-1" /> Nutrients
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ocean Data Visualization</h1>
        <p className="text-gray-600">Interactive analysis of marine ecosystem parameters</p>
      </div>

      {/* Tab Navigation */}
      <CardContent className="p-0">
        <div className="flex w-full">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 flex items-center justify-center ${
              activeView === "individual" ? "border-sky-500 text-sky-600 font-semibold" : "border-transparent text-gray-600 hover:text-sky-500"
            }`}
            onClick={() => setActiveView("individual")}
          >
            <BarChart3 className="h-4 w-4 mr-2" /> Individual Parameters
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 flex items-center justify-center ${
              activeView === "cross-domain" ? "border-sky-500 text-sky-600 font-semibold" : "border-transparent text-gray-600 hover:text-sky-500"
            }`}
            onClick={() => setActiveView("cross-domain")}>
            <Layers className="h-4 w-4 mr-2"/>Cross-Domain Analysis
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none border-b-2 flex items-center justify-center ${
              activeView === "3d" ? "border-sky-500 text-sky-600 font-semibold" : "border-transparent text-gray-600 hover:text-sky-500"
            }`}
            onClick={() => setActiveView("3d")}>
            <Globe className="h-4 w-4 mr-2" /> 3D Interactive
          </Button>
        </div>
      </CardContent>

      {/* Individual Parameters View */}
      {activeView === "individual" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" /> Select Parameter to Visualize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedParameter} onValueChange={(v) => setSelectedParameter(String(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose ocean parameter" />
                </SelectTrigger>
                <SelectContent>
                  {parameters.map((param) => (
                    <SelectItem key={param.value} value={param.value}>
                      <div className="flex items-center">
                        <param.icon className="h-4 w-4 mr-2" /> {param.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Parameter Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{getParameterLabel(selectedParameter)} - Temporal Variation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  {selectedParameter === "temperature" ? (
                    <LineChart data={oceanData.temperature}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="surface" stroke="#ef4444" name="Surface (°C)" />
                      <Line type="monotone" dataKey="mid" stroke="#f59e0b" name="Mid-water (°C)" />
                      <Line type="monotone" dataKey="deep" stroke="#3b82f6" name="Deep (°C)" />
                    </LineChart>
                  ) : selectedParameter === "salinity" ? (
                    <AreaChart data={oceanData.salinity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="surface" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" />
                      <Area type="monotone" dataKey="mid" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
                      <Area type="monotone" dataKey="deep" stackId="1" stroke="#0891b2" fill="#0891b2" />
                    </AreaChart>
                  ) : selectedParameter === "fishCount" ? (
                    <BarChart data={oceanData.fishAbundance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="species" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="jan" fill="#0ea5e9" />
                      <Bar dataKey="jun" fill="#10b981" />
                      <Bar dataKey="dec" fill="#f59e0b" />
                    </BarChart>
                  ) : selectedParameter === "eDNA" ? (
                    <LineChart data={oceanData.eDNA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="concentration" stroke="#8b5cf6" name="Concentration" />
                      <Line type="monotone" dataKey="diversity" stroke="#06b6d4" name="Diversity Index" />
                    </LineChart>
                  ) : selectedParameter === "depth" ? (
                    <BarChart data={oceanData.depth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="fishCount" fill="#10b981" />
                    </BarChart>
                  ) : null}
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Indian Ocean Map (interactive) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-9 w-5 mr-2" /> Indian Ocean Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IndianMapVisualization />
              </CardContent>
            </Card>

            {/* Abundance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" /> Fish Abundance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oceanData.fishAbundance.map((species) => (
                    <div key={species.species} className="flex items-center justify-between">
                      <span className="font-medium">{species.species}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                            style={{ width: `${(species.jan / 120) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{species.jan}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Variations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" /> Seasonal Variations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="biodiversity" fill="#10b981" />
                    <Bar dataKey="fishActivity" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Water Quality */}
            <Card>
              <CardHeader>
                <CardTitle>Water Quality & pH Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">7.8</p>
                    <p className="text-sm text-blue-800">pH Level</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">8.2</p>
                    <p className="text-sm text-green-800">Dissolved O2</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">35.1</p>
                    <p className="text-sm text-purple-800">Salinity (psu)</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">2.1</p>
                    <p className="text-sm text-amber-800">Turbidity</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={oceanData.depth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ph" stroke="#8b5cf6" name="pH Level" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Nutrients Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrient Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nutrients.map((nutrient) => (
                    <div key={nutrient.name} className="flex items-center justify-between">
                      <span className="font-medium">{nutrient.name}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${(nutrient.value / 10) * 100}%`, backgroundColor: nutrient.color }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16">{nutrient.value} {nutrient.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cross-Domain Analysis View */}
      {activeView === 'cross-domain' && (
        <div className="space-y-6">
          {/* Parameter Selection for Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>Parameter Correlation Analysis</CardTitle>
              <p className="text-sm text-gray-600">Select two parameters to analyze their correlation</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">X-Axis Parameter</label>
                  <Select value={xParameter} onValueChange={setXParameter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {parameters.map((param) => (
                        <SelectItem key={param.value} value={param.value}>
                          <div className="flex items-center">
                            <param.icon className="h-4 w-4 mr-2" />
                            {param.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Y-Axis Parameter</label>
                  <Select value={yParameter} onValueChange={setYParameter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {parameters.map((param) => (
                        <SelectItem key={param.value} value={param.value}>
                          <div className="flex items-center">
                            <param.icon className="h-4 w-4 mr-2" />
                            {param.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correlation Scatter Plot */}
          <Card>
            <CardHeader>
              <CardTitle>
                {getParameterLabel(xParameter)} vs {getParameterLabel(yParameter)} Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="90%" height={350}>
                <ScatterChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name={getParameterLabel(xParameter)}
                    type="number"
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis 
                    dataKey="y" 
                    name={getParameterLabel(yParameter)}
                    type="number"
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-semibold">{data.region}</p>
                            <p>{getParameterLabel(xParameter)}: {data.x}</p>
                            <p>{getParameterLabel(yParameter)}: {data.y}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="x" fill="#0ea5e9" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {/* Correlation Matrix Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Parameter Relationships Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['Temp', 'Salinity', 'Fish', 'eDNA'].map((param1, i) =>
                  ['Temp', 'Salinity', 'Fish', 'eDNA'].map((param2, j) => (
                    <div 
                      key={`${i}-${j}`}
                      className={`p-2 text-center rounded ${
                        i === j ? 'bg-gray-200' : 
                        Math.random() > 0.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {i === j ? '1.00' : (Math.random() * 2 - 1).toFixed(2)}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Green: Positive correlation, Red: Negative correlation
              </div>
            </CardContent>
          </Card>

          {/* Regional Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Multi-Parameter Regional Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crossDomainData.map((region, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{region.region}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Temperature</p>
                        <p className="font-bold text-red-600">{region.temp}°C</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Salinity</p>
                        <p className="font-bold text-blue-600">{region.salinity} psu</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fish Count</p>
                        <p className="font-bold text-green-600">{region.fishCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">eDNA</p>
                        <p className="font-bold text-purple-600">{region.eDNA}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">pH Level</p>
                        <p className="font-bold text-amber-600">{region.ph}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nutrients</p>
                        <p className="font-bold text-pink-600">{region.nutrients}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>       
        </div>
      )}
      {activeView === 'cross-domain' &&       
      <CrossDomain/>
    }



      

      {/* 3D Interactive View */}
        {activeView === '3d' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interactive 3D Segmentation Visualization</CardTitle>
                
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Otolith" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otolith1">Indian Cod</SelectItem>
                    <SelectItem value="otolith2">Haddock</SelectItem>
                    <SelectItem value="otolith3">Pollock</SelectItem>
                    <SelectItem value="otolith4">Mackerel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Interactive3DView activeView={activeView} />
                
                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-800">PLY Point Cloud</h4>
                    <p className="text-sm text-blue-600">Native PLY file format support with vertex colors</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-green-800">Interactive Controls</h4>
                    <p className="text-sm text-green-600">Mouse drag to rotate, scroll to zoom</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-purple-800">Real-time Rendering</h4>
                    <p className="text-sm text-purple-600">WebGL-powered Three.js visualization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};