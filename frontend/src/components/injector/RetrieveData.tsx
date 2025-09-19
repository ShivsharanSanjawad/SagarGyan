import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { mockDataEntries } from '../../data/mockData';

export const RetrieveData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredData = mockDataEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Retrieve Data</h1>
        <p className="text-gray-600">Search and access oceanographic datasets</p>
      </div>

        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 text-sky-900 px-4 py-1
    shadow-sm focus:outline-none focus:ring-2transition duration-150 ease-in-out">
                <option value="all">All Types</option>
                <option value="oceanographic">Oceanographic</option>
                <option value="fisheries">Fisheries</option>
                <option value="biodiversity">Biodiversity</option>
              </select>
            </div>
          </div>
        </CardContent>
      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No datasets found matching your criteria</p>
              </div>
            ) : (
              filteredData.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {entry.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Size:</span> {entry.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Upload Date:</span> {entry.uploadDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Uploaded by:</span> {entry.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
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
                  
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <Card>
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
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h3 className="font-medium text-emerald-900">Popular Datasets</h3>
              <p className="text-sm text-emerald-700 mt-1">Most accessed</p>
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