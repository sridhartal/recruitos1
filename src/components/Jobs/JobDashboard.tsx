'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard, PrimaryButton, PillInput } from '@/components/DesignSystem';
import { Plus, Users, Clock, AlertCircle, Edit2, Share2, MoreHorizontal, ArrowUpRight, Check, X, Sparkles } from 'lucide-react';
import { useRecruitOS } from '@/context/RecruitOSContext';

interface Job {
    id: string;
    title: string;
    reqId: string;
    status: 'Active' | 'Draft' | 'On Hold';
    applicants: number;
    funnel: {
        applied: number;
        screen: number;
        interview: number;
        offer: number;
    };
}

interface JobDashboardProps {
    onCreateJob: () => void;
}

export default function JobDashboard({ onCreateJob }: JobDashboardProps) {
    const { viewMode, activeJobDraft, navigateToApp, updateJobDraft } = useRecruitOS();

    // Mock Data
    const stats = [
        { label: 'Open Roles', value: '8', icon: Users, color: 'text-blue-400' },
        { label: 'Total Applicants', value: '142', icon: ArrowUpRight, color: 'text-purple-400' },
        { label: 'Avg Time-to-Fill', value: '18 Days', icon: Clock, color: 'text-green-400' },
        { label: 'Attention Needed', value: '3', icon: AlertCircle, color: 'text-red-400' },
    ];

    const jobs: Job[] = [
        {
            id: '1',
            title: 'Senior React Developer',
            reqId: 'REQ-102',
            status: 'Active',
            applicants: 45,
            funnel: { applied: 20, screen: 5, interview: 2, offer: 0 }
        },
        {
            id: '2',
            title: 'Product Designer',
            reqId: 'REQ-103',
            status: 'Active',
            applicants: 32,
            funnel: { applied: 15, screen: 8, interview: 4, offer: 1 }
        },
        {
            id: '3',
            title: 'Marketing Manager',
            reqId: 'REQ-104',
            status: 'Draft',
            applicants: 0,
            funnel: { applied: 0, screen: 0, interview: 0, offer: 0 }
        },
        {
            id: '4',
            title: 'Backend Engineer',
            reqId: 'REQ-105',
            status: 'On Hold',
            applicants: 65,
            funnel: { applied: 40, screen: 10, interview: 3, offer: 0 }
        }
    ];

    // Wizard Render Logic
    if (viewMode === 'WIZARD') {
        return (
            <div className="flex-1 p-8 overflow-y-auto">
                <GlassCard className="max-w-4xl mx-auto p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="text-purple-400" size={20} />
                                <h2 className="text-xl font-bold text-white">AI Job Architect</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Reviewing captured requirements from chat...</p>
                        </div>
                        <button
                            onClick={() => navigateToApp('JOBS', 'DEFAULT')}
                            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Job Title</label>
                            <input
                                type="text"
                                value={activeJobDraft?.title || ''}
                                onChange={(e) => updateJobDraft({ title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-medium text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>

                        {/* Grid for other fields */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Skills Required</label>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl min-h-[100px]">
                                    <div className="flex flex-wrap gap-2">
                                        {activeJobDraft?.skills?.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-md text-sm border border-purple-500/20">
                                                {skill}
                                            </span>
                                        ))}
                                        <button className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400 rounded-md text-sm border border-white/10 transition-colors flex items-center gap-1">
                                            <Plus size={12} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Experience Level</label>
                                    <input
                                        type="text"
                                        value={activeJobDraft?.experience || ''}
                                        onChange={(e) => updateJobDraft({ experience: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Salary Range</label>
                                    <input
                                        type="text"
                                        value={activeJobDraft?.salary || ''}
                                        onChange={(e) => updateJobDraft({ salary: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => navigateToApp('JOBS', 'DEFAULT')}
                                className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                            >
                                Discard Draft
                            </button>
                            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/20 transition-all font-medium text-sm flex items-center gap-2 transform hover:scale-105">
                                <Check size={16} /> Publish Requisition
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
            {/* 1.1 "Pulse" Summary Header */}
            <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <GlassCard key={index} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium opacity-70" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                            </div>
                            <div className={`p-2 rounded-full bg-white/10 ${stat.color}`}>
                                <Icon size={20} />
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* 1.2 Job Cards (List View) */}
            <div className="space-y-4 pb-20">
                <div className="flex items-center justify-between">
                    {/* Added ID for Co-Pilot linking if needed */}
                    <h2 id="active-reqs-header" className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Active Requisitions</h2>
                    <div className="flex gap-2">
                        {/* Filter placeholder */}
                        <select className="bg-white/50 border-none rounded-lg text-sm px-3 py-1.5 text-gray-700 focus:ring-1 focus:ring-purple-500">
                            <option>All Jobs</option>
                            <option>Active</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>

                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <GlassCard key={job.id} className="p-0 overflow-hidden hover:border-purple-300/50 transition-colors group">
                            <div className="p-5 flex items-center gap-6">
                                {/* Job Info */}
                                <div className="flex-shrink-0 w-64">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs opacity-60 font-mono" style={{ color: 'var(--text-secondary)' }}>#{job.reqId}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${job.status === 'Active' ? 'bg-green-100/50 text-green-700' :
                                            job.status === 'Draft' ? 'bg-gray-100/50 text-gray-600' : 'bg-yellow-100/50 text-yellow-700'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Mini-Funnel Visualization */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between text-[10px] mb-1.5 px-1 opacity-70" style={{ color: 'var(--text-secondary)' }}>
                                        <span>Applied ({job.funnel.applied})</span>
                                        <span>Screen ({job.funnel.screen})</span>
                                        <span>Interview ({job.funnel.interview})</span>
                                        <span>Offer ({job.funnel.offer})</span>
                                    </div>
                                    <div className="h-2 flex w-full rounded-full overflow-hidden bg-gray-100/30">
                                        <div style={{ width: `${(job.funnel.applied / 50) * 100}%` }} className="bg-blue-400/80 h-full" />
                                        <div style={{ width: `${(job.funnel.screen / 50) * 100}%` }} className="bg-purple-400/80 h-full" />
                                        <div style={{ width: `${(job.funnel.interview / 50) * 100}%` }} className="bg-orange-400/80 h-full" />
                                        <div style={{ width: `${(job.funnel.offer / 50) * 100}%` }} className="bg-green-400/80 h-full" />
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex-shrink-0 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-purple-600 transition-colors tooltip" title="Edit JD">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-blue-600 transition-colors tooltip" title="View Candidates">
                                        <Users size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-green-600 transition-colors tooltip" title="Post to Boards">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* 1.3 "Create Job" Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-10">
                <button
                    onClick={onCreateJob}
                    className="group flex items-center gap-2 px-4 py-3 bg-[var(--primary-brand)] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                    <Plus size={20} />
                    <span className="font-semibold pr-1">Create Job</span>
                </button>
            </div>
        </div>
    );
}
