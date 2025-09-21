import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';

export const SystemManagement: React.FC = () => {
  const [performanceData, setPerformanceData] = useState([
    { time: '14:00', cpu: 25, memory: 45, network: 30 },
    { time: '15:00', cpu: 20, memory: 42, network: 25 },
    { time: '16:00', cpu: 55, memory: 68, network: 60 },
    { time: '17:00', cpu: 70, memory: 75, network: 80 },
    { time: '18:00', cpu: 85, memory: 82, network: 75 },
    { time: '19:00', cpu: 60, memory: 65, network: 45 },
  ]);

  const [storageData, setStorageData] = useState([
    { name: 'Oceanographic Data', value: 45, color: '#0ea5e9' },
    { name: 'Fisheries Data', value: 30, color: '#22d3ee' },
    { name: 'Biodiversity Data', value: 20, color: '#06b6d4' },
    { name: 'System Files', value: 5, color: '#64748b' },
  ]);

  const [diskIOData, setDiskIOData] = useState([
    { name: 'Disk Reads', value: 120 },
    { name: 'Disk Writes', value: 90 },
  ]);

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Storage usage above 80%', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'System backup completed successfully', time: '6 hours ago' },
    { id: 3, type: 'error', message: 'Failed to process 2 data uploads', time: '1 day ago' },
  ];

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleRefresh = () => {
    setPerformanceData(prev =>
      prev.map(d => ({
        ...d,
        cpu: Math.min(100, Math.max(0, d.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, d.memory + (Math.random() * 10 - 5))),
        network: Math.min(100, Math.max(0, d.network + (Math.random() * 10 - 5))),
      }))
    );

    setStorageData(prev =>
      prev.map(d => ({
        ...d,
        value: Math.max(5, d.value + (Math.random() * 5 - 2)),
      }))
    );

    setDiskIOData(prev =>
      prev.map(d => ({
        ...d,
        value: Math.max(50, d.value + (Math.random() * 20 - 10)),
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Management</h1>
          <p className="text-gray-600">Monitor system health and performance</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-sky-600 text-white px-4 py-2 shadow hover:bg-sky-700 active:scale-95 transition"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CPU Usage</p>
                <p className="text-2xl font-bold text-sky-600">72%</p>
                <p className="text-xs text-gray-500">4 cores active</p>
              </div>
              <Cpu className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Memory</p>
                <p className="text-2xl font-bold text-emerald-600">68%</p>
                <p className="text-xs text-gray-500">32GB total</p>
              </div>
              <Server className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-amber-600">85%</p>
                <p className="text-xs text-gray-500">2.4TB used</p>
              </div>
              <HardDrive className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Network</p>
                <p className="text-2xl font-bold text-purple-600">45 Mbps</p>
                <p className="text-xs text-gray-500">Bandwidth usage</p>
              </div>
              <Wifi className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance + Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance (hourly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#0ea5e9" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" name="Memory %" />
                <Line type="monotone" dataKey="network" stroke="#8b5cf6" name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disk IO Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Disk IO (Reads vs Writes)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="90%" height={250}>
                <PieChart>
                  <Pie
                    data={diskIOData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#0ea5e9"
                    label>
                    {diskIOData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#0ea5e9" : "#6366f1"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'error'
                        ? 'bg-red-50 border-red-400'
                        : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{alert.message}</p>
                      <span className="text-sm text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { service: 'Database Server', status: 'running', uptime: '99.9%' },
              { service: 'API Gateway', status: 'running', uptime: '99.8%' },
              { service: 'File Storage', status: 'running', uptime: '99.7%' },
              { service: 'Authentication', status: 'running', uptime: '99.9%' },
              { service: 'Analytics Engine', status: 'warning', uptime: '98.2%' },
              { service: 'Backup Service', status: 'running', uptime: '99.5%' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.service}</p>
                  <p className="text-sm text-gray-600">Uptime: {item.uptime}</p>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === 'running'
                        ? 'bg-green-500'
                        : item.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <Activity className="h-4 w-4 ml-2 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
