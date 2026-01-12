'use client';

import { useState, useRef, useEffect } from 'react';
import { PillInput, ToastContainer, useToast } from '@/components/DesignSystem';
import { Upload, Loader2, MessageSquare, Maximize2, Minimize2, Search, Clock, Plus, Users, Mic, Paperclip, Sparkles } from 'lucide-react';
import { JobDescription } from '@/types/job';
import { useRecruitOS } from '@/context/RecruitOSContext';

type ChatState = 'idle' | 'processing';

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
  isExpanded: boolean; // Kept for compatibility but unused for expansion now
  onToggleExpand: () => void; // Kept for compatibility
  onUpdateRightPanel?: (content: React.ReactNode) => void;
}

export default function ChatPanel({ isExpanded, onToggleExpand, onUpdateRightPanel }: ChatPanelProps) {
  const { navigateToApp, updateJobDraft, setPipelineHighlight } = useRecruitOS();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'I\'m your Hiring Assistant. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  }, []);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toasts, success, error, loading, removeToast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isProcessing]);

  const processUserMessage = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    setIsProcessing(true);

    // Simulate AI thinking "typing" effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // CO-PILOT LOGIC: Command Parser

    // 1. Job Creation
    if (lowerInput.includes('create job') || lowerInput.includes('new requisition') || lowerInput.includes('hire')) {
      navigateToApp('JOBS', 'WIZARD');
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I\'ve opened the Job Wizard in the workspace. Do you want to upload a transcript, or should I ask you scoping questions?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    // 2. Find Candidates (Sourcing)
    else if (lowerInput.includes('find candidates') || lowerInput.includes('matches') || lowerInput.includes('source')) {
      navigateToApp('PIPELINE');
      setPipelineHighlight('top-match'); // This will trigger the "Gold Glow"

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I found 3 strong matches in your existing database. I\'ve highlighted them in Gold on the Pipeline Board.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    // 3. Fallback / General Chat
    else {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I recieved your command. Updating the workspace...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsProcessing(false);
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

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    const fileMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date(),
      file: { name: file.name },
    };
    setMessages((prev) => [...prev, fileMessage]);

    // Simulate Parsing Delay (2s)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // "Magic Upload" Logic
    const dummyJob = {
      title: 'Senior Software Engineer',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      salary: '$140,000 - $160,000',
      location: 'Remote (US)',
      experience: '5+ years'
    };

    updateJobDraft(dummyJob);
    navigateToApp('JOBS', 'WIZARD');

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I\'ve extracted the requirements from your file. The Draft JD is ready on the left. Shall I post it?',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsProcessing(false);
    success('Job data extracted successfully');
  };

  // Zero State Action Cards - Refined for visibility
  const renderActionCards = () => (
    <div className="flex flex-col gap-2 px-1 pb-4">
      <p className="text-xs font-medium text-gray-500 mb-1 ml-1">Quick Actions</p>

      <button
        onClick={() => {
          setInput('Create New Requisition');
          handleSend();
        }}
        className="w-full flex items-center gap-3 p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-xl transition-all shadow-sm group text-left"
      >
        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 text-purple-600 transition-colors">
          <Plus size={16} />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-800 block">Create Requisition</span>
          <span className="text-[10px] text-gray-500">Draft new role with AI</span>
        </div>
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center gap-3 p-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all shadow-sm group text-left"
      >
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 text-blue-600 transition-colors">
          <Upload size={16} />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-800 block">Upload Sync</span>
          <span className="text-[10px] text-gray-500">Parse HM notes/audio</span>
        </div>
      </button>

      <button
        onClick={() => {
          setInput('Review Pending Candidates');
          handleSend();
        }}
        className="w-full flex items-center gap-3 p-3 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-xl transition-all shadow-sm group text-left"
      >
        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 text-green-600 transition-colors">
          <Users size={16} />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-800 block">Review Candidates</span>
          <span className="text-[10px] text-gray-500">Screen pending apps</span>
        </div>
      </button>
    </div>
  );

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div
        className="w-96 flex flex-col h-full border-l bg-white/50 backdrop-blur-xl border-white/20 shadow-xl"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/20 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Hiring Assistant</h2>
              <p className="text-[10px] text-purple-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex flex-col"
        >
          {/* Disclaimer / Intro */}
          <div className="text-center py-4 flex-shrink-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Today</p>
          </div>

          <div className="flex-1 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm'
                    }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p className={`text-[10px] mt-1.5 text-right ${message.role === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-purple-600" />
                  <span className="text-xs text-gray-500 font-medium">Thinking...</span>
                </div>
              </div>
            )}

            {/* Scroll target removed - handled by container scrollTo */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/20">
          {/* Zero State Cards (Only show if few messages) */}
          {messages.length < 3 && !isProcessing && renderActionCards()}

          {/* Input Area */}
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-200" />
            <div className="relative flex items-center p-2 gap-2">
              {/* File Upload Trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.mp3"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                title="Upload Context"
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400"
                disabled={isProcessing}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="p-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                <MessageSquare size={16} fill="currentColor" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">
            AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </>
  );
}
