import React from 'react';
import { useAuth } from '../../context/authContext';
import {
  BarChart3, Users, Database, Settings, Upload, Search, Eye, Activity,
  Microscope, Brain, FileSearch, Folder, LogOut
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
        { id: 'docs', label: 'API Docs', icon: Folder },
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
        { id: 'env', label: 'Environment Model', icon: Brain },
        { id: 'query', label: 'Query Engine', icon: Search },
        { id: 'projects', label: 'Projects', icon: Folder },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-slate-900/80 backdrop-blur-md text-slate-100 min-h-screen flex flex-col shadow-lg">
  {/* header */}
  <div className="p-6 shrink-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
        <img
          src="/sidebarlogo.png"
          alt="Wave logo"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-lg font-bold text-sky-400 leading-tight">SagarGyaan</h1>
        <p className="text-xs text-slate-300">Oceanographic Data Platform</p>
      </div>
    </div>
  </div>

  {/* user */}
  <div className="px-4 mb-6 shrink-0">
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-slate-700/60">
      <p className="text-sm font-medium">{user?.name}</p>
      <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
    </div>
  </div>

  {/* nav */}
  <ul className="space-y-2 flex-1 overflow-y-auto px-4 scrollbar-hide">
    {menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;
      return (
        <li key={item.id}>
          <button
            onClick={() => onTabChange(item.id)}
            className={clsx(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              isActive
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <div
              className={clsx(
                'flex items-center justify-center w-6 h-6 rounded',
                isActive ? 'bg-white/10' : ''
              )}
            >
              <Icon size={16} />
            </div>
            <span className="text-sm flex-1">{item.label}</span>
            {isActive && (
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-sky-100">
                Active
              </span>
            )}
          </button>
        </li>
      );
    })}
  </ul>

  {/* bottom actions */}
  <div className="p-4 border-t border-slate-800/50 shrink-0">
    <button
      onClick={logout}
      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
    >
      <LogOut size={18} />
      <span className="text-sm">Logout</span>
    </button>
  </div>
</div>

  );
};
