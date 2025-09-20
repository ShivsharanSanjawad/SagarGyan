export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'injector' | 'scientist';
  name: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface DataEntry {
  id: string;
  title: string;
  type: 'oceanographic' | 'fisheries' | 'biodiversity';
  uploadedBy: string;
  uploadDate: string;
  size: string;
  status: 'processing' | 'completed' | 'failed';
  link: string
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  dataEntries: number;
  systemHealth: number;
  storageUsed: number;
  processingQueue: number;
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  classification: string;
  habitat: string;
  status: string;
  lastSeen: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  organization: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  participants: number;
}