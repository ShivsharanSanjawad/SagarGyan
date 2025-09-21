import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Search, Eye, Microscope, Activity } from 'lucide-react';

export const ScientistDashboard: React.FC = () => {
  const recentAnalyses = [
    { date: '10 Jan', species: 12, classifications: 8 },
    { date: '11 Jan', species: 15, classifications: 11 },
    { date: '12 Jan', species: 9, classifications: 7 },
    { date: '13 Jan', species: 18, classifications: 14 },
    { date: '14 Jan', species: 21, classifications: 16 }
  ];

  const projectData = [
    { name: 'Deep Ocean', progress: 75 },
    { name: 'INCOIS Portal', progress: 92 },
    { name: 'OBIS India', progress: 68 },
    { name: 'Coral Survey', progress: 85 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Research Scientist Dashboard</h1>
        <p className="text-gray-600">Marine research and analysis overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Queries Run</p>
                <p className="text-2xl font-bold text-sky-600">127</p>
              </div>
              <Search className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visualizations</p>
                <p className="text-2xl font-bold text-emerald-600">89</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classifications</p>
                <p className="text-2xl font-bold text-purple-600">56</p>
              </div>
              <Microscope className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-amber-600">4</p>
              </div>
              <Activity className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Research Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg">
              <div>
                <h3 className="font-medium">Marine Species Classification</h3>
                <p className="text-sm text-gray-600">Analyzed 25 specimens from Kerala coast</p>
              </div>
              <span className="text-sm text-sky-600">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-stone-200 rounded-lg">
              <div>
                <h3 className="font-medium">Temperature Correlation Analysis</h3>
                <p className="text-sm text-gray-600">Cross-domain visualization completed</p>
              </div>
              <span className="text-sm text-slate-800">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <h3 className="font-medium">Biodiversity Report Generated</h3>
                <p className="text-sm text-gray-600">Comprehensive assessment for Arabian Sea</p>
              </div>
              <span className="text-sm text-emerald-600">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recentAnalyses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="species" stroke="#0ea5e9" name="Species Analyzed" />
                <Line type="monotone" dataKey="classifications" stroke="#8b5cf6" name="Classifications" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="progress" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};