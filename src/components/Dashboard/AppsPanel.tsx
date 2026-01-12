'use client';

import { GlassCard } from '@/components/DesignSystem';
import { FileEdit, Users, Calendar, FileText } from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  description: string;
}

interface AppsPanelProps {
  selectedApp: string | null;
  onSelectApp: (app: string | null) => void;
}

export default function AppsPanel({ selectedApp, onSelectApp }: AppsPanelProps) {
  const apps: AppItem[] = [
    {
      id: 'candidates',
      name: 'Candidate',
      icon: Users,
      description: 'Search and match candidates'
    },
    {
      id: 'job-editor',
      name: 'Jobs',
      icon: FileEdit,
      description: 'Create and edit job descriptions'
    },
    {
      id: 'scheduler',
      name: 'Scheduler',
      icon: Calendar,
      description: 'Manage interview schedules'
    },
    {
      id: 'offers',
      name: 'Active pipeline',
      icon: FileText,
      description: 'Generate offer letters'
    },
  ];

  return (
    <div className="w-64 p-2 flex-shrink-0">
      <GlassCard className="h-full flex flex-col">
        <div className="px-3 py-2.5 border-b border-white/40">
          <h2 className="text-sm font-semibold text-gray-900">Apps</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Workspace tools</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <div className="space-y-1.5">
            {apps.map((app) => {
              const IconComponent = app.icon;
              const isSelected = selectedApp === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectApp(isSelected ? null : app.id)}
                  className={`w-full text-left p-2.5 rounded-md transition-all duration-200 ${isSelected
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                    }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-md flex-shrink-0 ${isSelected ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                      <IconComponent
                        size={16}
                        className={isSelected ? 'text-white' : 'text-gray-600'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium mb-0.5 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {app.name}
                      </p>
                      <p className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                        {app.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
