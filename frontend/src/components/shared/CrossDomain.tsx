// CrossDomain.tsx - Enhanced NOAA-style animated Indian Ocean dashboard with improved gradients and timeline logic

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
  Legend,
  Cell,
} from 'recharts';
import { Slider, Button, Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { PlayArrow, Pause, Speed, GetApp } from '@mui/icons-material';
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

// Enhanced Heatmap Layer with variable-specific gradients
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data, color, variable, opacity = 0.9 }) => {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  // Variable-specific gradient configurations
  const getGradientConfig = (varName: string) => {
    switch(varName) {
      case 'SST':
        return {
          0.0: '#2166ac', // Deep blue (cold)
          0.2: '#4393c3', // Light blue
          0.4: '#92c5de', // Pale blue
          0.5: '#d1e5f0', // Very pale blue
          0.6: '#fdbf6f', // Light orange
          0.7: '#fd8d3c', // Orange
          0.8: '#f03b20', // Red-orange
          0.9: '#bd0026', // Dark red
          1.0: '#800026'  // Deep red (hot)
        };
      case 'Salinity':
        return {
          0.0: '#f7fbff', // Almost white (low salinity)
          0.2: '#deebf7', // Very light blue
          0.4: '#c6dbef', // Light blue
          0.6: '#9ecae1', // Medium blue
          0.8: '#4292c6', // Blue
          1.0: '#08519c'  // Dark blue (high salinity)
        };
      case 'Chlorophyll':
        return {
          0.0: '#fff7ec', // Very light cream (low chlorophyll)
          0.3: '#fee8c8', // Light peach
          0.5: '#fdd49e', // Peach
          0.7: '#fdbb84', // Orange-peach
          0.8: '#fc8d59', // Orange
          0.9: '#e34a33', // Red-orange
          1.0: '#b30000'  // Dark red (high chlorophyll)
        };
      case 'pH':
        return {
          0.0: '#d7191c', // Red (acidic)
          0.2: '#fdae61', // Orange
          0.4: '#ffffbf', // Yellow (neutral)
          0.6: '#abd9e9', // Light blue
          0.8: '#74add1', // Blue
          1.0: '#2c7bb6'  // Dark blue (basic)
        };
      case 'Oxygen':
        return {
          0.0: '#a50026', // Dark red (low oxygen)
          0.2: '#d73027', // Red
          0.4: '#f46d43', // Orange
          0.6: '#fee08b', // Yellow
          0.8: '#c7e9b4', // Light green
          1.0: '#006837'  // Dark green (high oxygen)
        };
      case 'Nitrate':
        return {
          0.0: '#f7fcf5', // Very light green
          0.3: '#e5f5e0', // Light green
          0.5: '#c7e9c0', // Medium light green
          0.7: '#a1d99b', // Medium green
          0.8: '#74c476', // Green
          0.9: '#41ab5d', // Dark green
          1.0: '#238b45'  // Very dark green
        };
      case 'Phosphate':
        return {
          0.0: '#fcfbfd', // Almost white
          0.3: '#efedf5', // Very light purple
          0.5: '#dadaeb', // Light purple
          0.7: '#bcbddc', // Medium purple
          0.8: '#9e9ac8', // Purple
          0.9: '#807dba', // Dark purple
          1.0: '#54278f'  // Very dark purple
        };
      default:
        return {
          0.0: '#ffffcc', // Light yellow
          0.3: '#fed976', // Yellow
          0.5: '#fd8d3c', // Orange
          0.7: '#fc4e2a', // Red-orange
          0.9: '#e31a1c', // Red
          1.0: '#800026'  // Dark red
        };
    }
  };

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    if (!data.length) return;

    // Enhanced normalization for better color distribution
    const values = data.map(d => d[2]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;
    
    // Apply logarithmic scaling for better visual distribution
    const normalizedData = data.map(([lat, lon, val]) => {
      if (range === 0) return [lat, lon, 0.5];
      const normalized = (val - minValue) / range;
      // Apply power scaling for better visual density
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

// Timeline Component with corrected logic
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

  return (
    <Card sx={{ margin: '16px 24px 24px 24px', backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ padding: '20px !important' }}>
        {/* Current Date Display */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: '700', marginBottom: '4px' }}>
              {formattedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Current: Day {currentDateIndex + 1} of {dateArray.length} • {currentDate}
            </Typography>
          </div>
          
          {/* Play Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              variant="contained"
              startIcon={isPlaying ? <Pause /> : <PlayArrow />}
              onClick={() => setIsPlaying(!isPlaying)}
              sx={{ 
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' },
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: '600'
              }}
            >
              {isPlaying ? 'Pause Animation' : 'Play Animation'}
            </Button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Speed style={{ fontSize: '20px', color: '#64748b' }} />
              <input 
                type="range" 
                min="200" 
                max="2000" 
                step="100"
                value={speed} 
                onChange={e => setSpeed(Number(e.target.value))}
                style={{ 
                  width: '120px', 
                  height: '6px',
                  borderRadius: '3px',
                  background: '#e2e8f0',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '14px', minWidth: '60px', color: '#64748b' }}>
                {speed}ms
              </span>
            </div>
          </div>
        </div>

        {/* Range Selector  */}
        <Card 
          sx={{
            margin: '16px 24px 24px 24px', 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            padding: '28px 16px'
          }}
        >
          <CardContent>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',   // Ensures enough vertical space between sliders
              alignItems: 'stretch',
              width: '100%'
            }}>
              {/* Range Selector (Animation range) */}
              <div style={{ width: '100%' }}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>Set the date range for animation playback:</Typography>
                <Slider
                  value={dateRange}
                  onChange={(_, val) => setDateRange(val as [number, number])}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => dateArray[value]}
                  min={0}
                  max={dateArray.length - 1}
                  sx={{
                    color: '#10b981', height: '8px', mb: 2,
                    '& .MuiSlider-thumb': { width: 24, height: 24 }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '-8px', px: 1 }}>
                  <Typography fontSize={13}>{dateArray[dateRange[0]]}</Typography>
                  <Typography fontSize={13}>{dateArray[dateRange[1]]}</Typography>
                </Box>
              </div>

              {/* Current Date Navigation (manual date jump) */}
              <div style={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ bgcolor: '#EEF4FF', p: '2px 8px', borderRadius: '8px' }}>
                    <Typography sx={{ color: '#2563eb', fontWeight: 700, fontSize: 17 }}>📅 Current Date Navigation</Typography>
                  </Box>
                </Box>
                <Typography fontSize={14} color="text.secondary" mb={1}>
                  Navigate to specific date within selected range
                </Typography>
                <Slider
                  value={currentDateIndex}
                  onChange={(_, val) => setCurrentDateIndex(val as number)}
                  min={dateRange[0]}
                  max={dateRange[1]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => dateArray[value]}
                  sx={{
                    color: '#2563eb', height: '10px', mb: 2,
                    '& .MuiSlider-thumb': { width: 28, height: 28 }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '-8px', px: 1 }}>
                  <Typography fontSize={13}>{dateArray[dateRange[0]]}</Typography>
                  <Typography fontSize={13}>{dateArray[dateRange[1]]}</Typography>
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <div style={{ 
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div>
            <Typography variant="body2" sx={{ color: '#475569', fontWeight: '600', marginBottom: '4px' }}>
              📊 Current Status
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Viewing: {formattedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Animation: {isPlaying ? '▶️ Playing' : '⏸️ Paused'}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ color: '#475569', fontWeight: '600', marginBottom: '4px' }}>
              🎯 Range Info
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              From: {dateArray[dateRange[0]]}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              To: {dateArray[dateRange[1]]}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const CrossDomain: React.FC = () => {
  const DEFAULT_CENTER: [number, number] = [15.0, 75.0];
  const DEFAULT_ZOOM = 5;
  const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const ATTRIBUTION = 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics';

  const layerColors: Record<string, string> = {
    SST: '#d73027', Salinity: '#1a9850', Chlorophyll: '#2ca02c',
    pH: '#8856a7', Oxygen: '#2166ac', Nitrate: '#f46d43', Phosphate: '#a0522d'
  };

  const speciesColors: Record<string, string> = {
    'Blue Whale': '#d62728', 'Bottlenose Dolphin': '#2ca02c', 'Great White Shark': '#ff7f0e',
    'Loggerhead Turtle': '#1f77b4', 'Harbor Seal': '#9467bd'
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
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: 'white',
        padding: '16px 24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', letterSpacing: '-0.025em' }}>
              🌊 Indian Ocean Marine Observatory
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '16px', opacity: 0.8 }}>
              Real-time Environmental Data & Species Monitoring with eDNA Analysis
            </p>
          </div>
          
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={exportPDF}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              textTransform: 'none'
            }}
          >
            Export PDF
          </Button>
        </div>
        
        {/* Layer Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', marginRight: '8px' }}>Data Layers:</span>
          {Object.entries(layers).map(([key, val]) => (
            <Chip
              key={key}
              label={key}
              variant={val ? 'filled' : 'outlined'}
              onClick={() => setLayers(prev => ({ ...prev, [key]: !prev[key] }))}
              sx={{
                backgroundColor: val ? (layerColors[key] || '#3b82f6') : 'transparent',
                borderColor: layerColors[key] || '#3b82f6',
                color: val ? 'white' : (layerColors[key] || '#3b82f6'),
                '&:hover': { 
                  backgroundColor: val ? (layerColors[key] || '#3b82f6') + 'dd' : (layerColors[key] || '#3b82f6') + '20' 
                },
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px 24px 0 24px' }}>
        {/* Map Container */}
        <Card sx={{ flex: 1, overflow: 'hidden' }}>
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
        <Card sx={{ width: '450px', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, padding: '24px !important', overflowY: 'auto' }}>
            {!info ? (
              <>
                <Typography variant="h5" sx={{ marginBottom: '16px', color: '#0f172a', fontWeight: '600' }}>
                  📊 Data Overview
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '24px', color: '#64748b', lineHeight: '1.6' }}>
                  Click anywhere on the map to analyze environmental data and view detailed time series for that oceanic location.
                </Typography>
                
                {speciesDistribution.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <Typography variant="h6" sx={{ marginBottom: '16px', color: '#0f172a', fontWeight: '600' }}>
                      🐋 Species Activity for {new Date(currentDate).toLocaleDateString()}
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
                
                <Card sx={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ padding: '16px !important' }}>
                    <Typography variant="h6" sx={{ marginBottom: '12px', color: '#0f172a', fontWeight: '600' }}>
                      Dataset Summary
                    </Typography>
                    <div style={{ fontSize: '14px', color: '#475569' }}>
                      <p style={{ margin: '6px 0' }}>
                        • <strong>{sightData.length}</strong> species sightings with eDNA data
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        • <strong>{Object.keys(envData).length}</strong> environmental variables monitored
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        • <strong>{currData.length}</strong> ocean current vectors mapped
                      </p>
                      <p style={{ margin: '6px 0' }}>
                        • <strong>{dateArray.length}</strong> days of temporal data
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