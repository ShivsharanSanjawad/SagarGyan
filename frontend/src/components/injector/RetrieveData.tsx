import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Search, Filter, Eye, FolderOutput } from 'lucide-react';
import { mockDataEntries } from '../../data/mockData';

/* Small animated count-up for visual polish (same pattern used elsewhere) */
const AnimatedNumber: React.FC<{ value: number; duration?: number; className?: string }> = ({
  value,
  duration = 800,
  className,
}) => {
  const [display, setDisplay] = useState(0);

  React.useEffect(() => {
    let raf = 0 as number;
    let start: number | null = null;

    const step = (t: number) => {
      if (!start) start = t;
      const prog = Math.min(1, (t - start) / duration);
      const eased = Math.pow(prog, 0.78);
      setDisplay(Math.round(eased * value));
      if (prog < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
};

/* Color mapping: follow AdminDashboard palette (no green) */
const statusClass = (status: string) =>
  status === 'completed'
    ? 'bg-blue-100 text-blue-800'
    : status === 'processing'
    ? 'bg-amber-100 text-amber-800'
    : 'bg-rose-100 text-rose-800';

export const RetrieveData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'oceanographic' | 'fisheries' | 'biodiversity'>('all');

  const filteredData = useMemo(
    () =>
      mockDataEntries.filter((entry) => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || entry.type === selectedType;
        return matchesSearch && matchesType;
      }),
    [searchTerm, selectedType]
  );

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df] space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Retrieve Data</h1>
        <p className="text-slate-600">Search and access oceanographic datasets</p>
      </div>

      {/* Search controls (kept compact, styled to match theme) */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="px-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <label className="relative block">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </label>
            </div>

            <div>
              <label className="sr-only">Filter type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="block w-full rounded-lg border border-gray-300 text-slate-900 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition duration-150 ease-in-out"
              >
                <option value="all">All Types</option>
                <option value="oceanographic">Oceanographic</option>
                <option value="fisheries">Fisheries</option>
                <option value="biodiversity">Biodiversity</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Search Results ({filteredData.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No datasets found matching your criteria</p>
              </div>
            ) : (
              filteredData.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{entry.title}</h3>

                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                        <div>
                          <span className="font-medium text-slate-800">Type:</span> {entry.type}
                        </div>
                        <div>
                          <span className="font-medium text-slate-800">Size:</span> {entry.size}
                        </div>
                        <div>
                          <span className="font-medium text-slate-800">Upload Date:</span> {entry.uploadDate}
                        </div>
                        <div>
                          <span className="font-medium text-slate-800">Uploaded by:</span> {entry.uploadedBy}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col items-end">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusClass(entry.status)}`}>
                        {entry.status}
                      </span>

                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>

                        {/* Export as link-styled button to avoid nesting anchor inside button */}
                        <a
                          href={entry.link}
                          download
                          className="inline-flex items-center px-3 py-1 border rounded-md text-sm transition-all duration-150 hover:bg-slate-100 active:scale-95"
                        >
                          <FolderOutput className="h-4 w-4 mr-2" />
                          Export
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access (re-themed - avoid emerald green) */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-sky-50 rounded-lg">
              <h3 className="font-medium text-sky-900">Recent Uploads</h3>
              <p className="text-sm text-sky-700 mt-1">Last 7 days</p>
              <Button size="sm" variant="outline" className="mt-3">
                <Filter className="h-4 w-4 mr-2" />
                View Recent
              </Button>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium text-amber-900">Popular Datasets</h3>
              <p className="text-sm text-amber-700 mt-1">Most accessed</p>
              <Button size="sm" variant="outline" className="mt-3">
                <Filter className="h-4 w-4 mr-2" />
                View Popular
              </Button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">My Contributions</h3>
              <p className="text-sm text-purple-700 mt-1">Your uploads</p>
              <Button size="sm" variant="outline" className="mt-3">
                <Filter className="h-4 w-4 mr-2" />
                View Mine
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
