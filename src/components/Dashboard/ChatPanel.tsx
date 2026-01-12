'use client';

import { useState, useRef } from 'react';
import { PillInput, ToastContainer, useToast } from '@/components/DesignSystem';
import { Upload, Loader2, MessageSquare, Maximize2, Minimize2, Search, Clock } from 'lucide-react';
import JobEditorCard, { JobDescription } from '@/components/JobEditor/JobEditorCard';
import { MatchedCandidate } from '@/services/candidateMatchingService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  file?: { name: string; content?: string };
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface ChatPanelProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateRightPanel?: (content: React.ReactNode) => void;
}

export default function ChatPanel({ isExpanded, onToggleExpand, onUpdateRightPanel }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m 1WrkOS Bot. I can help you create job descriptions, find candidates, and manage your recruitment workflow. Upload a conversation file (.txt) or describe the job requirements.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, success, error, loading, removeToast } = useToast();
  const [currentJob, setCurrentJob] = useState<JobDescription | null>(null);
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [activities, setActivities] = useState<Array<{ id: string; action: string; timestamp: Date }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Mock chat history
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: 'chat-1',
      title: 'Senior Python Developer',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      preview: 'Looking for a senior Python developer...',
    },
    {
      id: 'chat-2',
      title: 'Frontend Engineer Role',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      preview: 'Need a React developer with 5+ years...',
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

  const processUserMessage = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('create') || lowerInput.includes('job') || lowerInput.includes('hire')) {
      setIsProcessing(true);
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Extracting job information from your message...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, processingMessage]);
      setActivities((prev) => [...prev, { id: Date.now().toString(), action: 'Job description extraction started', timestamp: new Date() }]);

      try {
        const parseResponse = await fetch('/api/parse-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userInput }),
        });

        if (parseResponse.ok) {
          const parseData = await parseResponse.json();
          const jobDescription: JobDescription = parseData.jobDescription;

          setMessages((prev) => prev.map(msg => 
            msg.id === processingMessage.id
              ? { ...msg, content: 'Job description extracted! Check the right panel to review and edit.' }
              : msg
          ));

          setCurrentJob(jobDescription);
          setActivities((prev) => [...prev, { id: Date.now().toString(), action: `Job "${jobDescription.title}" created`, timestamp: new Date() }]);
          
          if (onUpdateRightPanel) {
            onUpdateRightPanel(
              <JobEditorCard
                jobDescription={jobDescription}
                onSave={(savedJob) => {
                  setCurrentJob(savedJob);
                  success(`Job description saved: ${savedJob.title}`);
                  setActivities((prev) => [...prev, { id: Date.now().toString(), action: `Job "${savedJob.title}" saved`, timestamp: new Date() }]);
                }}
                onPost={handlePostJob}
                onMatchCandidates={handleMatchCandidates}
              />
            );
          }
        } else {
          throw new Error('Failed to parse job description');
        }
      } catch (error) {
        console.error('Error parsing job:', error);
        setMessages((prev) => prev.map(msg => 
          msg.id === processingMessage.id
            ? { ...msg, content: 'I understand. Let me help you with that. You can upload a conversation file or describe the job requirements in more detail.' }
            : msg
        ));
      } finally {
        setIsProcessing(false);
      }
    } else {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I understand. Let me help you with that. You can upload a conversation file (.txt) or describe the job requirements.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 500);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    await processUserMessage(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePostJob = async (job: JobDescription) => {
    const loadingToastId = loading('Posting job to job boards...');
    try {
      const response = await fetch('/api/post-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: job, jobBoards: ['linkedin', 'naukri'] }),
      });
      if (!response.ok) throw new Error('Failed to post job');
      const data = await response.json();
      removeToast(loadingToastId);
      if (data.success) {
        success(`Job posted successfully to ${data.summary.successful} job board(s)!`);
        setActivities((prev) => [...prev, { id: Date.now().toString(), action: `Job "${job.title}" posted to job boards`, timestamp: new Date() }]);
      }
    } catch (err) {
      removeToast(loadingToastId);
      error('Failed to post job. Please try again.');
    }
  };

  const handleMatchCandidates = async (job: JobDescription) => {
    const loadingToastId = loading('Matching candidates...');
    try {
      const response = await fetch('/api/match-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: job }),
      });
      if (!response.ok) throw new Error('Failed to match candidates');
      const data = await response.json();
      removeToast(loadingToastId);
      setCandidates(data.candidates);
      success(`Found ${data.candidates.length} matching candidates!`);
      setActivities((prev) => [...prev, { id: Date.now().toString(), action: `Matched ${data.candidates.length} candidates`, timestamp: new Date() }]);
    } catch (err) {
      removeToast(loadingToastId);
      error('Failed to match candidates. Please try again.');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }
    setIsProcessing(true);
    const fileMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date(),
      file: { name: file.name },
    };
    setMessages((prev) => [...prev, fileMessage]);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const parseResponse = await fetch('/api/parse-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: uploadData.content }),
        });
        if (parseResponse.ok) {
          const parseData = await parseResponse.json();
          const jobDescription: JobDescription = parseData.jobDescription;
          setCurrentJob(jobDescription);
          setActivities((prev) => [...prev, { id: Date.now().toString(), action: `Job "${jobDescription.title}" extracted from file`, timestamp: new Date() }]);
          if (onUpdateRightPanel) {
            onUpdateRightPanel(
              <JobEditorCard
                jobDescription={jobDescription}
                onSave={(savedJob) => {
                  setCurrentJob(savedJob);
                  success(`Job description saved: ${savedJob.title}`);
                }}
                onPost={handlePostJob}
                onMatchCandidates={handleMatchCandidates}
              />
            );
          }
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      error('Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isExpanded) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="flex h-screen">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-4 pb-2 flex-shrink-0 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Ask 1WrkOS</h2>
                <button
                  onClick={onToggleExpand}
                  className="p-2 rounded-md hover:bg-white/50 transition-colors"
                >
                  <Minimize2 size={18} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-2 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className="max-w-[75%] p-3 rounded-2xl"
                    style={{
                      backgroundColor: message.role === 'user' ? 'var(--primary-brand)' : 'var(--glass-surface)',
                      color: message.role === 'user' ? 'white' : 'var(--text-primary)',
                      border: message.role === 'user' ? 'none' : 'var(--glass-border)',
                      backdropFilter: message.role === 'user' ? 'none' : 'var(--glass-blur)'
                    }}
                  >
                    <p className="text-xs leading-relaxed">{message.content}</p>
                    <p 
                      className="text-[10px] opacity-70 mt-1.5"
                      style={{ 
                        color: message.role === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' 
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 pt-2 flex-shrink-0 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-end gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm border cursor-pointer transition-all flex-shrink-0"
                  style={{
                    background: 'var(--glass-surface)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-surface)'}
                >
                  {isProcessing ? (
                    <Loader2 size={16} style={{ color: 'var(--text-secondary)' }} className="animate-spin" />
                  ) : (
                    <Upload size={16} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </label>
                <div className="flex-1 min-w-0">
                  <PillInput
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onSearchClick={handleSend}
                    icon="send"
                    className="w-full"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activities Panel */}
          <div 
            className="w-80 flex-shrink-0 border-l backdrop-blur-sm"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              background: 'var(--glass-surface)',
              backdropFilter: 'var(--glass-blur)'
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Activities</h3>
            </div>
            <div className="overflow-y-auto p-4 space-y-2">
              {activities.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: 'var(--text-secondary)' }}>No activities yet</p>
              ) : (
                activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{activity.action}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Collapsed view
  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div 
        className="w-80 flex flex-col h-full border-l backdrop-blur-sm"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.5)',
          background: 'var(--glass-surface)',
          backdropFilter: 'var(--glass-blur)'
        }}
      >
        {/* Header */}
        <div className="p-3 pb-2 flex-shrink-0 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} style={{ color: 'var(--accent-teal)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Chat</h3>
            </div>
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-md hover:bg-white/50 transition-colors"
              title="Expand chat"
            >
              <Maximize2 size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Chat History - Top */}
        <div className="flex-1 flex flex-col min-h-0 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
          <div className="p-2 border-b flex-shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-md border focus:ring-1 focus:outline-none text-[10px]"
                style={{
                  background: 'var(--glass-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {filteredHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className="w-full text-left p-2 rounded-md mb-1 transition-all hover:bg-white/50"
                style={{
                  backgroundColor: currentChatId === chat.id ? 'var(--primary-brand)' : 'transparent',
                  color: currentChatId === chat.id ? 'white' : 'var(--text-primary)'
                }}
              >
                <p className="text-xs font-medium truncate">
                  {chat.title}
                </p>
                <p 
                  className="text-[10px] truncate mt-0.5"
                  style={{ 
                    color: currentChatId === chat.id ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' 
                  }}
                >
                  {chat.preview}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock 
                    size={8} 
                    style={{ color: currentChatId === chat.id ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)' }} 
                  />
                  <span 
                    className="text-[10px]"
                    style={{ color: currentChatId === chat.id ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)' }}
                  >
                    {formatTime(chat.timestamp)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window - Bottom */}
        <div className="h-64 flex-shrink-0 flex flex-col">
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {messages.slice(-3).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className="max-w-[85%] p-2 rounded-lg text-[10px]"
                  style={{
                    backgroundColor: message.role === 'user' ? 'var(--primary-brand)' : 'var(--glass-surface)',
                    color: message.role === 'user' ? 'white' : 'var(--text-primary)',
                    border: message.role === 'user' ? 'none' : 'var(--glass-border)'
                  }}
                >
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex-shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload-panel"
              />
                <label
                  htmlFor="file-upload-panel"
                  className="flex items-center justify-center w-7 h-7 rounded-full shadow-sm border cursor-pointer transition-all flex-shrink-0"
                  style={{
                    background: 'var(--glass-surface)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-surface)'}
                >
                  {isProcessing ? (
                    <Loader2 size={12} style={{ color: 'var(--text-secondary)' }} className="animate-spin" />
                  ) : (
                    <Upload size={12} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </label>
              <div className="flex-1 min-w-0">
                <PillInput
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onSearchClick={handleSend}
                  icon="send"
                  className="w-full"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
