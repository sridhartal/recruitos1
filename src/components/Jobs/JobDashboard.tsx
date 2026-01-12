'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { Plus, Users, Clock, AlertCircle, Edit2, Share2, ArrowUpRight, Check, X, Sparkles, LayoutGrid, List, ChevronRight, Upload, Search } from 'lucide-react';
import { useRecruitOS } from '@/context/RecruitOSContext';
import { useDemo } from '@/context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import OracleCarousel from './OracleCarousel';
import JobTable from './JobTable';

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

const AVAILABLE_SKILLS = [
    'React', 'TypeScript', 'Node.js', 'Figma', 'AWS', 'Python', 'Product Management', 'UX Research', 'GraphQL', 'Next.js', 'Tailwind CSS'
];

export default function JobDashboard({ onCreateJob }: JobDashboardProps) {
    const { viewMode, activeJobDraft, navigateToApp, updateJobDraft } = useRecruitOS();
    const { publishJob } = useDemo();
    const [isGridView, setIsGridView] = useState(false);

    // Wizard State
    const [wizardStep, setWizardStep] = useState(1);
    const [skillSearch, setSkillSearch] = useState('');

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

    const filteredSkills = AVAILABLE_SKILLS.filter(s =>
        s.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !activeJobDraft?.skills?.includes(s)
    );

    const handleAddSkill = (skill: string) => {
        const currentSkills = activeJobDraft?.skills || [];
        updateJobDraft({ skills: [...currentSkills, skill] });
        setSkillSearch('');
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
            {/* 1.1 Stats Header - Always Visible */}
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

            {/* WIZARD MODE: Replaces Oracle Carousel & Top of Feed */}
            <AnimatePresence mode="wait">
                {viewMode === 'WIZARD' ? (
                    <motion.div
                        key="wizard"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <GlassCard className="p-0 border border-purple-500/30 shadow-2xl relative overflow-hidden mb-6 bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-3xl">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Sparkles className="text-purple-400" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">New Job Requisition</h2>
                                        <p className="text-xs text-purple-600 font-medium">Step {wizardStep} of 2</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigateToApp('JOBS', 'DEFAULT')}
                                    className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8">
                                {/* STEP 1: Core Details */}
                                {wizardStep === 1 && (
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={activeJobDraft?.title || ''}
                                                    onChange={(e) => updateJobDraft({ title: e.target.value })}
                                                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-300"
                                                    placeholder="e.g. Senior Product Designer"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location</label>
                                                <input
                                                    type="text"
                                                    value={activeJobDraft?.location || ''}
                                                    onChange={(e) => updateJobDraft({ location: e.target.value })}
                                                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="e.g. Remote, New York"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Min Salary</label>
                                                    <input
                                                        type="text"
                                                        value={activeJobDraft?.minSalary || ''}
                                                        onChange={(e) => updateJobDraft({ minSalary: e.target.value })}
                                                        className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="$120k"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Max Salary</label>
                                                    <input
                                                        type="text"
                                                        value={activeJobDraft?.maxSalary || ''}
                                                        onChange={(e) => updateJobDraft({ maxSalary: e.target.value })}
                                                        className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="$160k"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: Skills & JD */}
                                {wizardStep === 2 && (
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Required Skills</label>
                                            <div className="p-4 bg-white/50 border border-gray-200 rounded-xl">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {activeJobDraft?.skills?.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium flex items-center gap-1">
                                                            {skill}
                                                            <button onClick={() => updateJobDraft({ skills: activeJobDraft.skills.filter(s => s !== skill) })} className="hover:text-purple-900"><X size={12} /></button>
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={skillSearch}
                                                        onChange={(e) => setSkillSearch(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Search skills (e.g. React, UX)"
                                                    />
                                                    {skillSearch && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto">
                                                            {filteredSkills.map(skill => (
                                                                <button
                                                                    key={skill}
                                                                    onClick={() => handleAddSkill(skill)}
                                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 text-gray-700"
                                                                >
                                                                    {skill}
                                                                </button>
                                                            ))}
                                                            {filteredSkills.length === 0 && (
                                                                <div className="px-4 py-2 text-xs text-gray-400">No matching skills found</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Job Description</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all bg-white/30">
                                                <div className="p-3 bg-purple-100 rounded-full text-purple-600 mb-3">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">Drop description file here</p>
                                                <p className="text-xs text-gray-400 mt-1">or click to browse (PDF, DOCX)</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer / Controls */}
                            <div className="px-8 py-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                                {wizardStep > 1 && (
                                    <button
                                        onClick={() => setWizardStep(prev => prev - 1)}
                                        className="px-5 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/10 transition-colors font-medium text-sm"
                                    >
                                        Back
                                    </button>
                                )}

                                {wizardStep < 2 ? (
                                    <button
                                        onClick={() => setWizardStep(2)}
                                        className="px-6 py-2 rounded-lg bg-gray-900 text-white shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all font-medium text-sm flex items-center gap-2"
                                    >
                                        Next Step <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setWizardStep(1); // Reset
                                            publishJob(); // Navigate
                                        }}
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/20 transition-all font-medium text-sm flex items-center gap-2 transform hover:scale-105"
                                    >
                                        <Check size={16} /> Create Job
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <OracleCarousel />
                )}
            </AnimatePresence>

            {/* 1.2 Job Data - Toggle View */}
            <div className={`space-y-4 pb-20 ${viewMode === 'WIZARD' ? 'opacity-50 pointer-events-none filter blur-[2px] transition-all' : ''}`}>
                <div className="flex items-center justify-between">
                    <h2 id="active-reqs-header" className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Active Requisitions</h2>
                    <div className="flex gap-3 items-center">
                        <div className="flex bg-white/30 p-1 rounded-lg border border-white/20 backdrop-blur-sm">
                            <button
                                onClick={() => setIsGridView(false)}
                                className={`p-1.5 rounded-md transition-all ${!isGridView ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setIsGridView(true)}
                                className={`p-1.5 rounded-md transition-all ${isGridView ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>

                        <select className="bg-white/50 border-none rounded-lg text-sm px-3 py-1.5 text-gray-700 focus:ring-1 focus:ring-purple-500">
                            <option>All Jobs</option>
                            <option>Active</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isGridView ? (
                        <motion.div
                            key="table-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <JobTable data={jobs} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="card-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid gap-4"
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 1.3 "Create Job" Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-10">
                <button
                    onClick={() => navigateToApp('JOBS', 'WIZARD')}
                    className="group flex items-center gap-2 px-4 py-3 bg-[var(--primary-brand)] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                    <Plus size={20} />
                    <span className="font-semibold pr-1">Create Job</span>
                </button>
            </div>
        </div>
    );
}
