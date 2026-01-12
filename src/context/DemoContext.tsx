'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRecruitOS } from './RecruitOSContext';
import { generateCandidates, Candidate } from '@/services/candidateData';

interface DemoContextType {
    isDemoRunning: boolean;
    handleChatCommand: (message: string) => Promise<string | null>;
    demoCandidates: Candidate[] | null;
    publishJob: () => void;
    messageQueue: string[];
    consumeMessage: () => string | null;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
    const { navigateToApp, updateJobDraft } = useRecruitOS();
    const [isDemoRunning, setIsDemoRunning] = useState(false);
    const [demoCandidates, setDemoCandidates] = useState<Candidate[] | null>(null);
    const [messageQueue, setMessageQueue] = useState<string[]>([]);

    const queueMessage = (msg: string) => {
        setMessageQueue(prev => [...prev, msg]);
    };

    const consumeMessage = () => {
        if (messageQueue.length === 0) return null;
        const msg = messageQueue[0];
        setMessageQueue(prev => prev.slice(1));
        return msg;
    };

    const simulateTyping = async (text: string, callback: (val: string) => void) => {
        let current = '';
        const chars = text.split('');
        for (const char of chars) {
            current += char;
            callback(current);
            await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); // Random typing speed
        }
    };

    const publishJob = () => {
        // Switch to Candidates
        navigateToApp('CANDIDATES');

        // Generate 5 High Match candidates
        const highMatchCandidates = generateCandidates(5).map(c => ({
            ...c,
            match_score: Math.floor(Math.random() * 10) + 90, // 90-99
            status: 'Active' as Candidate['status'],
        }));
        setDemoCandidates(highMatchCandidates);

        queueMessage("Job published! I found 5 matches. Shall I screen them?");
    };

    const handleChatCommand = async (message: string): Promise<string | null> => {
        const cmd = message.toLowerCase();

        if (cmd.includes('create a job') || cmd.includes('create job')) {
            setIsDemoRunning(true);
            navigateToApp('JOBS', 'WIZARD');

            // Simulate typing into the wizard
            setTimeout(() => {
                simulateTyping('Senior UX Designer', (val) => updateJobDraft({ title: val }));
            }, 500);

            setTimeout(() => {
                simulateTyping('$140k', (val) => updateJobDraft({ minSalary: val }));
            }, 2500);

            setTimeout(() => {
                simulateTyping('$160k', (val) => updateJobDraft({ maxSalary: val }));
            }, 4000);

            return "Opening Job Wizard... I'll help you draft the requirements.";
        }

        if (cmd.includes('publish')) {
            publishJob();
            return null; // The queue will handle it
        }

        if (cmd.includes('reset demo')) {
            setIsDemoRunning(false);
            setDemoCandidates(null);
            navigateToApp('DASHBOARD');
            return "Demo reset.";
        }

        return null; // No command matched
    };

    return (
        <DemoContext.Provider value={{ isDemoRunning, handleChatCommand, demoCandidates, publishJob, messageQueue, consumeMessage }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
}
