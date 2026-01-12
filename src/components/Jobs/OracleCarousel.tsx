import React from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { Sparkles, AlertTriangle, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Insight {
    id: string;
    type: 'urgent' | 'trend' | 'suggestion';
    title: string;
    description: string;
    action: string;
}

const INSIGHTS: Insight[] = [
    {
        id: '1',
        type: 'urgent',
        title: 'Low Candidate Flow',
        description: 'Senior React Developer role is below funnel benchmark.',
        action: 'Boost Post',
    },
    {
        id: '2',
        type: 'suggestion',
        title: 'New Skill Detected',
        description: 'Competitors are asking for "Next.js 14" in this role.',
        action: 'Update JD',
    },
    {
        id: '3',
        type: 'trend',
        title: 'Salary Mismatch',
        description: 'Your offer is 10% below market average for this region.',
        action: 'Review Comp',
    },
    {
        id: '4',
        type: 'suggestion',
        title: 'Interview Bottleneck',
        description: 'Candidates are stuck in "Screening" for > 5 days.',
        action: 'Check Calendar',
    },
];

const OracleCarousel = () => {
    return (
        <div className="w-full mb-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="flex gap-4 min-w-max px-1">
                {INSIGHTS.map((insight) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GlassCard className={`w-72 p-4 relative group hover:bg-white/20 transition-colors ${insight.type === 'urgent' ? 'border-red-400/30' :
                                insight.type === 'trend' ? 'border-blue-400/30' : 'border-purple-400/30'
                            }`}>
                            {/* Glow for urgent items */}
                            {insight.type === 'urgent' && (
                                <div className="absolute inset-0 rounded-2xl bg-red-500/5 animate-pulse pointer-events-none" />
                            )}

                            <div className="flex items-start gap-3 relative z-10">
                                <div className={`p-2 rounded-lg ${insight.type === 'urgent' ? 'bg-red-100 text-red-600' :
                                        insight.type === 'trend' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {insight.type === 'urgent' ? <AlertTriangle size={18} /> :
                                        insight.type === 'trend' ? <TrendingUp size={18} /> : <Sparkles size={18} />}
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800">{insight.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        {insight.description}
                                    </p>

                                    <button className="mt-3 text-xs font-medium flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity hover:underline"
                                        style={{ color: 'var(--primary-brand)' }}
                                    >
                                        {insight.action} <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OracleCarousel;
