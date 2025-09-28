import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Users, Database, Activity, Server } from 'lucide-react';
import { mockSystemMetrics, chartData } from '../../data/mockData';

/** AnimatedNumber: smooth 0 → value animation using requestAnimationFrame
 *  (keeps behavior identical; purely visual effect)
 */
const AnimatedNumber: React.FC<{ value: number | string; duration?: number; className?: string }> = ({
  value,
  duration = 1200,
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
      const eased = Math.pow(prog, 0.72);
      const cur = Math.round(eased * target);
      setDisplay(cur);
      if (prog < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  const formatted = Number.isNaN(display) ? String(value) : display.toLocaleString();
  return <span className={className}>{formatted}</span>;
};

/** MetricCard: same functionality as before — only visual changes:
 * - softer icon circle (light tint)
 * - hover lift + subtle scale
 * - color class still controls text/icon color
 */
const MetricCard: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  value: number | string;
  subtitle?: string;
  colorClass?: string;
}> = ({ icon: Icon, title, value, subtitle, colorClass = 'text-sky-600' }) => {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm transform-gpu transition-all duration-220 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className={`text-2xl font-extrabold ${colorClass}`}>
              <AnimatedNumber value={typeof value === 'number' ? value : Number(value)} />
            </p>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>

          <div
            className="p-3 rounded-full bg-slate-50 shadow-sm flex items-center justify-center"
            aria-hidden
            style={{ minWidth: 56, minHeight: 56 }}
          >
            {/* icon colored via colorClass so semantics preserved */}
            <Icon className={`h-6 w-6 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminDashboard: React.FC = () => {
  const metrics = mockSystemMetrics;

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600">System overview and management</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon={Users}
          title="Total Users"
          value={metrics.totalUsers}
          subtitle={`${metrics.activeUsers} active`}
          colorClass="text-sky-600"
        />
        <MetricCard
          icon={Database}
          title="Data Entries"
          value={metrics.dataEntries}
          subtitle="Total datasets"
          colorClass="text-blue-600"
        />
        <MetricCard
          icon={Activity}
          title="System Health"
          value={metrics.systemHealth}
          subtitle="All systems operational"
          colorClass="text-amber-600"
        />
        <MetricCard
          icon={Server}
          title="Storage Used"
          value={metrics.storageUsed}
          subtitle="Processing queue: 12"
          colorClass="text-rose-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transform transition-all duration-200">
          <CardHeader>
            <CardTitle>Data Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData.dataTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={104}
                    dataKey="value"
                    paddingAngle={6}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive
                  >
                    {chartData.dataTypes.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, background: '#ffffff', border: '1px solid #e6edf3' }}
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transform transition-all duration-200">
          <CardHeader>
            <CardTitle>Monthly Data Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={chartData.monthlyUploads} margin={{ top: 8, right: 6, left: -6, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                  <XAxis dataKey="month" tick={{ fill: '#475569' }} />
                  <YAxis tick={{ fill: '#475569' }} />
                  <Tooltip
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{ borderRadius: 8, background: '#fff', border: '1px solid #e6edf3' }}
                  />
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="uploads" radius={[8, 8, 8, 8]}>
                    {chartData.monthlyUploads.map((entry, idx) => (
                      <Cell key={`bar-${idx}`} fill={idx % 2 === 0 ? 'url(#g1)' : 'url(#g2)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance */}
      <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transform transition-all duration-200">
        <CardHeader>
          <CardTitle>System Performance (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer>
              <LineChart data={chartData.systemPerformance} margin={{ top: 8, right: 20, left: 0, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                <XAxis dataKey="time" tick={{ fill: '#475569' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569' }} />
                <Tooltip
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{ borderRadius: 8, background: '#fff', border: '1px solid #e6edf3' }}
                />
                <Legend verticalAlign="top" height={28} />
                <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2.2} dot={false} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#f59e0b" strokeWidth={2.2} dot={false} name="Memory %" />
                <Line type="monotone" dataKey="storage" stroke="#0ea5e9" strokeWidth={2.2} dot={false} name="Storage %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
