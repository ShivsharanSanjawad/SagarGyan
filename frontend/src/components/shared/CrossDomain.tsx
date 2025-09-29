// CrossDomain.tsx - same logic as before; header and layer chips restyled (white header card, pill buttons, subtle shadows).
// NO functional logic was changed — only styles.

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Slider, Button, Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { PlayArrow, Pause, Speed, GetApp, FileDownload } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import environmentalData from './environmental_data_indian_ocean.json';
import currentsData from './currents_data_indian_ocean.json';
import speciesSightings from './species_sightings_indian_ocean.json';

// Types
interface HeatPoint {
  lat: number;
  lon: number;
  value: number;
  timestamp: string;
}

interface CurrentVector {
  positions: [number, number][];
  timestamp: string;
}

interface Sighting {
  lat: number;
  lon: number;
  species: string;
  scientific: string;
  count: number;
  timestamp: string;
  eDNAcount: number;
  eDNAsequence: string;
  otolithImageUrl: string;
  specimenSample: string;
}

interface TimeSeries {
  date: string;
  value: number;
  timestamp: string;
}

interface PointInfo {
  timestamp: string;
  timeSeries: Record<string, TimeSeries[]>;
}

interface HeatmapLayerProps {
  data: [number, number, number][];
  color: string;
  variable: string;
  opacity?: number;
}

/* AnimatedNumber: lightweight count-up for small dashboard counters */
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({ value, duration = 900, className }) => {
  const target = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    if (isNaN(target)) {
      setDisplay(0);
      return;
    }
    const step = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - (startRef.current ?? 0);
      const prog = Math.min(1, elapsed / duration);
      const eased = Math.pow(prog, 0.78);
      const cur = Math.round(eased * target);
      setDisplay(cur);
      if (prog < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return <span className={className}>{display}</span>;
};

// Enhanced Heatmap Layer with variable-specific gradients
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data, color, variable, opacity = 0.9 }) => {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  // Variable-specific gradient configurations
  const getGradientConfig = (varName: string) => {
    switch(varName) {
      case 'SST':
        return {
          0.0: '#2166ac',
          0.2: '#4393c3',
          0.4: '#92c5de',
          0.5: '#d1e5f0',
          0.6: '#fdbf6f',
          0.7: '#fd8d3c',
          0.8: '#f03b20',
          0.9: '#bd0026',
          1.0: '#800026'
        };
      case 'Salinity':
        return {
          0.0: '#f7fbff',
          0.2: '#deebf7',
          0.4: '#c6dbef',
          0.6: '#9ecae1',
          0.8: '#4292c6',
          1.0: '#08519c'
        };
      case 'Chlorophyll':
        return {
          0.0: '#fff7ec',
          0.3: '#fee8c8',
          0.5: '#fdd49e',
          0.7: '#fdbb84',
          0.8: '#fc8d59',
          0.9: '#e34a33',
          1.0: '#b30000'
        };
      case 'pH':
        return {
          0.0: '#d7191c',
          0.2: '#fdae61',
          0.4: '#ffffbf',
          0.6: '#abd9e9',
          0.8: '#74add1',
          1.0: '#2c7bb6'
        };
      case 'Oxygen':
        return {
          0.0: '#a50026',
          0.2: '#d73027',
          0.4: '#f46d43',
          0.6: '#fee08b',
          0.8: '#c7e9b4',
          1.0: '#006837'
        };
      case 'Nitrate':
        return {
          0.0: '#f7fcf5',
          0.3: '#e5f5e0',
          0.5: '#c7e9c0',
          0.7: '#a1d99b',
          0.8: '#74c476',
          0.9: '#41ab5d',
          1.0: '#238b45'
        };
      case 'Phosphate':
        return {
          0.0: '#fcfbfd',
          0.3: '#efedf5',
          0.5: '#dadaeb',
          0.7: '#bcbddc',
          0.8: '#9e9ac8',
          0.9: '#807dba',
          1.0: '#54278f'
        };
      default:
        return {
          0.0: '#ffffcc',
          0.3: '#fed976',
          0.5: '#fd8d3c',
          0.7: '#fc4e2a',
          0.9: '#e31a1c',
          1.0: '#800026'
        };
    }
  };

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    if (!data.length) return;

    const values = data.map(d => d[2]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;
    
    const normalizedData = data.map(([lat, lon, val]) => {
      if (range === 0) return [lat, lon, 0.5];
      const normalized = (val - minValue) / range;
      const enhanced = Math.pow(normalized, 0.7);
      return [lat, lon, enhanced];
    });

    const gradient = getGradientConfig(variable);

    const heatLayer = (L as any).heatLayer(normalizedData, {
      radius: 45,
      blur: 30,
      maxZoom: 17,
      minOpacity: 0.3,
      gradient: gradient,
      max: 1.0,
    });

    heatLayer.addTo(map);
    layerRef.current = heatLayer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [data, color, variable, map, opacity]);

  return null;
};

