'use client';

import React from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { MoreHorizontal, AlertTriangle, Zap, CheckCircle2, DollarSign, Clock, Sparkles } from 'lucide-react';
import { useRecruitOS } from '@/context/RecruitOSContext';

interface Candidate {
    id: string;
    name: string;
    role: string;
    daysInStage: number;
    avatar: string;
    isTopMatch?: boolean; // Added for sourcing highlight
}

interface Column {
    id: string;
    title: string;
    count: number;
    color: string;
    candidates: Candidate[];
}

interface PipelineBoardProps { }

export default function PipelineBoard({ }: PipelineBoardProps) {
    const { pipelineHighlight } = useRecruitOS();

    // Mock Data with "Top Match" property
    const columns: Column[] = [
        {
            id: 'applied',
            title: 'Applied',
            count: 12,
            color: 'bg-blue-500',
            candidates: [
                { id: '1', name: 'James Wilson', role: 'Senior Python Dev', daysInStage: 2, avatar: 'JW', isTopMatch: true },
                { id: '2', name: 'Lisa Chen', role: 'Product Designer', daysInStage: 1, avatar: 'LC' },
            ]
        },
        {
            id: 'screening',
            title: 'Screening',
            count: 5,
            color: 'bg-purple-500',
            candidates: [
                { id: '3', name: 'Michael Brown', role: 'Frontend Engineer', daysInStage: 6, avatar: 'MB' }, // Rotting
            ]
        },
        {
            id: 'interview',
            title: 'Interview',
            count: 4,
            color: 'bg-orange-500',
            candidates: [
                { id: '4', name: 'Sarah Miller', role: 'Senior Python Dev', daysInStage: 3, avatar: 'SM', isTopMatch: true },
                { id: '5', name: 'David Lee', role: 'Backend Engineer', daysInStage: 1, avatar: 'DL' },
            ]
        },
        {
            id: 'offer',
            title: 'Offer',
            count: 2,
            color: 'bg-green-500',
            candidates: [
                { id: '6', name: 'Emily Davis', role: 'Full Stack Engineer', daysInStage: 4, avatar: 'ED', isTopMatch: true },
            ]
        },
        {
            id: 'hired',
            title: 'Hired',
            count: 8,
            color: 'bg-emerald-500',
            candidates: []
        }
    ];

    const insights = [
        { id: 1, text: "You have 5 candidates in Screening. Block 1 hour to review them.", type: 'action', icon: Clock },
        { id: 2, text: "The 'Senior Dev' role has 0 applicants. Boost the post?", type: 'alert', icon: Zap },
        { id: 3, text: "Candidate John Doe has an offer pending for 3 days. Call him?", type: 'warning', icon: DollarSign },
    ];

    return (
        <div className="flex h-full">
            {/* 3.1 Kanban Board Visualization */}
            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex gap-4 min-w-max h-full">
                    {columns.map((column) => (
                        <div key={column.id} className="w-72 flex flex-col h-full">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{column.title}</h3>
                                    <span className="text-xs text-gray-400 font-medium">{column.count}</span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                            </div>

                            {/* Drop Zone (Mocked) */}
                            <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-2 space-y-3 overflow-y-auto">
                                {column.candidates.map((candidate) => {
                                    const isRotting = candidate.daysInStage > 5;
                                    const isHighlighted = pipelineHighlight === 'top-match' && candidate.isTopMatch;

                                    return (
                                        <GlassCard
                                            key={candidate.id}
                                            className={`
                                                relative p-3 cursor-grab active:cursor-grabbing hover:translate-y-[-2px] transition-transform
                                                ${isRotting ? 'border-l-4 border-l-red-400' : ''}
                                                ${isHighlighted ? 'ring-2 ring-yellow-400/70 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-yellow-400/5' : ''}
                                            `}
                                        >
                                            {/* AI Top Match Badge */}
                                            {isHighlighted && (
                                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 font-bold animate-pulse">
                                                    <Sparkles size={8} /> TOP MATCH
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                        {candidate.avatar}
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-700">{candidate.name}</span>
                                                </div>
                                                {isRotting && (
                                                    <div className="text-red-500" title="Stagnant in stage > 5 days">
                                                        <AlertTriangle size={14} />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mb-2 truncate">{candidate.role}</p>

                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                                                <span className={`text-[10px] ${isRotting ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                                    {candidate.daysInStage}d in stage
                                                </span>
                                                {/* 3.2 "Stagnation" Alerts (The "Rotting" Feature) */}
                                                {isRotting && (
                                                    <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                        Attention
                                                    </span>
                                                )}
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                                {/* Empty State Mock */}
                                {column.candidates.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-xs text-gray-400">Drop here</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3.3 "Best Action" Insights Widget (Pipeline Optimizer) */}
            <div className="w-80 border-l border-white/20 p-6 flex flex-col bg-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 bg-yellow-100 rounded-lg text-yellow-600">
                        <Zap size={18} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Pipeline Optimizer</h3>
                </div>

                <div className="space-y-3">
                    {insights.map((insight) => {
                        const Icon = insight.icon;
                        return (
                            <div key={insight.id} className="p-3 bg-white/40 rounded-xl border border-white/40 shadow-sm">
                                <div className="flex gap-3">
                                    <div className={`mt-0.5 flex-shrink-0 ${insight.type === 'action' ? 'text-blue-600' :
                                        insight.type === 'alert' ? 'text-purple-600' : 'text-orange-600'
                                        }`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-800 leading-relaxed font-medium">
                                            {insight.text}
                                        </p>
                                        <button className="mt-2 text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                            Take Action <CheckCircle2 size={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-auto p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                    <h4 className="text-sm font-bold mb-1">Weekly Velocity</h4>
                    <div className="flex items-end gap-1 mb-2">
                        <span className="text-2xl font-bold">12</span>
                        <span className="text-xs opacity-80 mb-1">hires predicted</span>
                    </div>
                    <p className="text-[10px] opacity-70">Based on current pipeline movement.</p>
                </div>
            </div>
        </div>
    );
}
