'use client';

import { useState } from 'react';
import { GlassCard, Logo } from '@/components/DesignSystem';
import { Users, FileEdit, Calendar, FileText, ChevronLeft, ChevronRight, Settings, User } from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface AppMenuProps {
  selectedApp: string | null;
  onSelectApp: (app: string | null) => void;
}

export default function AppMenu({ selectedApp, onSelectApp }: AppMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const apps: AppItem[] = [
    { id: 'candidates', name: 'Candidate', icon: Users },
    { id: 'job-editor', name: 'Jobs', icon: FileEdit },
    { id: 'scheduler', name: 'Scheduler', icon: Calendar },
    { id: 'offers', name: 'Active pipeline', icon: FileText },
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 p-2 flex-shrink-0">
        <GlassCard className="h-full flex flex-col items-center py-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-md hover:bg-white/50 transition-colors mb-2"
            title="Expand menu"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
          {apps.map((app) => {
            const IconComponent = app.icon;
            const isSelected = selectedApp === app.id;
            return (
              <button
                key={app.id}
                onClick={() => onSelectApp(isSelected ? null : app.id)}
                className={`p-2 rounded-md mb-1 transition-colors ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
                title={app.name}
              >
                <IconComponent size={18} />
              </button>
            );
          })}
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-64 p-2 flex-shrink-0">
      <GlassCard className="h-full flex flex-col">
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-white/40 flex items-center justify-between">
          <Logo size="sm" className="flex-shrink-0" />
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-md hover:bg-white/50 transition-colors"
            title="Collapse menu"
          >
            <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Apps Section */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Apps
          </h2>
          <div className="space-y-1.5">
            {apps.map((app) => {
              const IconComponent = app.icon;
              const isSelected = selectedApp === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectApp(isSelected ? null : app.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'hover:bg-white/70 hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--primary-brand)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--text-primary)'
                  }}
                >
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 210, 193, 0.1)'
                    }}
                  >
                    <IconComponent 
                      size={18} 
                      style={{ color: isSelected ? 'white' : 'var(--accent-teal)' }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Settings & Profile */}
        <div className="px-2 py-3 border-t border-white/40">
          <div className="space-y-1.5">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/70 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              <div 
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(0, 210, 193, 0.1)' }}
              >
                <Settings size={18} style={{ color: 'var(--accent-teal)' }} />
              </div>
              <span className="text-sm font-semibold">Settings</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/70 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              <div 
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(0, 210, 193, 0.1)' }}
              >
                <User size={18} style={{ color: 'var(--accent-teal)' }} />
              </div>
              <span className="text-sm font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
