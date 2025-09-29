import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Cell
} from 'recharts';
import { Upload, Database, Eye, TrendingUp, RefreshCcw } from 'lucide-react';
import { mockDataEntries } from '../../data/mockData';

/** Animated count-up for metrics */
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({
  value,
  duration = 1000,
  className,
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const step = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const prog = Math.min(1, (t - startRef.current) / duration);
      const eased = Math.pow(prog, 0.75);
      setDisplay(Math.round(eased * value));
      if (prog < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
};

/** MetricCard */
const MetricCard: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  subtitle?: string;
  colorClass?: string;
}> = ({ icon: Icon, title, value, subtitle, colorClass = 'text-sky-600' }) => (
  <Card className="bg-white border border-slate-200 shadow-sm transform-gpu transition-all duration-220 hover:shadow-xl hover:-translate-y-1">
    <CardContent className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`text-2xl font-extrabold ${colorClass}`}>
            <AnimatedNumber value={value} />
          </p>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className="p-3 rounded-full bg-slate-50 shadow-sm flex items-center justify-center"
          aria-hidden
          style={{ minWidth: 56, minHeight: 56 }}
        >
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const InjectorDashboard: React.FC = () => {
  const myUploads = mockDataEntries.filter(
    entry => entry.uploadedBy === 'Dr. Marine Data Collector'
  );

  const [uploadStats, setUploadStats] = useState([
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 12 },
    { month: 'Dec', count: 15 },
    { month: 'Jan', count: 18 },
  ]);

  const [dataProcessing, setDataProcessing] = useState([
    { date: '10 Jan', processed: 85, pending: 15 },
    { date: '11 Jan', processed: 92, pending: 8 },
    { date: '12 Jan', processed: 78, pending: 22 },
    { date: '13 Jan', processed: 95, pending: 5 },
    { date: '14 Jan', processed: 88, pending: 12 },
  ]);

  const [views, setViews] = useState(847);

  const handleRefresh = () => {
    setUploadStats(prev =>
      prev.map(d => ({ ...d, count: Math.max(1, d.count + Math.round(Math.random() * 4 - 2)) }))
    );
    setDataProcessing(prev =>
      prev.map(d => ({
        ...d,
        processed: Math.min(100, Math.max(50, d.processed + Math.round(Math.random() * 6 - 3))),
        pending: Math.min(40, Math.max(0, d.pending + Math.round(Math.random() * 4 - 2))),
      }))
    );
    setViews(v => v + Math.round(Math.random() * 20 + 5));
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Injector Dashboard</h1>
          <p className="text-slate-600">Monitor your data contributions and analytics</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 shadow-lg hover:from-sky-700 hover:to-blue-700 active:scale-95 transition"
        >
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard icon={Upload} title="Total Uploads" value={4} colorClass="text-sky-600" />
        <MetricCard icon={Database} title="Data Size" value={462} subtitle="in MB" colorClass="text-blue-600" />
        <MetricCard icon={TrendingUp} title="Processing" value={1} colorClass="text-amber-600" />
        <MetricCard icon={Eye} title="Views" value={views} colorClass="text-rose-600" />
      </div>

      {/* Recent Uploads */}
      <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition mb-6">
        <CardHeader>
          <CardTitle>Recent Data Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myUploads.map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{entry.title}</h3>
                  <p className="text-sm text-slate-600">
                    {entry.type} • {entry.size} • {entry.uploadDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    entry.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : entry.status === 'processing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Upload Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={uploadStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                <XAxis dataKey="month" tick={{ fill: '#475569' }} />
                <YAxis tick={{ fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {uploadStats.map((_, idx) => (
                    <Cell
                      key={`bar-${idx}`}
                      fill={idx % 2 === 0 ? 'url(#grad1)' : 'url(#grad2)'}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dataProcessing}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                <XAxis dataKey="date" tick={{ fill: '#475569' }} />
                <YAxis tick={{ fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }}
                />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="#2563eb"
                  strokeWidth={2.2}
                  dot={false}
                  name="Processed"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  strokeWidth={2.2}
                  dot={false}
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
