import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { AlertTriangle, TrendingUp, Fish, Waves, MapPin } from 'lucide-react';

export const DecisionMaking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const majorEvents = [
    {
      id: 1,
      type: 'oil_spill',
      title: 'Oil Spill Alert - Mumbai Coast',
      description: 'Moderate oil spill detected 15 km off Mumbai coast. Marine life impact assessment ongoing.',
      location: 'Mumbai, Maharashtra',
      date: '2024-01-12',
      severity: 'high',
      impact: 'Marine ecosystem disruption, fishing restrictions in 20 km radius',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 2,
      type: 'migration',
      title: 'Tuna Migration Pattern Change',
      description: 'Unusual southward migration of yellowfin tuna observed earlier than seasonal pattern.',
      location: 'Arabian Sea',
      date: '2024-01-10',
      severity: 'medium',
      impact: 'Potential impact on fishing seasons, need for updated fishing advisories',
      icon: Fish,
      color: 'amber'
    },
    {
      id: 3,
      type: 'discovery',
      title: 'New Deep-Sea Species Discovered',
      description: 'Previously unknown bioluminescent fish species found at 2000m depth.',
      location: 'Deep Ocean Mission Site',
      date: '2024-01-08',
      severity: 'low',
      impact: 'Significant scientific discovery, need for habitat protection measures',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 4,
      type: 'temperature',
      title: 'Unusual Temperature Anomaly',
      description: 'Sea surface temperatures 2°C above seasonal average in Bay of Bengal.',
      location: 'Bay of Bengal',
      date: '2024-01-14',
      severity: 'medium',
      impact: 'Potential coral bleaching, fish behavior changes expected',
      icon: Waves,
      color: 'blue'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'amber': return 'text-amber-600';
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Decision-Making Module</h1>
        <p className="text-gray-600">Major events and decision support for marine management</p>
      </div>

      {/* Data Options */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Environmental Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === 'abundance'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setSelectedOption('abundance')}>
              Fish Abundance
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === 'temperature'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setSelectedOption('temperature')}>
              Temperature
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === 'migration'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setSelectedOption('migration')}>
              Migration Map
            </Button>
          </div>

          {/* Show Visual Only If Option Selected */}
          {selectedOption && (
            <div className="mt-6 border rounded-lg bg-gray-50 p-6 text-center">
              {selectedOption === 'abundance' && (
                <p className="text-gray-700">📊 Fish Abundance Visualization (chart/map goes here)</p>
              )}
              {selectedOption === 'temperature' && (
                <p className="text-gray-700">🌡️ Sea Surface Temperature Visualization (chart/map goes here)</p>
              )}
              {selectedOption === 'migration' && (
                <p className="text-gray-700">🗺️ Migration Map Visualization (map goes here)</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Major Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Major Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {majorEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className={`border rounded-lg p-4 ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${getIconColor(event.color)} mt-1`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.severity === 'high' ? 'bg-red-100 text-red-800' :
                          event.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.severity} priority
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location} • {event.date}
                        </div>
                        <div>
                          <p className="text-gray-700"><strong>Impact:</strong> {event.impact}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Generate Report</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
