'use client';

import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import MinimizedChat from './MinimizedChat';

interface AppLayoutProps {
  selectedApp: string | null;
  onSelectApp: (app: string | null) => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
  appContent: React.ReactNode;
  filtersContent?: React.ReactNode;
  tabs?: Array<{ id: string; label: string; content: React.ReactNode }>;
}

export default function AppLayout({
  selectedApp,
  onSelectApp,
  onNewChat,
  onSelectChat,
  currentChatId,
  appContent,
  filtersContent,
  tabs = []
}: AppLayoutProps) {
  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].id : null);

  return (
    <div className="flex h-screen">
      {/* Left: Chat History + Chat Window */}
      <div className="w-80 flex flex-col flex-shrink-0 border-r border-white/40">
        {/* Chat History - Top */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-white/40">
          <ChatSidebar
            onNewChat={onNewChat}
            onSelectChat={onSelectChat}
            currentChatId={currentChatId}
            selectedApp={selectedApp}
            onSelectApp={onSelectApp}
            showAppsOnly={false}
            showChatHistoryOnly={true}
          />
        </div>
        
        {/* Chat Window - Bottom */}
        <div className="h-96 flex-shrink-0">
          <MinimizedChat
            onMaximize={() => onSelectApp(null)}
            onUpdateRightPanel={() => {}}
          />
        </div>
      </div>

      {/* Center: Full Screen App with Tabs */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/30 backdrop-blur-sm">
        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex-shrink-0 border-b border-white/40 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-1 px-4 py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* App Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {tabs.length > 0 ? (
            tabs.find(tab => tab.id === activeTab)?.content || appContent
          ) : (
            appContent
          )}
        </div>
      </div>

      {/* Right: Filters Panel */}
      {filtersContent && (
        <div className="w-80 flex-shrink-0 border-l border-white/40 bg-white/50 backdrop-blur-sm">
          {filtersContent}
        </div>
      )}
    </div>
  );
}
