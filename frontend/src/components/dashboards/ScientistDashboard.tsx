import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Search,
  Eye,
  Microscope,
  Activity,
  RefreshCcw,
} from 'lucide-react';

/* AnimatedNumber: lightweight count-up for metrics */
const AnimatedNumber = ({ value, duration = 900, className }) => {
  const target = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = null;
    if (isNaN(target)) {
      setDisplay(0);
      return;
    }
    const step = (t) => {
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

  const formatted = Number.isNaN(display) ? String(value) : `${display}`;
  return <span className={className}>{formatted}</span>;
};

export const ScientistDashboard = () => {
  const [recentAnalyses, setRecentAnalyses] = useState([
    { date: '10 Jan', species: 12, classifications: 8 },
    { date: '11 Jan', species: 15, classifications: 11 },
    { date: '12 Jan', species: 9, classifications: 7 },
    { date: '13 Jan', species: 18, classifications: 14 },
    { date: '14 Jan', species: 21, classifications: 16 }
  ]);

  const [projectData, setProjectData] = useState([
    { name: 'Deep Ocean', progress: 75 },
    { name: 'INCOIS Portal', progress: 92 },
    { name: 'OBIS India', progress: 68 },
    { name: 'Coral Survey', progress: 85 }
  ]);

  const [metrics, setMetrics] = useState({
    queries: 127,
    visualizations: 89,
    classifications: 56,
    activeProjects: 4
  });

  const [recentActivity, setRecentActivity] = useState([
    { 
      id: 1,
      title: 'Marine Species Classification',
      description: 'Analyzed 25 specimens from Kerala coast',
      time: '2 hours ago',
      type: 'classification'
    },
    {
      id: 2,
      title: 'Temperature Correlation Analysis',
      description: 'Cross-domain visualization completed',
      time: '5 hours ago',
      type: 'analysis'
    },
    {
      id: 3,
      title: 'Biodiversity Report Generated',
      description: 'Comprehensive assessment for Arabian Sea',
      time: '1 day ago',
      type: 'report'
    }
  ]);

  const barGradId = 'sciBarGrad1';
  const barGradId2 = 'sciBarGrad2';

  const handleRefresh = () => {
    // Update metrics with small variations
    setMetrics(prev => ({
      queries: prev.queries + Math.floor(Math.random() * 5 + 1),
      visualizations: prev.visualizations + Math.floor(Math.random() * 3 + 1),
      classifications: prev.classifications + Math.floor(Math.random() * 4 + 1),
      activeProjects: Math.max(3, Math.min(6, prev.activeProjects + (Math.random() > 0.5 ? 1 : -1)))
    }));

    // Update analysis data - shift and add new point
    setRecentAnalyses(prev => {
      const dates = ['15 Jan', '16 Jan', '17 Jan', '18 Jan', '19 Jan'];
      const lastIdx = dates.findIndex(d => d === prev[prev.length - 1]?.date) + 1;
      const nextDate = dates[lastIdx] || '20 Jan';
      
      const newPoint = {
        date: nextDate,
        species: Math.floor(Math.random() * 15 + 8),
        classifications: Math.floor(Math.random() * 12 + 6)
      };
      return [...prev.slice(1), newPoint];
    });

    // Update project progress slightly
    setProjectData(prev => prev.map(p => ({
      ...p,
      progress: Math.min(100, Math.max(40, p.progress + (Math.random() * 8 - 4)))
    })));

    // Maybe add a new activity
    if (Math.random() > 0.6) {
      const activities = [
        { title: 'New Dataset Imported', description: 'Fisheries data from Tamil Nadu region', type: 'import' },
        { title: 'Statistical Model Updated', description: 'Improved accuracy for species prediction', type: 'model' },
        { title: 'Collaboration Request', description: 'Joint research proposal submitted', type: 'collaboration' }
      ];
      const newActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [
        { id: Date.now(), ...newActivity, time: 'just now' },
        ...prev.slice(0, 4)
      ]);
    }
  };

  const getActivityBg = (type) => {
    switch(type) {
      case 'classification': return 'bg-sky-50';
      case 'analysis': return 'bg-slate-50';
      case 'report': return 'bg-blue-50';
      case 'import': return 'bg-sky-50';
      case 'model': return 'bg-sky-50';
      case 'collaboration': return 'bg-blue-50';
      default: return 'bg-sky-50';
    }
  };

  const getActivityTextColor = (type) => {
    switch(type) {
      case 'classification': return 'text-sky-600';
      case 'analysis': return 'text-slate-600';
      case 'report': return 'text-blue-600';
      case 'import': return 'text-sky-600';
      case 'model': return 'text-sky-600';
      case 'collaboration': return 'text-blue-600';
      default: return 'text-sky-600';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research Scientist Dashboard</h1>
          <p className="text-slate-600">Marine research and analysis overview</p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 shadow hover:from-sky-700 hover:to-blue-700 active:scale-95 transition"
          aria-label="Refresh dashboard metrics"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Projects</p>
                <p className="text-2xl font-extrabold text-amber-600"><AnimatedNumber value={metrics.activeProjects} /></p>
                <p className="text-xs text-slate-400">In progress</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Queries Run</p>
                <p className="text-2xl font-extrabold text-sky-600"><AnimatedNumber value={metrics.queries} /></p>
                <p className="text-xs text-slate-400">This month</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Search className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Visualizations</p>
                <p className="text-2xl font-extrabold text-blue-600"><AnimatedNumber value={metrics.visualizations} /></p>
                <p className="text-xs text-slate-400">Created</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Classifications</p>
                <p className="text-2xl font-extrabold text-sky-600"><AnimatedNumber value={metrics.classifications} /></p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
              <div className="p-3 rounded-full bg-slate-50 shadow-sm">
                <Microscope className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-slate-200 shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Recent Research Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`flex items-center justify-between p-4 ${getActivityBg(activity.type)} rounded-lg border border-slate-100`}>
                <div>
                  <h3 className="font-medium text-slate-900">{activity.title}</h3>
                  <p className="text-sm text-slate-600">{activity.description}</p>
                </div>
                <span className={`text-sm ${getActivityTextColor(activity.type)} font-medium`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Analysis Trend (5-day window)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={recentAnalyses} margin={{ top: 8, right: 12, left: 0, bottom: 6 }}>
                  <defs>
                    <linearGradient id={barGradId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#bae6fd" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#e6f6ff" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                  <XAxis dataKey="date" tick={{ fill: '#475569' }} />
                  <YAxis tick={{ fill: '#475569' }} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }} />
                  <Line type="monotone" dataKey="species" stroke="#0ea5e9" strokeWidth={2.4} dot={false} name="Species Analyzed" isAnimationActive />
                  <Line type="monotone" dataKey="classifications" stroke="#2563eb" strokeWidth={2.4} dot={false} name="Classifications" isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={projectData} layout="horizontal" margin={{ top: 8, right: 12, left: 0, bottom: 6 }}>
                  <defs>
                    <linearGradient id={barGradId2} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#475569' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#475569' }} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e6edf3' }}
                    formatter={(value) => [`${value}%`, 'Progress']}
                  />
                  <Bar dataKey="progress" radius={[0, 8, 8, 0]} fill={`url(#${barGradId2})`} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};