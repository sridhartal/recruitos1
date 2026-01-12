import React from 'react';

interface JobFunnelProps {
    data: {
        applied: number;
        screen: number;
        interview: number;
        offer: number;
    };
}

const JobFunnel: React.FC<JobFunnelProps> = ({ data }) => {
    const total = 50; // Normalizing base for visualization

    return (
        <div className="w-full min-w-[140px]">
            <div className="flex items-center justify-between text-[10px] mb-1.5 px-1 opacity-70 text-gray-500">
                <span>{data.applied}</span>
                <span>{data.screen}</span>
                <span>{data.interview}</span>
                <span>{data.offer}</span>
            </div>
            <div className="h-2 flex w-full rounded-full overflow-hidden bg-gray-100/50 border border-gray-100">
                <div style={{ width: `${(data.applied / total) * 100}%` }} className="bg-blue-400/80 h-full hover:bg-blue-500 transition-colors" title={`Applied: ${data.applied}`} />
                <div style={{ width: `${(data.screen / total) * 100}%` }} className="bg-purple-400/80 h-full hover:bg-purple-500 transition-colors" title={`Screen: ${data.screen}`} />
                <div style={{ width: `${(data.interview / total) * 100}%` }} className="bg-orange-400/80 h-full hover:bg-orange-500 transition-colors" title={`Interview: ${data.interview}`} />
                <div style={{ width: `${(data.offer / total) * 100}%` }} className="bg-green-400/80 h-full hover:bg-green-500 transition-colors" title={`Offer: ${data.offer}`} />
            </div>
        </div>
    );
};

export default JobFunnel;
