'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { Calendar, Clock, CheckCircle2, AlertCircle, Video, MapPin, User, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface SchedulerDashboardProps { }

export default function SchedulerDashboard({ }: SchedulerDashboardProps) {
    const [activeTab, setActiveTab] = useState<'calendar' | 'feedback'>('calendar');

    // Mock Data
    const upcomingInterviews = [
        { id: 1, candidate: 'John Smith', role: 'Senior Python Developer', time: '10:00 AM', type: 'Video', interviewer: 'Sarah Chen' },
        { id: 2, candidate: 'Maria Garcia', role: 'Product Designer', time: '2:00 PM', type: 'In-person', interviewer: 'Mike Ross' },
    ];

    const pendingFeedback = [
        { id: 1, candidate: 'Alex Wong', role: 'Backend Engineer', date: 'Yesterday', interviewer: 'David Kim', status: 'Missing' },
        { id: 2, candidate: 'Sarah Jones', role: 'Frontend Developer', date: '2 days ago', interviewer: 'Emily Davis', status: 'Pending' },
    ];

    return (
        <div className="flex h-full">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="p-6 border-b border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Schedule</h2>
                        <div className="flex bg-white/30 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('calendar')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'calendar' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600 hover:bg-white/50'}`}
                            >
                                Calendar
                            </button>
                            <button
                                onClick={() => setActiveTab('feedback')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'feedback' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600 hover:bg-white/50'}`}
                            >
                                Pending Feedback
                                <span className="ml-2 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">2</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/40 rounded-full"><ChevronLeft size={20} className="text-gray-600" /></button>
                        <span className="text-sm font-medium text-gray-700">Oct 2026</span>
                        <button className="p-2 hover:bg-white/40 rounded-full"><ChevronRight size={20} className="text-gray-600" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'calendar' ? (
                        <div className="grid grid-cols-5 gap-4 h-full">
                            {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'].map((day, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="text-center p-2 rounded-lg bg-white/20 font-medium text-gray-700 text-sm">{day}</div>
                                    {/* Mock Events */}
                                    {i === 1 && (
                                        <GlassCard className="p-3 border-l-4 border-l-green-400 cursor-pointer hover:scale-[1.02] transition-transform">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-gray-700">10:00 AM</span>
                                                <Video size={12} className="text-blue-500" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">John Smith</p>
                                            <p className="text-xs text-gray-500 mb-2">Python Dev</p>
                                            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                                                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-700 font-bold">SC</div>
                                                <span className="text-[10px] text-gray-500">Sarah Chen</span>
                                            </div>
                                        </GlassCard>
                                    )}
                                    {i === 1 && (
                                        <GlassCard className="p-3 border-l-4 border-l-yellow-400 opacity-70 cursor-pointer hover:scale-[1.02] transition-transform">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-gray-700">2:00 PM</span>
                                                <MapPin size={12} className="text-orange-500" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">Maria Garcia</p>
                                            <p className="text-xs text-gray-500">Product Designer</p>
                                            <div className="mt-2 inline-flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] text-yellow-700">
                                                <Clock size={10} /> Pending Acceptance
                                            </div>
                                        </GlassCard>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingFeedback.map(item => (
                                <GlassCard key={item.id} className="p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{item.candidate}</h3>
                                            <p className="text-sm text-gray-500">{item.role} • Interviewed by <span className="text-gray-700 font-medium">{item.interviewer}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-medium text-gray-500">{item.date}</span>
                                        <button className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                                            <MessageSquare size={14} /> Nudge
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 2.2 "Next Up" Sidebar */}
            <div className="w-80 border-l border-white/20 p-6 flex flex-col bg-white/10 backdrop-blur-md">
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Next Up</h3>

                <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                        <div key={interview.id} className="relative pl-4 border-l-2 border-purple-200">
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white/30" />
                            <p className="text-xs font-medium text-gray-500 mb-0.5">{interview.time}</p>
                            <h4 className="text-sm font-semibold text-gray-800">{interview.candidate}</h4>
                            <p className="text-xs text-gray-600 mb-2">{interview.role}</p>

                            <button className="w-full text-left bg-purple-50 hover:bg-purple-100 transition-colors rounded-lg p-2.5 group">
                                <div className="flex items-center gap-2 text-purple-700 font-medium text-xs mb-1">
                                    <User size={12} />
                                    Pre-flight Briefing
                                </div>
                                <p className="text-[10px] text-purple-600/80 leading-relaxed">
                                    Click to generate AI summary & key questions.
                                </p>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/20">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Daily Summary</h4>
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                        <span>Interviews</span>
                        <span className="font-medium">4 Total</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-1/2" />
                    </div>
                    <p className="text-[10px] text-center mt-2 text-gray-500">50% Completed</p>
                </div>
            </div>
        </div>
    );
}
