import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ScatterChart, Scatter, ResponsiveContainer } from 'recharts';
import { TrendingUp, Map, Upload, Eye } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [activeView, setActiveView] = useState('sst');

  // Sea Surface Temperature data
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Analyze your uploaded oceanographic data</p>
      </div>

          <CardContent className="p-2">
      <div className="flex w-full">
        <Button
          variant="ghost"
          className={`flex-1 rounded-none border-b-2 ${
            activeView === 'sst'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
          }`}
          onClick={() => setActiveView('sst')}
        >
          SST Maps
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-none border-b-2 ${
            activeView === 'uploads'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
          }`}
          onClick={() => setActiveView('uploads')}
        >
          Upload Analytics
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-none border-b-2 ${
            activeView === 'correlation'
              ? 'border-sky-500 text-sky-600 font-semibold'
              : 'border-transparent text-gray-600 hover:text-sky-500'
          }`}
          onClick={() => setActiveView('correlation')}
        >
          Data Correlation
        </Button>
      </div>
    </CardContent>


      {/* SST Maps View */}
      {activeView === 'sst' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="px-6 py-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Temperature</p>
                    <p className="text-2xl font-bold text-sky-600">26.8°C</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-sky-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-6 py-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Data Points</p>
                    <p className="text-2xl font-bold text-emerald-600">247</p>
                  </div>
                  <Map className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-6 py-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Coverage Area</p>
                    <p className="text-2xl font-bold text-purple-600">1,250 km²</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sea Surface Temperature Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sstData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#0ea5e9" name="Temperature (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
          <CardHeader>
            <CardTitle>Temperature Distribution Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Image */}
              <div className="flex-shrink-0">
                <img 
                  src="/temperature.png" 
                  alt="Temperature Distribution Map"
                  className="w-auto h-80 object-cover rounded-lg shadow-md border border-gray-200"
                />
              </div>
              
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-lg font-medium text-blue-900 mb-1">Interactive SST Map</p>
                  <p className="text-blue-700">Arabian Sea Region - Temperature Distribution</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Minimum</p>
                    <p className="text-xl font-bold text-blue-800">24.2°C</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-amber-600 mb-1">Maximum</p>
                    <p className="text-xl font-bold text-amber-600">29.2°C</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Range</p>
                    <p className="text-xl font-bold text-green-800">5.0°C</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Std Deviation</p>
                    <p className="text-xl font-bold text-purple-800">1.8°C</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </>
      )}

      {/* Upload Analytics View */}
      {activeView === 'uploads' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Upload Count</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={uploadAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uploads" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Size Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={uploadAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="size" stroke="#10b981" name="Size (MB)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sky-600">2</p>
                  <p className="text-sm text-gray-600">Total Uploads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">280 MB</p>
                  <p className="text-sm text-gray-600">Total Size</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">140 MB</p>
                  <p className="text-sm text-gray-600">Avg Size</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">1/day</p>
                  <p className="text-sm text-gray-600">Avg Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Data Correlation View */}
      {activeView === 'correlation' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Temperature vs Salinity Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={dataCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="temp" name="Temperature" unit="°C" />
                  <YAxis dataKey="salinity" name="Salinity" unit="psu" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="salinity" fill="#0ea5e9" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Depth Profile Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="depth" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="salinity" stroke="#8b5cf6" name="Salinity (psu)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};