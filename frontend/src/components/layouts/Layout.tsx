import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/authContext';

// Admin components
import { AdminDashboard } from '../dashboards/AdminDashboard';
import { UserManagement } from '../admin/UserManagement';
import { SystemManagement } from '../admin/SystemManagement';
import { Settings } from '../admin/Settings';

// Injector components
import { InjectorDashboard } from '../dashboards/InjectorDashboard';
import { RetrieveData } from '../injector/RetrieveData';
import { StoreData } from '../injector/StoreData';
import { DataVisualization } from '../shared/DataVisualisation';
import { Analytics } from '../injector/Analytics';

// Scientist components
import { ScientistDashboard } from '../dashboards/ScientistDashboard';
import { Classification } from '../scientist/Classification';
import { DecisionMaking } from '../scientist/DecisionMaking';
import { AnalyseSpecies } from '../scientist/AnalyseSpecies';
import { Projects } from '../scientist/Projects';
import { QuerySearch } from '../scientist/Query';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'users': return <UserManagement />;
        case 'system': return <SystemManagement />;
        case 'settings': return <Settings />;
        case 'docs': return window.location.href = 'http://localhost:8000/docs';  //api docs part
        default: return <AdminDashboard />;
      }
    } else if (user?.role === 'injector') {
      switch (activeTab) {
        case 'dashboard': return <InjectorDashboard />;
        case 'retrieve': return <RetrieveData />;
        case 'store': return <StoreData />;
        case 'visualize': return <DataVisualization />;
        case 'analytics': return <Analytics />;
        default: return <InjectorDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <ScientistDashboard />;
        case 'retrieve': return <RetrieveData />;
        case 'visualize': return <DataVisualization />;
        case 'classify': return <Classification />;
        case 'decisions': return <DecisionMaking />;
        case 'species': return <AnalyseSpecies />;
        case 'query': return <QuerySearch />;
        case 'projects': return <Projects />;
        default: return <ScientistDashboard />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};