import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ScatterChart, Scatter, ResponsiveContainer } from 'recharts';
import { BarChart3, Globe, Layers } from 'lucide-react';
import Interactive3DView from './interactive';

export const DataVisualization: React.FC = () => {
  const [activeView, setActiveView] = useState('individual');

  const tempData = [
    { month: 'Jan', surface: 24.2, mid: 22.8, deep: 18.5 },
    { month: 'Feb', surface: 25.1, mid: 23.2, deep: 18.7 },
    { month: 'Mar', surface: 26.8, mid: 24.5, deep: 19.2 },
    { month: 'Apr', surface: 28.5, mid: 26.1, deep: 20.1 },
    { month: 'May', surface: 29.2, mid: 27.3, deep: 21.0 },
    { month: 'Jun', surface: 27.8, mid: 25.9, deep: 20.5 },
  ];

  const crossDomainData = [
    { region: 'Arabian Sea', temp: 26.5, salinity: 35.2, fishCount: 150 },
    { region: 'Bay of Bengal', temp: 28.1, salinity: 34.8, fishCount: 220 },
    { region: 'Indian Ocean', temp: 27.3, salinity: 35.0, fishCount: 180 },
    { region: 'Coastal Waters', temp: 25.8, salinity: 34.5, fishCount: 280 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Visualization</h1>
        <p className="text-gray-600">Interactive charts and marine data analysis</p>
      </div>

        <CardContent className="p-0">
          <div className="flex w-full">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 flex items-center justify-center ${
                activeView === 'individual'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setActiveView('individual')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Individual
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 flex items-center justify-center ${
                activeView === 'cross-domain'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setActiveView('cross-domain')}
            >
              <Layers className="h-4 w-4 mr-2" />
              Cross-Domain
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 flex items-center justify-center ${
                activeView === '3d'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setActiveView('3d')}
            >
              <Globe className="h-4 w-4 mr-2" />
              3D Interactive
            </Button>
          </div>
        </CardContent>

      {/* Individual View */}
      {activeView === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Profile by Depth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tempData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="surface" stroke="#ef4444" name="Surface (°C)" />
                  <Line type="monotone" dataKey="mid" stroke="#f59e0b" name="Mid-water (°C)" />
                  <Line type="monotone" dataKey="deep" stroke="#3b82f6" name="Deep (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Temperature Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tempData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="surface" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Species Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { species: 'Tuna', count: 45, color: 'bg-sky-500' },
                  { species: 'Mackerel', count: 78, color: 'bg-emerald-500' },
                  { species: 'Sardine', count: 92, color: 'bg-purple-500' },
                  { species: 'Anchovy', count: 34, color: 'bg-amber-500' },
                ].map((item) => (
                  <div key={item.species} className="flex items-center justify-between">
                    <span className="font-medium">{item.species}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.count / 100) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Quality Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cross-Domain View */}
      {activeView === 'cross-domain' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Parameter Regional Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={crossDomainData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="temp" name="Temperature" unit="°C" />
                  <YAxis dataKey="salinity" name="Salinity" unit="psu" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="fishCount" fill="#0ea5e9" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossDomainData.map((region, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{region.region}</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

{/* 3D Interactive View */}
{activeView === '3d' && (
  <Card>
    <CardHeader>
      <CardTitle>Interactive 3D Segmentation Visualization</CardTitle>
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

{/* 3D Interactive View - Minimal */}
{activeView === '3d' && (
  <Card>
    <CardHeader>
      <CardTitle>Interactive 3D Segmentation Visualization</CardTitle>
    </CardHeader>
    <CardContent>
      <Interactive3DView activeView={activeView} />
    </CardContent>
  </Card>
      )}
    </div>
  );
};