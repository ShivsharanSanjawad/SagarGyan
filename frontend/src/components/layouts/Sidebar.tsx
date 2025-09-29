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
    <aside
      className={clsx(
        'w-64 min-h-screen flex flex-col',
        'bg-[#11283a]',
        'border-r border-[#0b1b26]',
        // keep a strong shadow for depth
        'shadow-lg',
        'text-slate-100'
      )}
      aria-label="Main navigation">
      {/* header */}
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden ring-0">
            <img
              src="/sidebarlogo.png"
              alt="Wave logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#23a6d9] leading-tight">SagarGyaan</h1>
            <p className="text-xs text-slate-300">Oceanographic Data Platform</p>
          </div>
        </div>
      </div>

      {/* user info */}
      <div className="px-4 mb-6 shrink-0">
        <div className="rounded-lg p-3 border border-[#0f2a3a] bg-[#0f2a3a]">
          <p className="text-sm font-medium text-slate-100">{user?.name || '—'}</p>
          <p className="text-xs text-slate-300 capitalize">{user?.role || 'user'}</p>
        </div>
      </div>

      {/* nav -*/}
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
                      ? 'bg-sky-600 text-white shadow-inner'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  )}
                  aria-current={isActive ? 'page' : undefined}>
                  <div
                    className={clsx(
                      'flex items-center justify-center w-6 h-6 rounded',
                      isActive ? 'bg-white/10' : ''
                    )}>
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

      {/* bottom */}
      <div className="p-4 border-t border-[#0b1b26] shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-[#0f2f45] hover:text-white transition-colors">
          <LogOut size={18} className="text-[#8fcbe6]" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
