'use client';

import { GlassCard } from '@/components/DesignSystem';

interface RightPanelProps {
  content: React.ReactNode;
}

export default function RightPanel({ content }: RightPanelProps) {
  if (!content) return null;

  return (
    <div className="w-[600px] p-2 flex-shrink-0">
      <GlassCard className="h-full flex flex-col">
        <div className="px-4 py-2.5 border-b border-white/40 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">
            Workspace
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="h-full">
            {content}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
