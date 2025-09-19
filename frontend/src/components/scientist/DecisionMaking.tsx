import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { AlertTriangle, TrendingUp, Fish, Waves, MapPin } from 'lucide-react';

export const DecisionMaking: React.FC = () => {
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

  const decisions = [
    {
      id: 1,
      title: 'Fishing Restriction Recommendation',
      description: 'Recommend temporary fishing restrictions in oil spill affected areas',
      priority: 'high',
      status: 'pending',
      deadline: '2024-01-16'
    },
    {
      id: 2,
      title: 'Research Vessel Deployment',
      description: 'Deploy research vessel to study temperature anomaly in Bay of Bengal',
      priority: 'medium',
      status: 'approved',
      deadline: '2024-01-18'
    },
    {
      id: 3,
      title: 'Species Protection Protocol',
      description: 'Develop protection protocol for newly discovered deep-sea species',
      priority: 'medium',
      status: 'in_progress',
      deadline: '2024-01-25'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Decision-Making Module</h1>
        <p className="text-gray-600">Major events and decision support for marine management</p>
      </div>

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

      {/* Decision Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{decision.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{decision.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Deadline: {decision.deadline}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(decision.priority)}`}>
                      {decision.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(decision.status)}`}>
                      {decision.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm" variant="outline">Comment</Button>
                  {decision.status === 'pending' && (
                    <Button size="sm">Approve</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900">Critical Areas</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">3</p>
              <p className="text-sm text-red-700">Requiring immediate attention</p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-amber-900">Monitoring Zones</h3>
              <p className="text-2xl font-bold text-amber-600 mt-2">12</p>
              <p className="text-sm text-amber-700">Under active surveillance</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Protected Areas</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">28</p>
              <p className="text-sm text-green-700">Conservation status stable</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-900">Immediate Action Required</h4>
              <p className="text-sm text-blue-800 mt-1">
                Deploy oil spill containment measures within 24 hours to minimize ecosystem damage.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-medium text-purple-900">Research Opportunity</h4>
              <p className="text-sm text-purple-800 mt-1">
                Temperature anomaly presents unique study opportunity for climate impact research.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-900">Conservation Priority</h4>
              <p className="text-sm text-green-800 mt-1">
                Establish protected zone around new species discovery site before commercial activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};