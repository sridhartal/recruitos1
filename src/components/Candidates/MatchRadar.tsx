import React, { useMemo } from 'react';

const MatchRadar = ({ data, size = 60 }: { data: { A: number }[], size?: number }) => {
    const radius = size / 2;
    // Calculate polygon points
    const points = useMemo(() => {
        const total = data.length;
        return data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
            // Normalize score (0-100) to radius
            const r = (d.A / 100) * radius;
            const x = radius + r * Math.cos(angle);
            const y = radius + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    }, [data, radius]);

    const bgPoints = useMemo(() => {
        const total = data.length;
        return data.map((_, i) => {
            const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
            const x = radius + radius * Math.cos(angle);
            const y = radius + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    }, [data, radius]);

    const color = data.reduce((acc, curr) => acc + curr.A, 0) / data.length > 80 ? '#10b981' : '#f59e0b';

    return (
        <svg width={size} height={size} className="overflow-visible">
            <circle cx={radius} cy={radius} r={radius} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx={radius} cy={radius} r={radius * 0.5} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Background shape */}
            <polygon points={bgPoints} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Data shape */}
            <polygon points={points} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
        </svg>
    );
};

export default MatchRadar;
