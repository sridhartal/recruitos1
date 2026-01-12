'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/DesignSystem';

const data = [
    { name: 'Applied', count: 45 },
    { name: 'Screening', count: 32 },
    { name: 'Technical', count: 18 },
    { name: 'Culture', count: 12 },
    { name: 'Final', count: 5 },
    { name: 'Offer', count: 2 },
];

export default function PipelineChart({ onSelectStage }: { onSelectStage: (stage: string) => void }) {
    return (
        <GlassCard className="h-full p-4 flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-semibold opacity-80" style={{ color: 'var(--text-primary)' }}>Pipeline Wave</h3>
                <p className="text-xs opacity-50" style={{ color: 'var(--text-secondary)' }}>Live Candidate Volume</p>
            </div>

            <div className="h-32 w-full -ml-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        onClick={(e) => {
                            if (e && e.activeLabel) {
                                onSelectStage(String(e.activeLabel));
                            }
                        }}
                        margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                            itemStyle={{ color: '#6b7280' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.3)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
