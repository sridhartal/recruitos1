'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { MessageSquare, Plus, Search, ChevronLeft, ChevronRight, Clock, Users, FileEdit, Calendar, FileText } from 'lucide-react';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface AppItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;
}

interface ChatSidebarProps {
  onNewChat: () => void;
  onSelectChat?: (chatId: string) => void;
  currentChatId?: string;
  selectedApp?: string | null;
  onSelectApp?: (app: string | null) => void;
  showAppsOnly?: boolean;
  showChatHistoryOnly?: boolean;
}

export default function ChatSidebar({
  onNewChat,
  onSelectChat,
  currentChatId,
  selectedApp,
  onSelectApp,
  showAppsOnly = false,
  showChatHistoryOnly = false
}: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const apps: AppItem[] = [
    { id: 'candidates', name: 'Candidate', icon: Users },
    { id: 'job-editor', name: 'Jobs', icon: FileEdit },
    { id: 'scheduler', name: 'Scheduler', icon: Calendar },
    { id: 'offers', name: 'Active pipeline', icon: FileText },
  ];

  // Mock chat history - in real app, this would come from a service/API
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: 'chat-1',
      title: 'Senior Python Developer',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      preview: 'Looking for a senior Python developer...',
    },
    {
      id: 'chat-2',
      title: 'Frontend Engineer Role',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      preview: 'Need a React developer with 5+ years...',
    },
    {
      id: 'chat-3',
      title: 'Full Stack Position',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      preview: 'Full stack engineer required...',
    },
  ]);

  const filteredHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (isCollapsed) {
    return (
      <div className="w-12 p-2 flex-shrink-0">
        <GlassCard className="h-full flex flex-col items-center py-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-md hover:bg-white/50 transition-colors mb-2"
            title="Expand sidebar"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
          <button
            onClick={onNewChat}
            className="p-2 rounded-md hover:bg-white/50 transition-colors"
            title="New chat"
          >
            <Plus size={18} className="text-gray-600" />
          </button>
        </GlassCard>
      </div>
    );
  }

  // If showing only chat history (when app is open)
  if (showChatHistoryOnly) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2.5 border-b border-white/40 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">Chat History</h2>
        </div>

        {/* Search */}
        <div className="px-2 py-2 border-b border-white/40 flex-shrink-0">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm bg-white/70"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0">
          <div className="space-y-1">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No chats found</p>
              </div>
            ) : (
              filteredHistory.map((chat) => {
                const isSelected = currentChatId === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat?.(chat.id)}
                    className={`w-full text-left p-2 rounded-md transition-all duration-200 ${isSelected
                      ? 'bg-[var(--primary-brand)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {chat.title}
                      </p>
                    </div>
                    <p className={`text-xs truncate mb-1 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                      {chat.preview}
                    </p>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className={`flex-shrink-0 ${isSelected ? 'text-white/50' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 p-2 flex-shrink-0">
      <GlassCard className="h-full flex flex-col">
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-white/40 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>1WrkOS</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-md hover:bg-white/50 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Apps Section - Moved to Top */}
        <div className="px-2 py-3 border-b border-white/40">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Apps
          </h2>
          <div className="space-y-1.5">
            {apps.map((app) => {
              const IconComponent = app.icon;
              const isSelected = selectedApp === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectApp?.(isSelected ? null : app.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isSelected
                    ? 'bg-[var(--primary-brand)] text-white shadow-md'
                    : 'text-gray-600 hover:bg-white/70 hover:text-gray-900 hover:shadow-sm'
                    }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                    }`}>
                    <IconComponent
                      size={18}
                      className={isSelected ? 'text-white' : 'text-gray-700'}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-2 py-2 border-b border-white/40 flex-shrink-0">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Chat
            </h2>
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--primary-brand)] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus size={16} className="flex-shrink-0" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-2 py-2 border-b border-white/40 flex-shrink-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm bg-white/70"
              />
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0">
            <div className="space-y-1">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No chats found</p>
                </div>
              ) : (
                filteredHistory.map((chat) => {
                  const isSelected = currentChatId === chat.id;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => onSelectChat?.(chat.id)}
                      className={`w-full text-left p-2 rounded-md transition-all duration-200 ${isSelected
                        ? 'bg-[var(--primary-brand)] text-white shadow-md'
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {chat.title}
                        </p>
                      </div>
                      <p className={`text-xs truncate mb-1 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                        {chat.preview}
                      </p>
                      <div className="flex items-center gap-1">
                        <Clock size={10} className={`flex-shrink-0 ${isSelected ? 'text-white/50' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                          {formatTime(chat.timestamp)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
