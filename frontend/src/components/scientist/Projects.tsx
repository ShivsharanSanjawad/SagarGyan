import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Folder, Users, Calendar, TrendingUp, Search, Eye, FileText } from 'lucide-react';
import { mockProjects } from '../../data/mockData';

export const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const projectDetails = {
    'P001': {
      objectives: [
        'Map deep-sea biodiversity in Indian Ocean',
        'Assess mineral resources potential',
        'Develop sustainable exploration technologies'
      ],
      milestones: [
        { name: 'Phase 1: Survey Planning', completion: 100, date: '2021-12-01' },
        { name: 'Phase 2: Deep-sea Mapping', completion: 85, date: '2023-06-01' },
        { name: 'Phase 3: Resource Assessment', completion: 60, date: '2024-12-01' },
      ],
      publications: 12,
      datasets: 45,
      collaborators: ['NIOT', 'INCOIS', 'ESSO', 'Various Universities']
    },
    'P002': {
      objectives: [
        'Centralized marine data repository',
        'Real-time oceanographic monitoring',
        'Public data access portal'
      ],
      milestones: [
        { name: 'Infrastructure Setup', completion: 100, date: '2020-06-01' },
        { name: 'Data Integration', completion: 95, date: '2022-03-01' },
        { name: 'Portal Enhancement', completion: 80, date: '2024-06-01' },
      ],
      publications: 8,
      datasets: 128,
      collaborators: ['IMD', 'CMFRI', 'NIO', 'State Fisheries Departments']
    },
    'P003': {
      objectives: [
        'Indian ocean biodiversity documentation',
        'Global database contribution',
        'Species distribution mapping'
      ],
      milestones: [
        { name: 'Data Standardization', completion: 100, date: '2019-09-01' },
        { name: 'Species Cataloging', completion: 75, date: '2023-01-01' },
        { name: 'Global Integration', completion: 70, date: '2024-03-01' },
      ],
      publications: 15,
      datasets: 67,
      collaborators: ['UNESCO', 'Global OBIS Network', 'Regional Universities']
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Research Projects</h1>
        <p className="text-gray-600">Explore ongoing marine research initiatives and collaborations</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search projects by name, organization, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              All Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-sky-600">
                  {mockProjects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Folder className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {mockProjects.reduce((sum, p) => sum + p.participants, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-purple-600">3.2 years</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Organization</p>
                        <p className="font-medium">{project.organization}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Participants</p>
                        <p className="font-medium">{project.participants} researchers</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {selectedProject === project.id ? 'Hide Details' : 'View Details'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Team
                  </Button>
                </div>

                {/* Project Details Expansion */}
                {selectedProject === project.id && projectDetails[project.id as keyof typeof projectDetails] && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Project Objectives</h4>
                        <ul className="space-y-2 text-sm">
                          {projectDetails[project.id as keyof typeof projectDetails].objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Key Collaborators</h4>
                        <div className="flex flex-wrap gap-2">
                          {projectDetails[project.id as keyof typeof projectDetails].collaborators.map((collab, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {collab}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Project Milestones</h4>
                      <div className="space-y-3">
                        {projectDetails[project.id as keyof typeof projectDetails].milestones.map((milestone, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{milestone.name}</span>
                                <span className="text-xs text-gray-500">{milestone.completion}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-sky-600 h-2 rounded-full" 
                                  style={{ width: `${milestone.completion}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 w-20">{milestone.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">
                          {projectDetails[project.id as keyof typeof projectDetails].publications}
                        </p>
                        <p className="text-xs text-green-800">Publications</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">
                          {projectDetails[project.id as keyof typeof projectDetails].datasets}
                        </p>
                        <p className="text-xs text-blue-800">Datasets</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-lg font-bold text-purple-600">{project.participants}</p>
                        <p className="text-xs text-purple-800">Team Members</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};