import React from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { AlertCircle, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const INSIGHTS = [
    {
        type: 'risk',
        title: 'Flight Risk Detected',
        message: 'Candidate "Sarah Jenkins" is taking 2+ days to reply.',
        action: 'Send SMS Nudge',
        icon: AlertCircle,
        color: 'border-l-4 border-red-500',
        iconColor: 'text-red-500',
        bg: 'bg-red-500/10'
    },
    {
        type: 'gem',
        title: 'Hidden Gem Found',
        message: '"Mike Chen" matches 95% of profile but was ranked low by ATS.',
        action: 'Review Profile',
        icon: Sparkles,
        color: 'border-l-4 border-emerald-500',
        iconColor: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        type: 'salary',
        title: 'Salary Friction',
        message: '3 Candidates in Final Round asking > $160k budget.',
        action: 'View Comp Data',
        icon: DollarSign,
        color: 'border-l-4 border-yellow-500',
        iconColor: 'text-yellow-500',
        bg: 'bg-yellow-500/10'
    }
];

export default function InsightCarousel() {
    return (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {INSIGHTS.map((insight, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="min-w-[320px]"
                >
                    <GlassCard className={`p-4 h-full relative overflow-hidden ${insight.color} hover:bg-white/10 transition-colors cursor-pointer group`}>
                        {/* Background tint based on type */}
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none ${insight.bg}`} />

                        <div className="flex items-start gap-3 relative z-10">
                            <div className={`p-2 rounded-lg bg-white/5 ${insight.iconColor}`}>
                                <insight.icon size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800">{insight.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-snug">{insight.message}</p>
                                <button className="mt-2 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary-brand)' }}>
                                    {insight.action} <ArrowRight size={10} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
    );
}
