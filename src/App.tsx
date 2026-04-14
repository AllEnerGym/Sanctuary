import { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import WaterView from './components/WaterView';
import ActivityView from './components/ActivityView';
import ProfileView from './components/ProfileView';
import { useApp } from './components/AppContext';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, user, isLoading } = useApp();

  // 1. Initial Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-lowest">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 font-black text-outline uppercase tracking-widest text-xs">正在连接心流中心...</p>
      </div>
    );
  }

  // 2. Auth Gate: Show login screen if not logged in
  if (!user.isLoggedIn) {
    return <ProfileView />;
  }

  // 3. Main App after login
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'water':
        return <WaterView />;
      case 'activity':
        return <ActivityView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t.dashboard;
      case 'water':
        return t.water;
      case 'activity':
        return t.activity;
      case 'profile':
        return t.profile;
      default:
        return 'Sanctuary';
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={getTitle()}
    >
      {renderView()}
    </Layout>
  );
}
