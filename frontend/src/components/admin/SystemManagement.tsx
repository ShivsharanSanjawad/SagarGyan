import React, { useEffect, useRef, useState } from 'react';
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
  Legend,
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

/* AnimatedNumber: lightweight count-up for metrics */
const AnimatedNumber: React.FC<{ value: number | string; duration?: number; className?: string }> = ({
  value,
  duration = 900,
  className,
}) => {
  const target = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const [display, setDisplay] = useState<number>(0);
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
      const elapsed = t - startRef.current;
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

  const formatted = Number.isNaN(display) ? String(value) : `${display}${typeof value === 'string' && String(value).includes('%') ? '%' : ''}`;
  return <span className={className}>{formatted}</span>;
};

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
    { name: 'Fisheries Data', value: 30, color: '#60a5fa' },
    { name: 'Biodiversity Data', value: 20, color: '#2563eb' },
    { name: 'System Files', value: 5, color: '#94a3b8' },
  ]);

  const [diskIOData, setDiskIOData] = useState([
    { name: 'Disk Reads', value: 120 },
    { name: 'Disk Writes', value: 90 },
  ]);

  // service status list with simulated uptime %
  const [services, setServices] = useState([
    { id: 'db', service: 'Database Server', status: 'running', uptime: 99.9 },
    { id: 'api', service: 'API Gateway', status: 'running', uptime: 99.8 },
    { id: 'fs', service: 'File Storage', status: 'running', uptime: 99.7 },
    { id: 'auth', service: 'Authentication', status: 'running', uptime: 99.9 },
    { id: 'analytics', service: 'Analytics Engine', status: 'warning', uptime: 98.2 },
    { id: 'backup', service: 'Backup Service', status: 'running', uptime: 99.5 },
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: 'warning', message: 'Storage usage approaching 85%', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'System backup completed successfully', time: '6 hours ago' },
    { id: 3, type: 'error', message: 'Failed to process 1 data upload', time: '1 day ago' },
  ]);

  // derived values
  const totalStoragePercent = Math.round(storageData.reduce((s, d) => s + d.value, 0));
  const lastPerf = performanceData[performanceData.length - 1] || performanceData[0];

  const barGradId = 'sysBarGrad1';
  const barGradId2 = 'sysBarGrad2';
  const diskGrad1 = 'diskGrad1';
  const diskGrad2 = 'diskGrad2';

  // Refresh logic: update values with small randomness and push a new datapoint for animation
  const handleRefresh = () => {
    // micro animation: add a new point shifted by 1 hour
    setPerformanceData((prev) => {
      const lastHour = prev[prev.length - 1];
      const nextHour = (h: string) => {
        const [hh] = h.split(':');
        let n = Number(hh) + 1;
        if (n >= 24) n = n - 24;
        return `${String(n).padStart(2, '0')}:00`;
      };
      const newPoint = {
        time: nextHour(lastHour.time),
        cpu: Math.round(Math.min(100, Math.max(0, lastHour.cpu + (Math.random() * 15 - 7)))),
        memory: Math.round(Math.min(100, Math.max(0, lastHour.memory + (Math.random() * 12 - 6)))),
        network: Math.round(Math.min(100, Math.max(0, lastHour.network + (Math.random() * 18 - 9)))),
      };
      const next = [...prev.slice(1), newPoint];
      return next;
    });

    setStorageData((prev) =>
      prev.map((d) => ({ ...d, value: Math.round(Math.max(1, Math.min(95, d.value + (Math.random() * 6 - 3)))) }))
    );

    setDiskIOData((prev) => prev.map((d) => ({ ...d, value: Math.max(10, Math.round(d.value + (Math.random() * 40 - 20))) })));

    // simulate an occasional alert appearing
    if (Math.random() > 0.65) {
      const id = Date.now();
      const types = ['info', 'warning', 'error'];
      const t = types[Math.floor(Math.random() * types.length)];
      const msg = t === 'info' ? 'Minor background job completed' : t === 'warning' ? 'Spike in ingestion rate' : 'Transient upload failure';
      setSystemAlerts(prev => [{ id, type: t, message: msg, time: 'just now' }, ...prev].slice(0, 6));
    }

    // randomly nudge service uptimes a bit
    setServices(prev => prev.map(s => ({
      ...s,
      uptime: Math.round(Math.max(90, Math.min(100, s.uptime + (Math.random() * 0.4 - 0.2)))*10)/10
    })));
  };

  // toggle status for demo: click status chip to cycle running -> warning -> down -> running
  const toggleServiceStatus = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      const map: Record<string, string> = { running: 'warning', warning: 'down', down: 'running' };
      return { ...s, status: map[s.status] || 'running' };
    }));
  };

  // small helpers
  const statusColor = (s: string) =>
    s === 'running' ? 'bg-emerald-100 text-emerald-800' : s === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800';

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Management</h1>
          <p className="text-slate-600">Monitor system health and performance</p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 shadow hover:from-sky-700 hover:to-blue-700 active:scale-95 transition"
          aria-label="Refresh system metrics"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">CPU Usage</p>
                <p className="text-2xl font-extrabold text-sky-600"><AnimatedNumber value={lastPerf.cpu} />%</p>
                <p className="text-xs text-slate-400">Cores active: 4</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Cpu className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Memory</p>
                <p className="text-2xl font-extrabold text-blue-600"><AnimatedNumber value={lastPerf.memory} />%</p>
                <p className="text-xs text-slate-400">32 GB</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Storage (avg)</p>
                <p className="text-2xl font-extrabold text-amber-600"><AnimatedNumber value={Math.round(totalStoragePercent / storageData.length)} />%</p>
                <p className="text-xs text-slate-400">~2.4 TB used</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <HardDrive className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Network</p>
                <p className="text-2xl font-extrabold text-purple-600"><AnimatedNumber value={lastPerf.network} /> Mbps</p>
                <p className="text-xs text-slate-400">Bandwidth usage</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Wifi className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>System Performance (hourly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={performanceData} margin={{ top: 8, right: 12, left: 0, bottom: 6 }}>
                  <defs>
                    <linearGradient id={barGradId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#bae6fd" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#e6f6ff" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id={barGradId2} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#eef2ff" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                  <XAxis dataKey="time" tick={{ fill: '#475569' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#475569' }} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                  <Line type="monotone" dataKey="cpu" stroke="#0ea5e9" strokeWidth={2.4} dot={false} isAnimationActive />
                  <Line type="monotone" dataKey="memory" stroke="#2563eb" strokeWidth={2.4} dot={false} isAnimationActive />
                  <Line type="monotone" dataKey="network" stroke="#7c3aed" strokeWidth={2.4} dot={false} isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Storage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={6}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1.2} />
                    ))}
                  </Pie>

                  {/* center label */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-slate-900" style={{ fontSize: 14, fontWeight: 700 }}>
                    {`${totalStoragePercent}%`}
                    <tspan x="50%" dy="1.4em" style={{ fontSize: 12, fontWeight: 500, fill: '#475569' }}>Total</tspan>
                  </text>

                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Disk IO (Reads vs Writes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={diskIOData} margin={{ top: 6, right: 6, left: -8, bottom: 6 }}>
                  <defs>
                    <linearGradient id={diskGrad1} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id={diskGrad2} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                  <XAxis dataKey="name" tick={{ fill: '#475569' }} />
                  <YAxis tick={{ fill: '#475569' }} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    {diskIOData.map((entry, idx) => (
                      <Cell key={`d-${idx}`} fill={idx % 2 === 0 ? `url(#${diskGrad1})` : `url(#${diskGrad2})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'error'
                      ? 'bg-rose-50 border-rose-400'
                      : alert.type === 'warning'
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-sky-50 border-sky-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900">{alert.message}</p>
                      <p className="text-sm text-slate-500 mt-1">{alert.time}</p>
                    </div>
                    <div className="ml-4 flex items-start">
                      <Activity className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              ))}
              {systemAlerts.length === 0 && <div className="text-slate-500 p-4">No alerts — systems nominal.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status - prettier, dynamic */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-lg flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{s.service}</p>
                    <p className="text-sm text-slate-500">Uptime <span className="font-medium text-slate-800">{s.uptime}%</span></p>
                  </div>

                  <button
                    onClick={() => toggleServiceStatus(s.id)}
                    className={`px-2 py-1 rounded-full text-xs ${s.status === 'running' ? 'bg-emerald-100 text-emerald-800' : s.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}
                    aria-label={`Toggle status for ${s.service}`}
                    title="Click to cycle status"
                  >
                    {s.status}
                  </button>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-white border border-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${s.uptime}%`,
                        background: s.status === 'running' ? 'linear-gradient(90deg,#10b981,#0ea5e9)' : s.status === 'warning' ? 'linear-gradient(90deg,#f59e0b,#f97316)' : 'linear-gradient(90deg,#ef4444,#fb7185)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
