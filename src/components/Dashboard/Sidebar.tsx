'use client';

import { GlassCard } from '@/components/DesignSystem';
import { FileEdit, Users, Calendar, FileText } from 'lucide-react';

interface SidebarProps {
  selectedApp: string | null;
  onSelectApp: (app: string | null) => void;
}

interface AppItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;
}

export default function Sidebar({ selectedApp, onSelectApp }: SidebarProps) {
  const apps: AppItem[] = [
    { id: 'job-editor', name: 'Job Editor', icon: FileEdit },
    { id: 'candidates', name: 'Candidates', icon: Users },
    { id: 'scheduler', name: 'Scheduler', icon: Calendar },
    { id: 'offers', name: 'Offers', icon: FileText },
  ];

  return (
    <div className="w-52 p-2 flex-shrink-0">
      <GlassCard className="h-full flex flex-col">
        <div className="px-3 py-3 border-b border-white/40">
          <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>1WrkOS</h1>
          <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>AI Recruiter Workbench</p>
        </div>

        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          <div>
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
              Micro-Apps
            </h2>
            <ul className="space-y-0.5">
              {apps.map((app) => {
                const IconComponent = app.icon;
                const isSelected = selectedApp === app.id;
                return (
                  <li key={app.id}>
                    <button
                      onClick={() => onSelectApp(app.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 ${isSelected
                          ? 'bg-[#1A1A1A] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                        }`}
                    >
                      <IconComponent
                        size={16}
                        className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-500'}`}
                      />
                      <span className="text-xs font-medium">{app.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="px-2 py-2 border-t border-white/40">
          <div className="text-[10px] text-gray-500">
            <p className="font-medium">v0.1.0</p>
            <p className="text-[9px]">Prototype</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
