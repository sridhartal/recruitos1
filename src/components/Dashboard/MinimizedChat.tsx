'use client';

import { useState, useRef } from 'react';
import { GlassCard, PillInput, ToastContainer, useToast } from '@/components/DesignSystem';
import { Upload, Loader2, MessageSquare, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  file?: { name: string; content?: string };
}

interface MinimizedChatProps {
  onMaximize: () => void;
  onUpdateRightPanel: (content: React.ReactNode) => void;
}

export default function MinimizedChat({ onMaximize, onUpdateRightPanel }: MinimizedChatProps) {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m 1WrkOS Bot. How can I help you?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, success, error, loading, removeToast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;
    // Basic send functionality - can be expanded
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="w-80 flex flex-col h-full">
        {/* Header */}
        <div className="p-3 pb-2 flex-shrink-0 border-b border-white/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-600" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Ask 1WrkOS</h3>
            </div>
            <button
              onClick={onMaximize}
              className="p-1.5 rounded-md hover:bg-white/50 transition-colors"
              title="Maximize chat"
            >
              <Maximize2 size={14} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages - Compact View */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0">
          {messages.slice(-3).map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className="max-w-[85%] p-2 rounded-lg text-[10px]"
                style={{
                  backgroundColor: message.role === 'user' ? 'var(--primary-brand)' : 'var(--glass-surface)',
                  color: message.role === 'user' ? 'white' : 'var(--text-primary)'
                }}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 pt-2 flex-shrink-0 border-t border-white/40">
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              className="hidden"
              id="file-upload-mini"
            />
            <label
              htmlFor="file-upload-mini"
              className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all flex-shrink-0"
              title="Upload file"
            >
              {isProcessing ? (
                <Loader2 size={14} className="text-gray-600 animate-spin" />
              ) : (
                <Upload size={14} className="text-gray-600" />
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
    </>
  );
}
