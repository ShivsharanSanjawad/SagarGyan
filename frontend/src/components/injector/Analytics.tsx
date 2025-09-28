import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, Map, Upload, Eye } from 'lucide-react';

/* small animated number used across dashboards for consistency */
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({
  value,
  duration = 900,
  className,
}) => {
  const [display, setDisplay] = React.useState(0);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    startRef.current = null;
    const step = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const prog = Math.min(1, (t - startRef.current) / duration);
      const eased = Math.pow(prog, 0.78);
      setDisplay(Math.round(eased * value));
      if (prog < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <span className={className}>{display}</span>;
};

export const Analytics: React.FC = () => {
  const [activeView, setActiveView] = useState<'sst' | 'uploads' | 'correlation'>('sst');

  const sstData = [
    { month: 'Jan', temp: 24.2, lat: 9.5, lon: 76.2 },
    { month: 'Feb', temp: 25.1, lat: 9.6, lon: 76.1 },
    { month: 'Mar', temp: 26.8, lat: 9.4, lon: 76.3 },
    { month: 'Apr', temp: 28.5, lat: 9.7, lon: 76.0 },
    { month: 'May', temp: 29.2, lat: 9.3, lon: 76.4 },
    { month: 'Jun', temp: 27.8, lat: 9.5, lon: 76.2 },
  ];

  const uploadAnalytics = [
    { date: '10 Jan', uploads: 5, size: 45 },
    { date: '11 Jan', uploads: 8, size: 67 },
    { date: '12 Jan', uploads: 3, size: 23 },
    { date: '13 Jan', uploads: 12, size: 89 },
    { date: '14 Jan', uploads: 7, size: 56 },
  ];

  const dataCorrelation = [
    { temp: 24.2, salinity: 35.1, depth: 10 },
    { temp: 25.8, salinity: 34.9, depth: 25 },
    { temp: 27.1, salinity: 34.7, depth: 50 },
    { temp: 26.5, salinity: 35.0, depth: 75 },
    { temp: 25.2, salinity: 35.2, depth: 100 },
  ];

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df]">
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-600">Analyze your uploaded oceanographic data</p>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm mb-6">
        <CardContent className="p-2">
          <div className="flex w-full">
            <button
              onClick={() => setActiveView('sst')}
              className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                activeView === 'sst'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-sky-500'
              }`}
              aria-pressed={activeView === 'sst'}
            >
              SST Maps
            </button>

            <button
              onClick={() => setActiveView('uploads')}
              className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                activeView === 'uploads'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-sky-500'
              }`}
              aria-pressed={activeView === 'uploads'}
            >
              Upload Analytics
            </button>

            <button
              onClick={() => setActiveView('correlation')}
              className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                activeView === 'correlation'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-sky-500'
              }`}
              aria-pressed={activeView === 'correlation'}
            >
              Data Correlation
            </button>
          </div>
        </CardContent>
      </Card>

      {activeView === 'sst' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Avg Temperature</p>
                    <p className="text-2xl font-extrabold text-sky-600">
                      <AnimatedNumber value={26.8} />°C
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-sky-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Data Points</p>
                    <p className="text-2xl font-extrabold text-sky-600">
                      <AnimatedNumber value={247} />
                    </p>
                  </div>
                  <Map className="h-8 w-8 text-sky-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Coverage Area</p>
                    <p className="text-2xl font-extrabold text-purple-600">
                      <AnimatedNumber value={1250} /> km²
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle>Sea Surface Temperature Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={sstData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                    <XAxis dataKey="month" tick={{ fill: '#475569' }} />
                    <YAxis tick={{ fill: '#475569' }} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#0ea5e9"
                      strokeWidth={2.2}
                      dot={false}
                      name="Temperature (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Temperature Distribution Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <img
                    src="/temperature.png"
                    alt="Temperature Distribution Map"
                    className="w-auto h-80 object-cover rounded-lg shadow-md border border-slate-100"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-lg font-medium text-slate-900 mb-1">SST Map Last Month</p>
                    <p className="text-slate-600">Arabian Sea Region — Temperature distribution overview</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-sky-50 border border-sky-100 p-4 rounded-lg">
                      <p className="text-sm text-sky-700 mb-1">Minimum</p>
                      <p className="text-xl font-bold text-sky-800">24.2°C</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                      <p className="text-sm text-amber-700 mb-1">Maximum</p>
                      <p className="text-xl font-bold text-amber-700">29.2°C</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg">
                      <p className="text-sm text-slate-700 mb-1">Range</p>
                      <p className="text-xl font-bold text-slate-800">5.0°C</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                      <p className="text-sm text-purple-700 mb-1">Std Dev</p>
                      <p className="text-xl font-bold text-purple-800">1.8°C</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeView === 'uploads' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Daily Upload Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  {/* Uploads BarChart — blue gradient */}
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={uploadAnalytics}>
                      <defs>
                        <linearGradient id="uploadsBlueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity={1} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                      <XAxis dataKey="date" tick={{ fill: '#475569' }} />
                      <YAxis tick={{ fill: '#475569' }} />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />

                      <Bar dataKey="uploads" radius={[8, 8, 8, 8]} fill="url(#uploadsBlueGrad)">
                        {uploadAnalytics.map((_, idx) => (
                          <Cell key={`bar-${idx}`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Data Size Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <LineChart data={uploadAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                      <XAxis dataKey="date" tick={{ fill: '#475569' }} />
                      <YAxis tick={{ fill: '#475569' }} />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                      <Line type="monotone" dataKey="size" stroke="#2563eb" strokeWidth={2.2} dot={false} name="Size (MB)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Upload Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sky-600">
                    <AnimatedNumber value={2} />
                  </p>
                  <p className="text-sm text-slate-600">Total Uploads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">280 MB</p>
                  <p className="text-sm text-slate-600">Total Size</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">140 MB</p>
                  <p className="text-sm text-slate-600">Avg Size</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">1/day</p>
                  <p className="text-sm text-slate-600">Avg Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeView === 'correlation' && (
        <>
          <Card className="bg-white border border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle>Temperature vs Salinity Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                    <XAxis dataKey="temp" name="Temperature" unit="°C" tick={{ fill: '#475569' }} />
                    <YAxis dataKey="salinity" name="Salinity" unit="psu" tick={{ fill: '#475569' }} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }}
                    />
                    <Scatter data={dataCorrelation} fill="#0ea5e9" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Depth Profile Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={dataCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                    <XAxis dataKey="depth" tick={{ fill: '#475569' }} />
                    <YAxis tick={{ fill: '#475569' }} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2.2} dot={false} name="Temperature (°C)" />
                    <Line type="monotone" dataKey="salinity" stroke="#8b5cf6" strokeWidth={2.2} dot={false} name="Salinity (psu)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