// Map utilities
const MapResizer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
};

const MapClickHandler: React.FC<{ 
  onSelect: (lat: number, lon: number, info: PointInfo) => void 
}> = ({ onSelect }) => {
  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;
    const ts = generateRealisticTimeSeries(lat, lng);
    onSelect(lat, lng, { timestamp: new Date().toISOString(), timeSeries: ts });
  });
  return null;
};

// Generate realistic time series with actual dates
function generateRealisticTimeSeries(lat: number, lon: number): Record<string, TimeSeries[]> {
  const baseTemp = 28 - Math.abs(lat - 10) * 0.2;
  const baseSal = 35 + (Math.abs(lat) - 15) * 0.01;
  const vars = ['SST', 'Salinity', 'Chlorophyll', 'pH', 'Oxygen', 'Nitrate', 'Phosphate'] as const;
  const days = 60;
  const out: Record<string, TimeSeries[]> = {};
  
  const startDate = new Date('2025-07-01');
  
  vars.forEach((v) => {
    const series: TimeSeries[] = [];
    for (let d = 0; d < days; d++) {
      let val = 0;
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      
      switch(v) {
        case 'SST': 
          val = baseTemp + 2 * Math.sin((2 * Math.PI * d) / 365) + (Math.random() - 0.5) * 1.5; 
          val = Math.max(20, Math.min(32, val)); 
          break;
        case 'Salinity': 
          val = baseSal + (Math.random() - 0.5) * 0.3; 
          val = Math.max(32, Math.min(37, val)); 
          break;
        case 'Chlorophyll': 
          val = 0.8 * Math.exp((Math.random() - 0.5) * 1.2); 
          val = Math.max(0.05, Math.min(5, val)); 
          break;
        case 'pH': 
          val = 8.1 + (Math.random() - 0.5) * 0.06; 
          val = Math.max(7.9, Math.min(8.3, val)); 
          break;
        case 'Oxygen': 
          val = 10 - baseTemp * 0.2 + (Math.random() - 0.5) * 1.2; 
          val = Math.max(5, Math.min(12, val)); 
          break;
        case 'Nitrate': 
          val = 8 + Math.random() * Math.random() * 12; 
          val = Math.max(0.5, Math.min(25, val)); 
          break;
        case 'Phosphate': 
          val = 0.8 + Math.random() * Math.random() * 1.2; 
          val = Math.max(0.1, Math.min(2.5, val)); 
          break;
      }
      
      series.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.round(val * 1000) / 1000,
        timestamp: currentDate.toISOString(),
      });
    }
    out[v] = series;
  });
  return out;
}

