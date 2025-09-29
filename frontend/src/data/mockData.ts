import type { User, DataEntry, SystemMetrics, Species, Project } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cmfri.gov.in',
    role: 'admin',
    name: 'System Administrator',
    status: 'active',
    lastLogin: '2024-01-15 10:30:00',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    username: 'injector1',
    email: 'data.injector@cmfri.gov.in',
    role: 'injector',
    name: 'Dr. Marine Data Collector',
    status: 'active',
    lastLogin: '2024-01-15 09:45:00',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    username: 'scientist1',
    email: 'marine.scientist@cmfri.gov.in',
    role: 'scientist',
    name: 'Dr. Ocean Research Scientist',
    status: 'active',
    lastLogin: '2024-01-15 11:20:00',
    createdAt: '2024-01-03'
  }
];

export const mockDataEntries: DataEntry[] = [
  {
    id: 'D001',
    title: 'Species Occurence - Goa ',
    type: 'biodiversity',
    uploadedBy: 'Dr. Marine Data Collector',
    uploadDate: '2024-01-14',
    size: '245 MB',
    status: 'completed',
    link: '/temp-storage/nio_goa_archived_data.zip'
  },
  {
    id: '2',
    title: 'Oceanographic Survey – Bay of Bengal',
    type: 'oceanographic',
    size: '5.1 MB',
    uploadDate: '2025-09-22',
    uploadedBy: 'NIOT Research Team',
    status: 'processing',
    link: '/downloads/oceanographic-bob.csv',
  },
  {
    id: '3',
    title: 'Fisheries Catch Data – Kerala Coast',
    type: 'fisheries',
    size: '3.7 MB',
    uploadDate: '2025-09-24',
    uploadedBy: 'ICAR-CMFRI',
    status: 'completed',
    link: '/downloads/fisheries-kerala.csv',
  },
  {
    id: '4',
    title: 'Species Occurrence – Andaman & Nicobar',
    type: 'biodiversity',
    size: '1.9 MB',
    uploadDate: '2025-09-25',
    uploadedBy: 'ZSI Team',
    status: 'completed',
    link: '/downloads/species-occurrence-andaman.csv',
  },
];

export const mockSystemMetrics: SystemMetrics = {
  totalUsers: 150,
  activeUsers: 89,
  dataEntries: 2847,
  systemHealth: 98.5,
  storageUsed: 85,
  processingQueue: 12
};

export const mockSpecies: Species[] = [
  {
    id: 'S001',
    name: 'Indian Mackerel',
    scientificName: 'Rastrelliger kanagurta',
    classification: 'Fish',
    habitat: 'Coastal waters',
    status: 'Stable',
    lastSeen: '2024-01-14'
  },
  {
    id: 'S002',
    name: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    classification: 'Reptile',
    habitat: 'Coral reefs',
    status: 'Endangered',
    lastSeen: '2024-01-12'
  },
  {
    id: 'S003',
    name: 'Staghorn Coral',
    scientificName: 'Acropora cervicornis',
    classification: 'Coral',
    habitat: 'Shallow reefs',
    status: 'Critical',
    lastSeen: '2024-01-10'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'P001',
    name: 'Deep Ocean Mission',
    description: 'Comprehensive deep-sea exploration and resource mapping',
    organization: 'MoES, GoI',
    status: 'active',
    startDate: '2021-06-01',
    participants: 250
  },
  {
    id: 'P002',
    name: 'INCOIS Marine Data Portal',
    description: 'Integrated marine data collection and dissemination platform',
    organization: 'INCOIS',
    status: 'active',
    startDate: '2020-01-01',
    participants: 180
  },
  {
    id: 'P003',
    name: 'OBIS India Node',
    description: 'Ocean Biodiversity Information System - India contribution',
    organization: 'CMFRI',
    status: 'active',
    startDate: '2019-03-01',
    participants: 95
  }
];

export const chartData = {
  dataTypes: [
    { name: 'Oceanographic', value: 45, color: '#0ea5e9' },
    { name: 'Fisheries', value: 35, color: '#22d3ee' },
    { name: 'Biodiversity', value: 20, color: '#06b6d4' }
  ],
  monthlyUploads: [
    { month: 'Jul', uploads: 120 },
    { month: 'Aug', uploads: 180 },
    { month: 'Sep', uploads: 150 },
    { month: 'Oct', uploads: 220 },
    { month: 'Nov', uploads: 190 },
    { month: 'Dec', uploads: 280 }
  ],
  systemPerformance: [
    { time: '00:00', cpu: 45, memory: 62, storage: 78 },
    { time: '04:00', cpu: 32, memory: 58, storage: 79 },
    { time: '08:00', cpu: 67, memory: 71, storage: 80 },
    { time: '12:00', cpu: 78, memory: 85, storage: 82 },
    { time: '16:00', cpu: 82, memory: 90, storage: 83 },
    { time: '20:00', cpu: 65, memory: 75, storage: 85 }
  ]
};