import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Upload, Database, Eye, TrendingUp } from 'lucide-react';
import { mockDataEntries } from '../../data/mockData';

export const InjectorDashboard: React.FC = () => {
  const myUploads = mockDataEntries.filter(entry => 
    entry.uploadedBy === 'Dr. Marine Data Collector'
  );

  const uploadStats = [
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 12 },
    { month: 'Dec', count: 15 },
    { month: 'Jan', count: 18 }
  ];

  const dataProcessing = [
    { date: '10 Jan', processed: 85, pending: 15 },
    { date: '11 Jan', processed: 92, pending: 8 },
    { date: '12 Jan', processed: 78, pending: 22 },
    { date: '13 Jan', processed: 95, pending: 5 },
    { date: '14 Jan', processed: 88, pending: 12 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Injector Dashboard</h1>
        <p className="text-gray-600">Monitor your data contributions and analytics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="px-6 py-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Uploads</p>
                <p className="text-2xl font-bold text-sky-600">{myUploads.length}</p>
              </div>
              <Upload className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Size</p>
                <p className="text-2xl font-bold text-emerald-600">462 MB</p>
              </div>
              <Database className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-amber-600">1</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Views</p>
                <p className="text-2xl font-bold text-purple-600">847</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Data Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myUploads.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="text-sm text-gray-600">
                    {entry.type} • {entry.size} • {entry.uploadDate}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    entry.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : entry.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={uploadStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataProcessing}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="processed" stroke="#10b981" name="Processed" />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};