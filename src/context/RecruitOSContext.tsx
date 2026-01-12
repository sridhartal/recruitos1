'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our Job Draft
export interface JobDraft {
    title: string;
    skills: string[];
    salary?: string;
    location?: string;
    experience?: string;
}

// Define the available Apps and View Modes
export type AppType = 'DASHBOARD' | 'JOBS' | 'CANDIDATES' | 'SCHEDULER' | 'PIPELINE';
export type ViewMode = 'DEFAULT' | 'WIZARD';

interface RecruitOSContextType {
    activeApp: AppType;
    viewMode: ViewMode;
    activeJobDraft: JobDraft | null;
    pipelineHighlight: string | null; // ID of candidate or filter type to glow

    navigateToApp: (app: AppType, mode?: ViewMode) => void;
    updateJobDraft: (draft: Partial<JobDraft>) => void;
    setPipelineHighlight: (highlight: string | null) => void;
}

const RecruitOSContext = createContext<RecruitOSContextType | undefined>(undefined);

export function RecruitOSProvider({ children }: { children: ReactNode }) {
    const [activeApp, setActiveApp] = useState<AppType>('DASHBOARD');
    const [viewMode, setViewMode] = useState<ViewMode>('DEFAULT');
    const [activeJobDraft, setActiveJobDraft] = useState<JobDraft | null>(null);
    const [pipelineHighlight, setPipelineHighlight] = useState<string | null>(null);

    const navigateToApp = (app: AppType, mode: ViewMode = 'DEFAULT') => {
        setActiveApp(app);
        setViewMode(mode);
    };

    const updateJobDraft = (draft: Partial<JobDraft>) => {
        setActiveJobDraft(prev => prev ? { ...prev, ...draft } : { title: '', skills: [], ...draft });
    };

    return (
        <RecruitOSContext.Provider value={{
            activeApp,
            viewMode,
            activeJobDraft,
            pipelineHighlight,
            navigateToApp,
            updateJobDraft,
            setPipelineHighlight
        }}>
            {children}
        </RecruitOSContext.Provider>
    );
}

export function useRecruitOS() {
    const context = useContext(RecruitOSContext);
    if (context === undefined) {
        throw new Error('useRecruitOS must be used within a RecruitOSProvider');
    }
    return context;
}
