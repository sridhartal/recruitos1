'use client';

import { useState, useRef } from 'react';
import { GlassCard, PillInput, ToastContainer, useToast } from '@/components/DesignSystem';
import { Upload, FileText, Loader2, Users, FolderKanban, BarChart3 } from 'lucide-react';
import JobEditorCard, { JobDescription } from '@/components/JobEditor/JobEditorCard';
import { CandidateList } from '@/components/Candidates';
import { MatchedCandidate } from '@/services/candidateMatchingService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  file?: { name: string; content?: string };
}

interface ChatWindowProps {
  onUpdateRightPanel: (content: React.ReactNode) => void;
}

export default function ChatWindow({ onUpdateRightPanel }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m RecruitOS Bot. I can help you create job descriptions, find candidates, and manage your recruitment workflow. Upload a conversation file (.txt) or describe the job requirements.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, success, error, loading, removeToast } = useToast();
  const [currentJob, setCurrentJob] = useState<JobDescription | null>(null);
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    setIsProcessing(true);

    // Add file message to chat
    const fileMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date(),
      file: { name: file.name },
    };
    setMessages((prev) => [...prev, fileMessage]);

    // Add processing message
    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Processing file and extracting job information...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, processingMessage]);

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadData = await uploadResponse.json();

      // Parse job description
      const parseResponse = await fetch('/api/parse-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: uploadData.content }),
      });

      if (!parseResponse.ok) {
        throw new Error('Failed to parse job description');
      }

      const parseData = await parseResponse.json();
      const jobDescription: JobDescription = parseData.jobDescription;

      // Update processing message
      setMessages((prev) => prev.map(msg => 
        msg.id === processingMessage.id
          ? { ...msg, content: 'Job description extracted successfully! Check the right panel to review and edit.' }
          : msg
      ));

      setCurrentJob(jobDescription);
      // Display Job Editor in right panel
      onUpdateRightPanel(
        <JobEditorCard
          jobDescription={jobDescription}
          onSave={(savedJob) => {
            console.log('Job saved:', savedJob);
            setCurrentJob(savedJob);
            success(`Job description saved: ${savedJob.title}`);
            setMessages((prev) => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: `Job description saved: ${savedJob.title}`,
              timestamp: new Date(),
            }]);
          }}
          onPost={handlePostJob}
          onMatchCandidates={handleMatchCandidates}
        />
      );
    } catch (error) {
      console.error('Error processing file:', error);
      setMessages((prev) => prev.map(msg => 
        msg.id === processingMessage.id
          ? { ...msg, content: 'Sorry, I encountered an error processing the file. Please try again.' }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processUserMessage = async (userInput: string) => {
    // Check if the input looks like a job description request
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('create') || lowerInput.includes('job') || lowerInput.includes('hire')) {
      setIsProcessing(true);
      
      // Add processing message
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Extracting job information from your message...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, processingMessage]);

      try {
        // Parse job description from text
        const parseResponse = await fetch('/api/parse-job', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: userInput }),
        });

        if (parseResponse.ok) {
          const parseData = await parseResponse.json();
          const jobDescription: JobDescription = parseData.jobDescription;

          // Update processing message
          setMessages((prev) => prev.map(msg => 
            msg.id === processingMessage.id
              ? { ...msg, content: 'Job description extracted! Check the right panel to review and edit.' }
              : msg
          ));

          setCurrentJob(jobDescription);
          // Display Job Editor in right panel
          onUpdateRightPanel(
            <JobEditorCard
              jobDescription={jobDescription}
              onSave={(savedJob) => {
                console.log('Job saved:', savedJob);
                setCurrentJob(savedJob);
                success(`Job description saved: ${savedJob.title}`);
                setMessages((prev) => [...prev, {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: `Job description saved: ${savedJob.title}`,
                  timestamp: new Date(),
                }]);
              }}
              onPost={handlePostJob}
              onMatchCandidates={handleMatchCandidates}
            />
          );
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
      // Regular chat response
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: job,
          jobBoards: ['linkedin', 'naukri'], // Default to LinkedIn and Naukri
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post job');
      }

      const data = await response.json();
      removeToast(loadingToastId);

      if (data.success) {
        const successCount = data.summary.successful;
        const totalCount = data.summary.total;
        success(`Job posted successfully to ${successCount} out of ${totalCount} job boards!`);
        
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Job "${job.title}" has been posted to ${successCount} job board(s). You can now search for candidates.`,
          timestamp: new Date(),
        }]);
      } else {
        error('Failed to post job to some boards. Please try again.');
      }
    } catch (err) {
      removeToast(loadingToastId);
      error('Failed to post job. Please try again.');
      console.error('Error posting job:', err);
    }
  };

  const handleMatchCandidates = async (job: JobDescription) => {
    const loadingToastId = loading('Matching candidates from internal database...');
    
    try {
      const response = await fetch('/api/match-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: job }),
      });

      if (!response.ok) {
        throw new Error('Failed to match candidates');
      }

      const data = await response.json();
      removeToast(loadingToastId);

      setCandidates(data.candidates);
      success(`Found ${data.candidates.length} matching candidates!`);

      // Update right panel to show candidate list
      onUpdateRightPanel(
        <div className="space-y-4">
          <JobEditorCard
            jobDescription={job}
            onSave={(savedJob) => {
              setCurrentJob(savedJob);
              success(`Job description saved: ${savedJob.title}`);
            }}
            onPost={handlePostJob}
            onMatchCandidates={handleMatchCandidates}
          />
          <CandidateList
            candidates={data.candidates}
            onSearchWeb={handleSearchWeb}
            isSearching={isSearchingWeb}
          />
        </div>
      );

      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Found ${data.candidates.length} matching candidates from the internal database. You can search the web for more candidates.`,
        timestamp: new Date(),
      }]);
    } catch (err) {
      removeToast(loadingToastId);
      error('Failed to match candidates. Please try again.');
      console.error('Error matching candidates:', err);
    }
  };

  const handleSearchWeb = async () => {
    if (!currentJob) {
      error('Please create a job description first.');
      return;
    }

    setIsSearchingWeb(true);
    const loadingToastId = loading('Searching web for candidates...');

    try {
      const response = await fetch('/api/scrape-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: currentJob }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape candidates');
      }

      const data = await response.json();
      removeToast(loadingToastId);
      setIsSearchingWeb(false);

      // Merge external candidates with existing candidates
      const existingIds = new Set(candidates.map((c) => c.id));
      const newCandidates = data.candidates.filter(
        (c: MatchedCandidate) => !existingIds.has(c.id)
      );
      const updatedCandidates = [...candidates, ...newCandidates].sort(
        (a, b) => b.matchScore - a.matchScore
      );

      setCandidates(updatedCandidates);
      success(`Found ${newCandidates.length} new candidates from web search!`);

      // Update right panel
      onUpdateRightPanel(
        <div className="space-y-4">
          <JobEditorCard
            jobDescription={currentJob}
            onSave={(savedJob) => {
              setCurrentJob(savedJob);
              success(`Job description saved: ${savedJob.title}`);
            }}
            onPost={handlePostJob}
            onMatchCandidates={handleMatchCandidates}
          />
          <CandidateList
            candidates={updatedCandidates}
            onSearchWeb={handleSearchWeb}
            isSearching={isSearchingWeb}
          />
        </div>
      );

      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Found ${newCandidates.length} additional candidates from web search. Total candidates: ${updatedCandidates.length}.`,
        timestamp: new Date(),
      }]);
    } catch (err) {
      removeToast(loadingToastId);
      setIsSearchingWeb(false);
      error('Failed to search web for candidates. Please try again.');
      console.error('Error scraping candidates:', err);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex-1 flex flex-col min-w-0 w-full">
      {/* Chat Header */}
      <div className="p-4 pb-2 flex-shrink-0">
        <GlassCard className="p-3">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">
            Ask RecruitOS
          </h2>
        </GlassCard>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-2 min-h-0 relative z-10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
          >
            <div className={`max-w-[75%] p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300 ${
              message.role === 'user'
                ? 'bg-[#1A1A1A] text-white border border-white/20 backdrop-blur-xl'
                : 'bg-white/70 backdrop-blur-xl border border-white/50'
            }`}>
              <p className={`text-xs leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                {message.content}
              </p>
              <p className={`text-[10px] opacity-70 mt-1.5 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access CTAs */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const query = 'Find top candidates for my open positions';
                const userMessage: Message = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: query,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, userMessage]);
                await processUserMessage(query);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-white/50 text-xs font-medium text-gray-700 hover:text-gray-900 transition-all hover:shadow-sm"
            >
              <Users size={14} className="flex-shrink-0" />
              <span>Find Candidates</span>
            </button>
            <button
              onClick={async () => {
                const query = 'Show me my recruitment pipeline';
                const userMessage: Message = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: query,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, userMessage]);
                await processUserMessage(query);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-white/50 text-xs font-medium text-gray-700 hover:text-gray-900 transition-all hover:shadow-sm"
            >
              <FolderKanban size={14} className="flex-shrink-0" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={async () => {
                const query = 'Show recruitment insights and analytics';
                const userMessage: Message = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: query,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, userMessage]);
                await processUserMessage(query);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-white/50 text-xs font-medium text-gray-700 hover:text-gray-900 transition-all hover:shadow-sm"
            >
              <BarChart3 size={14} className="flex-shrink-0" />
              <span>Insights</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 pt-2 flex-shrink-0">
        <div className="flex items-end gap-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md flex-shrink-0"
            title="Upload .txt file"
          >
            {isProcessing ? (
              <Loader2 size={16} className="text-gray-600 animate-spin" />
            ) : (
              <Upload size={16} className="text-gray-600" />
            )}
          </label>
          <div className="flex-1 min-w-0">
            <PillInput
              placeholder="Type your message or upload a file..."
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
        
        {messages.some(msg => msg.file) && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-500 px-1">
            <FileText size={14} className="flex-shrink-0" />
            <span className="truncate">File uploaded: {messages.find(msg => msg.file)?.file?.name}</span>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