// ---------- Upgraded TimelineControls (UI only; props & logic preserved) ----------
const TimelineControls: React.FC<{
  dateArray: string[];
  currentDateIndex: number;
  setCurrentDateIndex: (index: number) => void;
  dateRange: [number, number];
  setDateRange: (range: [number, number]) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
}> = ({
  dateArray,
  currentDateIndex,
  setCurrentDateIndex,
  dateRange,
  setDateRange,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed
}) => {
  const currentDate = dateArray[currentDateIndex] || '';
  const formattedDate = currentDate ? new Date(currentDate).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  }) : '';

  // Ensure current date is within range when range changes
  useEffect(() => {
    if (currentDateIndex < dateRange[0] || currentDateIndex > dateRange[1]) {
      setCurrentDateIndex(dateRange[0]);
    }
  }, [dateRange, currentDateIndex, setCurrentDateIndex]);

  const formatShortDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-CA') : '—';

  return (
    <Card sx={{ backgroundColor: 'white', border: '1px solid #e6edf3', borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {formattedDate || 'No date selected'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Current: Day {currentDateIndex + 1} of {dateArray.length} • {currentDate || '—'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={isPlaying ? <Pause /> : <PlayArrow />}
              onClick={() => setIsPlaying(!isPlaying)}
              sx={{
                background: isPlaying
                  ? 'linear-gradient(90deg,#2563eb,#1e40af)'
                  : 'linear-gradient(90deg,#3b82f6,#2563eb)',
                boxShadow: '0 6px 18px rgba(37,99,235,0.18)',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                px: 2.5,
                py: 1
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Box sx={{ width: 220, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', minWidth: 36 }}>
                Speed
              </Typography>
              <Slider
                value={speed}
                onChange={(_, val) => setSpeed(Number(val))}
                min={200}
                max={2000}
                step={100}
                sx={{
                  '& .MuiSlider-track': { backgroundColor: '#60a5fa' },
                  '& .MuiSlider-thumb': { bgcolor: '#1e40af' },
                  '& .MuiSlider-rail': { bgcolor: '#e6eefc' },
                  height: 8
                }}
              />
              <Typography variant="caption" sx={{ color: '#334155', minWidth: 48, textAlign: 'right' }}>
                {speed}ms
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Range selector card */}
        <Card sx={{ backgroundColor: '#fbfdff', border: '1px solid #eef6ff', mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 600, mb: 1 }}>
              Set the date range for animation playback
            </Typography>

            <Box sx={{ px: 1 }}>
              <Slider
                value={dateRange}
                onChange={(_, val) => setDateRange(val as [number, number])}
                min={0}
                max={Math.max(0, dateArray.length - 1)}
                valueLabelDisplay="off"
                sx={{
                  '& .MuiSlider-thumb': { bgcolor: '#059669', boxShadow: '0 6px 12px rgba(5,150,105,0.18)' },
                  '& .MuiSlider-track': { bgcolor: '#10b981' },
                  '& .MuiSlider-rail': { bgcolor: '#e6f6ef' },
                  height: 8
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  {formatShortDate(dateArray[dateRange[0]])}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  {formatShortDate(dateArray[dateRange[1]])}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Current date navigation */}
        <Card sx={{ backgroundColor: '#fff', border: '1px solid #eef2ff', mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 700 }}>
                  Current Date Navigation
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Navigate to specific date within selected range
                </Typography>
              </Box>
              <Chip label={`Day ${currentDateIndex + 1}`} sx={{ bgcolor: '#eef4ff', color: '#2563eb', fontWeight: 600 }} />
            </Box>

            <Box sx={{ px: 1 }}>
              <Slider
                value={currentDateIndex}
                onChange={(_, val) => setCurrentDateIndex(val as number)}
                min={dateRange[0]}
                max={dateRange[1]}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => dateArray[v] ?? ''}
                sx={{
                  '& .MuiSlider-thumb': { bgcolor: '#2563eb', boxShadow: '0 8px 18px rgba(37,99,235,0.16)' },
                  '& .MuiSlider-track': { bgcolor: '#93c5fd' },
                  '& .MuiSlider-rail': { bgcolor: '#eef6ff' },
                  height: 10
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  {formatShortDate(dateArray[dateRange[0]])}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  {formatShortDate(dateArray[dateRange[1]])}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Compact status / range info row */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Card sx={{ flex: 1, backgroundColor: '#fbfdff', border: '1px solid #eef6ff' }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 700 }}>
                Current Status
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                Viewing: {formattedDate || '—'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Animation: {isPlaying ? 'Playing' : 'Paused'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 260, backgroundColor: '#fff', border: '1px solid #eef2ff' }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 700 }}>
                Range Info
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                From: {formatShortDate(dateArray[dateRange[0]])}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                To: {formatShortDate(dateArray[dateRange[1]])}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
};
// -------------------------------------------------------------------------------

const CrossDomain: React.FC = () => {
  const DEFAULT_CENTER: [number, number] = [15.0, 75.0];
  const DEFAULT_ZOOM = 5;
  const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const ATTRIBUTION = 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics';

  const layerColors: Record<string, string> = {
    SST: '#1e40af', Salinity: '#2563eb', Chlorophyll: '#2ca02c',
    pH: '#4f46e5', Oxygen: '#0ea5e9', Nitrate: '#0891b2', Phosphate: '#7c3aed'
  };

  const speciesColors: Record<string, string> = {
    'Blue Whale': '#2563eb', 'Bottlenose Dolphin': '#1f77b4', 'Great White Shark': '#0ea5e9',
    'Loggerhead Turtle': '#3b82f6', 'Harbor Seal': '#60a5fa'
  };

  // Fix leaflet icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
  });

  // State
  const [layers, setLayers] = useState<Record<string, boolean>>({
    SST: true, Salinity: false, Chlorophyll: false, pH: false, 
    Oxygen: false, Nitrate: false, Phosphate: false, Currents: true, Sightings: true
  });

  const [envData] = useState<Record<string, HeatPoint[]>>(environmentalData);
  const [currData] = useState<CurrentVector[]>(currentsData);
  const [sightData] = useState<Sighting[]>(speciesSightings);
  const [info, setInfo] = useState<{ lat: number; lon: number; data: PointInfo } | null>(null);

  // Extract unique dates and sort
  const dateArray = useMemo(() => {
    const datesSet = new Set<string>();
    
    Object.values(envData).forEach((points: HeatPoint[]) =>
      points.forEach(p => p.timestamp && datesSet.add(p.timestamp.split('T')[0]))
    );
    
    sightData.forEach(s => s.timestamp && datesSet.add(s.timestamp.split('T')[0]));
    
    return Array.from(datesSet).sort();
  }, [envData, sightData]);

  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(800);
  const [dateRange, setDateRange] = useState<[number, number]>([0, Math.max(0, dateArray.length - 1)]);

  // Animation control - CORRECTED LOGIC
  useEffect(() => {
    if (!isPlaying || dateArray.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentDateIndex(prev => {
        // If we're at the end of the range, loop back to the start
        if (prev >= dateRange[1]) {
          return dateRange[0];
        }
        // Otherwise, just go to the next date
        return prev + 1;
      });
    }, speed);
    
    return () => clearInterval(interval);
  }, [isPlaying, speed, dateRange, dateArray.length]);

  // Species distribution for current date
  const speciesDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    sightData.forEach(s => {
      const sightingDate = s.timestamp.split('T')[0];
      if (sightingDate === dateArray[currentDateIndex]) {
        dist[s.species] = (dist[s.species] || 0) + 1;
      }
    });
    return Object.entries(dist).map(([species, count]) => ({ species, count, color: speciesColors[species] }));
  }, [sightData, dateArray, currentDateIndex, speciesColors]);

  const exportPDF = async () => {
    const elm = document.getElementById('main-container');
    if (!elm) return;
    const canvas = await html2canvas(elm, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save(`indian_ocean_analysis_${dateArray[currentDateIndex]}.pdf`);
  };

  const currentDate = dateArray[currentDateIndex] || '';

  return (
    <div 
      id="main-container" 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        backgroundColor: '#fdf2df' // creme background to match theme
      }}
    >
      {/* Header as a white card with rounded corners and subtle shadow */}
      <div style={{ padding: '24px' }}>
        <Card sx={{ borderRadius: 2.5, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', overflow: 'visible' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: 'white', borderRadius: 2.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  Indian Ocean Marine Observatory
                </h1>
                <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#455569' }}>
                  Real-time Environmental Data & Species Monitoring with eDNA Analysis
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  onClick={exportPDF}
                  sx={{
                    background: 'linear-gradient(90deg,#3b82f6,#2563eb)',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 8px 18px rgba(37,99,235,0.18)'
                  }}
                >
                  Export PDF
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Data Layers:</div>

              {/* prettier styling for the layer pills - only visual changes */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(layers).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setLayers(prev => ({ ...prev, [key]: !prev[key] }))}
                    style={{
                      border: val ? 'none' : `1px solid ${layerColors[key] || '#c7d2fe'}`,
                      background: val ? `linear-gradient(90deg, ${layerColors[key] || '#2563eb'}, ${shadeColor(layerColors[key] || '#2563eb', -12)})` : 'transparent',
                      color: val ? 'white' : (layerColors[key] || '#2563eb'),
                      padding: '8px 12px',
                      borderRadius: 9999,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: val ? '0 6px 18px rgba(15, 23, 42, 0.07)' : 'none',
                      transition: 'all 160ms ease'
                    }}
                    title={key}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '0 24px 16px 24px' }}>
        {/* Map Container */}
        <Card sx={{ flex: 1, overflow: 'hidden', backgroundColor: 'white', border: '1px solid #e6e9ee', borderRadius: 2 }}>
          <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
            <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
            <MapResizer />
            
            {/* Environmental Heatmaps */}
            {Object.entries(envData).map(([key, vals]) =>
              layers[key] && (
                <HeatmapLayer
                  key={key}
                  color={layerColors[key]}
                  variable={key}
                  data={vals
                    .filter(p => p.timestamp.startsWith(currentDate))
                    .map(p => [p.lat, p.lon, p.value])
                  }
                  opacity={0.8}
                />
              )
            )}
            
            {/* Ocean Currents */}
            {layers.Currents && currData.map((c, i) => (
              <Polyline 
                key={i} 
                positions={c.positions} 
                color="rgba(0, 206, 209, 0.9)" 
                weight={5}
                opacity={1.0}
              />
            ))}
            
            {/* Species Sightings */}
            {layers.Sightings && sightData
              .filter(s => s.timestamp.startsWith(currentDate))
              .map((s, i) => {
                const color = speciesColors[s.species] || '#666';
                const icon = L.divIcon({
                  html: `<div style="
                    background: ${color}; 
                    width: 28px; 
                    height: 28px; 
                    border-radius: 50%; 
                    border: 3px solid white;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                  ">${s.species.charAt(0)}</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                });
                
                return (
                  <Marker key={i} position={[s.lat, s.lon]} icon={icon}>
                    <Popup minWidth={320} maxWidth={400}>
                      <div style={{ fontFamily: 'Inter, sans-serif', padding: '12px' }}>
                        <div style={{ 
                          backgroundColor: color + '15', 
                          padding: '12px', 
                          borderRadius: '8px',
                          borderLeft: `4px solid ${color}`,
                          marginBottom: '12px'
                        }}>
                          <h3 style={{ margin: '0 0 8px 0', color: color, fontSize: '18px', fontWeight: '600' }}>
                            {s.species}
                          </h3>
                          <p style={{ margin: '0', fontStyle: 'italic', color: '#64748b', fontSize: '14px' }}>
                            {s.scientific}
                          </p>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <strong style={{ color: '#0f172a' }}>Count:</strong> {s.count}
                          </div>
                          <div>
                            <strong style={{ color: '#0f172a' }}>eDNA Count:</strong> {s.eDNAcount}
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <p style={{ margin: '4px 0', fontSize: '13px' }}>
                            <strong style={{ color: '#0f172a' }}>Sample ID:</strong> {s.specimenSample}
                          </p>
                          <p style={{ margin: '4px 0', fontSize: '13px' }}>
                            <strong style={{ color: '#0f172a' }}>Location:</strong> {s.lat.toFixed(4)}°, {s.lon.toFixed(4)}°
                          </p>
                          <p style={{ margin: '4px 0', fontSize: '13px' }}>
                            <strong style={{ color: '#0f172a' }}>Date:</strong> {new Date(s.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {s.eDNAsequence && (
                          <div style={{ 
                            backgroundColor: '#f8fafc', 
                            padding: '10px', 
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0' 
                          }}>
                            <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>
                              eDNA Sequence:
                            </p>
                            <code style={{ 
                              fontSize: '10px', 
                              wordBreak: 'break-all', 
                              color: '#475569',
                              lineHeight: '1.4'
                            }}>
                              {s.eDNAsequence}
                            </code>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            
            <MapClickHandler onSelect={(lat, lon, data) => setInfo({ lat, lon, data })} />
          </MapContainer>
        </Card>

        {/* Sidebar */}
        <Card sx={{ width: '450px', display: 'flex', flexDirection: 'column', border: '1px solid #e6e9ee', borderRadius: 2 }}>
          <CardContent sx={{ flex: 1, padding: '24px !important', overflowY: 'auto' }}>
            {!info ? (
              <>
                <Typography variant="h5" sx={{ marginBottom: '16px', color: '#0f172a', fontWeight: '600' }}>
                  Data Overview
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '24px', color: '#64748b', lineHeight: '1.6' }}>
                  Click anywhere on the map to analyze environmental data and view detailed time series for that oceanic location.
                </Typography>
                
                {speciesDistribution.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <Typography variant="h6" sx={{ marginBottom: '16px', color: '#0f172a', fontWeight: '600' }}>
                      Species Activity for {new Date(currentDate).toLocaleDateString()}
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={speciesDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="species" 
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          allowDecimals={false}
                          tick={{ fontSize: 11, fill: '#64748b' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="count" name="Sightings" radius={[4, 4, 0, 0]}>
                          {speciesDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <Card sx={{ backgroundColor: 'white', border: '1px solid #e6e9ee', borderRadius: 2 }}>
                  <CardContent sx={{ padding: '16px !important' }}>
                    <Typography variant="h6" sx={{ marginBottom: '12px', color: '#0f172a', fontWeight: '600' }}>
                      Dataset Summary
                    </Typography>
                    <div style={{ fontSize: '14px', color: '#475569' }}>
                      <p style={{ margin: '6px 0' }}>
                        • <strong><AnimatedNumber value={sightData.length} /></strong> species sightings with eDNA data
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        • <strong><AnimatedNumber value={Object.keys(envData).length} /></strong> environmental variables monitored
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        • <strong><AnimatedNumber value={currData.length} /></strong> ocean current vectors mapped
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        • <strong><AnimatedNumber value={dateArray.length} /></strong> days of temporal data
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card sx={{ marginBottom: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ padding: '16px !important' }}>
                    <Typography variant="h6" sx={{ marginBottom: '12px', color: '#0f172a', fontWeight: '600' }}>
                      Location Analysis
                    </Typography>
                    <div style={{ fontSize: '14px', color: '#475569' }}>
                      <p style={{ margin: '6px 0' }}>
                        <strong>Latitude:</strong> {info.lat.toFixed(6)}°
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        <strong>Longitude:</strong> {info.lon.toFixed(6)}°
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        <strong>Generated:</strong> {new Date(info.data.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Series Charts */}
                {Object.entries(info.data.timeSeries).map(([key, ts]) => (
                  <Card key={key} sx={{ marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ padding: '16px !important' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          marginBottom: '12px', 
                          color: layerColors[key],
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{
                          width: '12px',
                          height: '12px', 
                          backgroundColor: layerColors[key],
                          borderRadius: '2px'
                        }} />
                        {key} Analysis
                      </Typography>
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={ts} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            width={40}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value: any) => [value.toFixed(3), key]}
                          />
                          <Area 
                            type="monotone"
                            dataKey="value" 
                            stroke={layerColors[key]} 
                            fill={layerColors[key] + '20'}
                            strokeWidth={2}
                            dot={{ fill: layerColors[key], strokeWidth: 0, r: 3 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline Controls*/}
      <div style={{ flexShrink: 0, padding: '12px 24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <TimelineControls
          dateArray={dateArray}
          currentDateIndex={currentDateIndex}
          setCurrentDateIndex={setCurrentDateIndex}
          dateRange={dateRange}
          setDateRange={setDateRange}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
        />
    </div>
    </div>
  );
};

export default CrossDomain;

/**
 * Helper: small color shading utility used to produce a slightly darker gradient
 * purely for visual polish of active pills. Does not alter logic.
 */
function shadeColor(hex: string, percent: number) {
  // simple hex shade: percent negative => darker; positive => lighter
  const h = hex.replace('#','');
  const num = parseInt(h,16);
  let r = (num >> 16) + Math.round((percent/100)*255);
  let g = ((num >> 8) & 0x00FF) + Math.round((percent/100)*255);
  let b = (num & 0x0000FF) + Math.round((percent/100)*255);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ( (r<<16) | (g<<8) | b ).toString(16).padStart(6,'0');
}
