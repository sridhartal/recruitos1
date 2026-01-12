'use client';

import { useState } from 'react';
import { AuroraBackground } from '@/components/DesignSystem';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import MinimizedChat from './MinimizedChat';
import CandidateDashboard from '@/components/Candidates/CandidateDashboard';
import CandidateFilters, { FilterState } from '@/components/Candidates/CandidateFilters';

export default function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [candidateFilters, setCandidateFilters] = useState<FilterState>({
    stage: 'all',
    minScore: 0,
    maxScore: 100,
    location: '',
    experienceMin: 0,
    experienceMax: 20,
    skills: [],
  });

  const handleNewChat = () => {
    setCurrentChatId(null);
    setRightPanelContent(null);
    setSelectedApp(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSelectedApp(null);
  };

  const handleSelectApp = (appId: string | null) => {
    setSelectedApp(appId);
    setRightPanelContent(null);
  };

  const handleMaximizeChat = () => {
    setSelectedApp(null);
  };

  const renderAppView = () => {
    switch (selectedApp) {
      case 'candidates':
        return (
          <CandidateDashboard
            onClose={() => setSelectedApp(null)}
            filters={candidateFilters}
            onFiltersChange={setCandidateFilters}
          />
        );
      case 'job-editor':
        return <div className="p-8 text-center text-gray-500">Job Editor - Coming Soon</div>;
      case 'scheduler':
        return <div className="p-8 text-center text-gray-500">Scheduler - Coming Soon</div>;
      case 'offers':
        return <div className="p-8 text-center text-gray-500">Active Pipeline - Coming Soon</div>;
      default:
        return null;
    }
  };

  const renderFilters = () => {
    switch (selectedApp) {
      case 'candidates':
        return (
          <CandidateFilters
            onFilterChange={setCandidateFilters}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuroraBackground>
      {selectedApp ? (
        // App Layout: Left (Chat History + Chat Window), Center (App with Tabs), Right (Filters)
        <div className="flex h-screen">
          {/* Left: Chat History (Top) + Chat Window (Bottom) */}
          <div className="w-80 flex flex-col flex-shrink-0 border-r border-white/40 bg-white/50 backdrop-blur-sm">
            {/* Chat History - Top */}
            <div className="flex-1 flex flex-col min-h-0 border-b border-white/40">
              <ChatSidebar
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                currentChatId={currentChatId}
                selectedApp={selectedApp}
                onSelectApp={handleSelectApp}
                showChatHistoryOnly={true}
              />
            </div>
            
            {/* Chat Window - Bottom */}
            <div className="h-96 flex-shrink-0">
              <MinimizedChat
                onMaximize={handleMaximizeChat}
                onUpdateRightPanel={() => {}}
              />
            </div>
          </div>

          {/* Center: Full Screen App with Tabs */}
          <div className="flex-1 flex flex-col min-w-0 bg-white/30 backdrop-blur-sm">
            {/* Tabs - Only show for candidates for now */}
            {selectedApp === 'candidates' && (
              <div className="flex-shrink-0 border-b border-white/40 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-1 px-4 py-2">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1A1A1A] text-white shadow-sm">
                    All Candidates
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 hover:text-gray-900 transition-all">
                    Shortlisted
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 hover:text-gray-900 transition-all">
                    Interviews
                  </button>
                </div>
              </div>
            )}

            {/* App Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {renderAppView()}
            </div>
          </div>

          {/* Right: Filters Panel */}
          {renderFilters() && (
            <div className="w-80 flex-shrink-0 border-l border-white/40 bg-white/50 backdrop-blur-sm">
              {renderFilters()}
            </div>
          )}
        </div>
      ) : (
        // Default Layout: Left Sidebar, Center Chat, Right Panel
        <div className="flex h-screen">
          {/* Left: Collapsible Sidebar with Chat History and Apps */}
          <ChatSidebar 
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            currentChatId={currentChatId}
            selectedApp={selectedApp}
            onSelectApp={handleSelectApp}
          />
          
          {/* Center: Chat Window */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="w-full h-full flex flex-col items-center">
              <div className="w-full max-w-4xl h-full flex flex-col">
                <ChatWindow 
                  onUpdateRightPanel={setRightPanelContent}
                />
              </div>
            </div>
          </div>
          
          {/* Right Panel - Only show when content exists */}
          {rightPanelContent && (
            <div className="w-[600px] p-2 flex-shrink-0">
              <div className="h-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-4 overflow-y-auto">
                {rightPanelContent}
              </div>
            </div>
          )}
        </div>
      )}
    </AuroraBackground>
  );
}
