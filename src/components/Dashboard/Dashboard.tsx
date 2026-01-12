'use client';

import { useState, useEffect } from 'react';
import { AuroraBackground } from '@/components/DesignSystem';
import { ArrowLeft } from 'lucide-react';
import AppMenu from './AppMenu';
import ChatPanel from './ChatPanel';
import MainDashboard from './MainDashboard';
import CandidateDashboard from '@/components/Candidates/CandidateDashboard';
import CandidateFilters, { FilterState } from '@/components/Candidates/CandidateFilters';
import JobDashboard from '@/components/Jobs/JobDashboard';
import SchedulerDashboard from '@/components/Scheduler/SchedulerDashboard';
import PipelineBoard from '@/components/Pipeline/PipelineBoard';
import { RecruitOSProvider, useRecruitOS, AppType } from '@/context/RecruitOSContext';

function DashboardContent() {
  const { activeApp, navigateToApp, viewMode } = useRecruitOS();
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode>(null);
  const [candidateFilters, setCandidateFilters] = useState<FilterState>({
    stage: 'all',
    minScore: 0,
    maxScore: 100,
    location: '',
    experienceMin: 0,
    experienceMax: 20,
    skills: [],
  });

  const handleSelectApp = (appId: string | null) => {
    // Map string IDs to AppType
    const appMap: Record<string, AppType> = {
      'candidates': 'CANDIDATES',
      'job-editor': 'JOBS',
      'scheduler': 'SCHEDULER',
      'offers': 'PIPELINE'
    };

    if (appId && appMap[appId]) {
      navigateToApp(appMap[appId]);
    } else {
      navigateToApp('DASHBOARD');
    }
  };

  const renderAppView = () => {
    switch (activeApp) {
      case 'CANDIDATES':
        return (
          <CandidateDashboard
            onClose={() => navigateToApp('DASHBOARD')}
            filters={candidateFilters}
            onFiltersChange={setCandidateFilters}
          />
        );
      case 'JOBS':
        return (
          <JobDashboard
            onCreateJob={() => {
              setIsChatExpanded(true);
            }}
          />
        );
      case 'SCHEDULER':
        return <SchedulerDashboard />;
      case 'PIPELINE':
        return <PipelineBoard />;
      default:
        return null; // Dashboard is handled separately
    }
  };

  const renderFilters = () => {
    switch (activeApp) {
      case 'CANDIDATES':
        return (
          <CandidateFilters
            onFilterChange={setCandidateFilters}
          />
        );
      default:
        return null;
    }
  };

  // If chat is expanded, show full screen chat
  if (isChatExpanded) {
    return (
      <AuroraBackground>
        <ChatPanel
          isExpanded={true}
          onToggleExpand={() => setIsChatExpanded(false)}
          onUpdateRightPanel={setRightPanelContent}
        />
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left: App Menu (Collapsible) - Hidden when app is selected */}
        {activeApp === 'DASHBOARD' ? (
          <AppMenu
            selectedApp={null}
            onSelectApp={handleSelectApp}
          />
        ) : (
          // Collapsed menu when app is selected
          <div className="w-16 p-2 flex-shrink-0">
            <div
              className="h-full backdrop-blur-xl rounded-2xl border p-2 flex flex-col items-center"
              style={{
                background: 'var(--glass-surface)',
                border: 'var(--glass-border)',
                backdropFilter: 'var(--glass-blur)'
              }}
            >
              <button
                onClick={() => navigateToApp('DASHBOARD')}
                className="p-2 rounded-md hover:bg-white/50 transition-colors mb-2"
                title="Back to dashboard"
              >
                <ArrowLeft size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>
        )}

        {/* Center: Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
          {activeApp !== 'DASHBOARD' ? (
            <>
              {/* App View with Tabs */}
              <div
                className="flex-1 flex flex-col min-w-0 backdrop-blur-sm h-full"
                style={{ background: 'var(--glass-surface)' }}
              >
                {/* Tabs */}
                {activeApp === 'CANDIDATES' && (
                  <div
                    className="flex-shrink-0 border-b backdrop-blur-sm"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      background: 'var(--glass-surface)'
                    }}
                  >
                    <div className="flex items-center gap-1 px-4 py-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm"
                        style={{ backgroundColor: 'var(--primary-brand)' }}
                      >
                        All Candidates
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/50"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Shortlisted
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/50"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Interviews
                      </button>
                    </div>
                  </div>
                )}

                {/* App Content */}
                <div className="flex-1 overflow-y-auto min-h-0 pb-32">
                  {renderAppView()}
                </div>
              </div>

              {/* Right: Filters Panel (only for candidates) */}
              {renderFilters() && (
                <div
                  className="w-80 flex-shrink-0 border-l backdrop-blur-sm"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'var(--glass-surface)',
                    backdropFilter: 'var(--glass-blur)'
                  }}
                >
                  {renderFilters()}
                </div>
              )}
            </>
          ) : (
            /* Landing Dashboard */
            <MainDashboard onSelectApp={handleSelectApp} />
          )}
        </div>

        {/* Right: Chat Panel (Always visible) */}
        <ChatPanel
          isExpanded={false}
          onToggleExpand={() => setIsChatExpanded(true)}
          onUpdateRightPanel={setRightPanelContent}
        />
      </div>
    </AuroraBackground>
  );
}

export default function Dashboard() {
  return (
    <RecruitOSProvider>
      <DashboardContent />
    </RecruitOSProvider>
  );
}
