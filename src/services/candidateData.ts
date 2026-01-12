export interface RadarData {
    subject: string;
    A: number; // Candidate Score
    fullMark: number;
}

export interface Candidate {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    status: 'Active' | 'Interviewing' | 'Offer' | 'Rejected' | 'Hired';
    sentiment_score: number; // 0 to 1
    match_score: number;
    match_radar_data: RadarData[];
    last_activity: string;
    pipeline_stage: string; // For the Area Chart grouping
}

const ROLES = ['Senior React Dev', 'Product Manager', 'UX Designer', 'Backend Lead', 'DevOps Engineer'];
const STAGES = ['Applied', 'Screening', 'Technical', 'Culture Fit', 'Final', 'Offer'];

export const generateCandidates = (count: number): Candidate[] => {
    return Array.from({ length: count }, (_, i) => {
        const role = ROLES[i % ROLES.length];

        // Generate Radar Data based on role (roughly)
        const radarData: RadarData[] = [
            { subject: 'Tech', A: Math.floor(Math.random() * 40) + 60, fullMark: 100 },
            { subject: 'Exp', A: Math.floor(Math.random() * 40) + 60, fullMark: 100 },
            { subject: 'Comm', A: Math.floor(Math.random() * 40) + 60, fullMark: 100 },
            { subject: 'Cult', A: Math.floor(Math.random() * 40) + 60, fullMark: 100 },
            { subject: 'Lead', A: Math.floor(Math.random() * 40) + 60, fullMark: 100 },
        ];

        return {
            id: `c-${i}`,
            name: [`Alex River`, `Sarah Jenkins`, `Mike Chen`, `Jessica Wong`, `David Kim`, `Emily Davis`][i % 6] + (i > 5 ? ` ${i}` : ''),
            role: role,
            avatarUrl: `https://i.pravatar.cc/150?u=cand_${i}`,
            status: ['Active', 'Interviewing', 'Offer', 'Rejected'][Math.floor(Math.random() * 4)] as Candidate['status'],
            sentiment_score: Math.random(), // 0.0 - 1.0
            match_score: Math.floor(Math.random() * 30) + 70,
            match_radar_data: radarData,
            last_activity: `${Math.floor(Math.random() * 48)}h ago`,
            pipeline_stage: STAGES[Math.floor(Math.random() * STAGES.length)],
        };
    });
};
