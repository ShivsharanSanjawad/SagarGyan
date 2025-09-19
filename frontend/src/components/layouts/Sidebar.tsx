import React from 'react';
import { useAuth } from '../../context/authContext';
import { 
  BarChart3, 
  Users, 
  Database, 
  Settings, 
  Upload,
  Search,
  Eye,
  Activity,
  Microscope,
  Brain,
  FileSearch,
  Folder,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'system', label: 'System Management', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else if (user?.role === 'injector') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'retrieve', label: 'Retrieve Data', icon: Search },
        { id: 'store', label: 'Store Data', icon: Upload },
        { id: 'visualize', label: 'Data Visualization', icon: Eye },
        { id: 'analytics', label: 'Analytics', icon: Database },
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'retrieve', label: 'Retrieve Data', icon: Search },
        { id: 'visualize', label: 'Data Visualization', icon: Eye },
        { id: 'classify', label: 'Classification', icon: Microscope },
        { id: 'decisions', label: 'Decision Making', icon: Brain },
        { id: 'species', label: 'Analyse Species', icon: FileSearch },
        { id: 'projects', label: 'Projects', icon: Folder },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sky-400">SagarDnyan</h1>
        <p className="text-sm text-gray-400 mt-1">Oceanographic Data Platform</p>
      </div>
      
      <div className="px-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                    activeTab === item.id 
                      ? 'bg-sky-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};