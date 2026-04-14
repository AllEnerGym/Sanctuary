import React from 'react';
import { Bell, BellOff, LayoutDashboard, Droplets, Dumbbell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useApp } from './AppContext';
import { useToast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title: string;
}

export default function Layout({ children, activeTab, onTabChange, title }: LayoutProps) {
  const { settings, toggleNotifications, t } = useApp();
  const { showToast } = useToast();

  const tabs = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'water', label: t.water, icon: Droplets },
    { id: 'activity', label: t.activity, icon: Dumbbell },
    { id: 'profile', label: t.profile, icon: User },
  ];

  const handleNotificationToggle = () => {
    toggleNotifications();
    showToast(settings.notificationsEnabled ? '提醒已关闭' : '提醒已开启', 'info');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed-variant">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
              <img
                alt="用户头像"
                className="w-full h-full object-cover"
                src="https://picsum.photos/seed/user123/100/100"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="font-headline text-2xl font-semibold tracking-tight text-primary">
              {title}
            </h1>
          </div>
          <button 
            onClick={handleNotificationToggle}
            className={cn(
              "p-2 rounded-full transition-all active:scale-90",
              settings.notificationsEnabled ? "text-primary" : "text-outline"
            )}
          >
            {settings.notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-screen-xl mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-[48px] bg-background/80 backdrop-blur-xl shadow-[0px_-20px_40px_rgba(23,29,27,0.04)]">
        <div className="flex justify-around items-center px-8 pb-6 pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 transition-all active:scale-95",
                  isActive 
                    ? "bg-primary-container text-on-primary-container rounded-full px-6" 
                    : "text-primary/40"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                <span className="text-[10px] font-medium tracking-wide mt-1">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
