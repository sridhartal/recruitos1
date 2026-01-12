'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table';
import { Search, Filter, MoreHorizontal, ChevronDown, ChevronUp, Mail, Phone, Calendar, MessageSquare, X, Meh, Frown, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActionCell from './ActionCell';
import MatchRadar from './MatchRadar';
import InsightCarousel from './InsightCarousel';
import PipelineChart from './PipelineChart';
import { generateCandidates, Candidate } from '@/services/candidateData';
import { useDemo } from '@/context/DemoContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Cell Components ---
const SentimentCell = ({ score }: { score: number }) => {
    if (score > 0.7) return <Smile size={18} className="text-green-500" />;
    if (score > 0.4) return <Meh size={18} className="text-yellow-500" />;
    return <Frown size={18} className="text-red-500" />;
};

const StatusBadge = ({ status }: { status: Candidate['status'] }) => {
    const styles = {
        Active: 'bg-blue-100 text-blue-700',
        Interviewing: 'bg-purple-100 text-purple-700',
        Offer: 'bg-green-100 text-green-700',
        Rejected: 'bg-gray-100 text-gray-600',
        Hired: 'bg-emerald-100 text-emerald-700',
    };

    return (
        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", styles[status])}>
            {status}
        </span>
    );
};

// --- Main Component ---
export default function CandidateTable() {
    const { demoCandidates } = useDemo();
    const [data, setData] = useState<Candidate[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});
    const [stageFilter, setStageFilter] = useState<string | null>(null);

    useEffect(() => {
        if (demoCandidates) {
            setData(demoCandidates);
        } else {
            setData(generateCandidates(20));
        }
    }, [demoCandidates]);

    // Columns Definition
    const columns: ColumnDef<Candidate>[] = useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
            ),
        },
        {
            accessorKey: 'name',
            header: 'Candidate',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.original.avatarUrl}
                        alt={row.original.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <div>
                        <div className="font-bold text-gray-900 leading-tight">{row.original.name}</div>
                        <div className="text-xs text-gray-500">{row.original.role}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{row.original.last_activity}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'match_score',
            header: 'Match DNA',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <MatchRadar data={row.original.match_radar_data} size={48} />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700">{row.original.match_score}%</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest">Fit</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'sentiment_score',
            header: 'Sentiment',
            cell: ({ getValue }) => <SentimentCell score={getValue() as number} />,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => <StatusBadge status={getValue() as Candidate['status']} />,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <ActionCell
                    onAction={(action) => {
                        console.log(`Action: ${action} for ${row.original.name}`);
                        if (action === 'reject') {
                            alert(`Starting 'Gentle Rejection' Wizard for ${row.original.name}...\n\nAI is drafting a personalized email based on interview feedback.`);
                        } else if (action === 'phone') {
                            alert(`Triggering AI Voice Agent to screen ${row.original.name} immediately.`);
                        } else if (action === 'schedule') {
                            console.log('Opening calendar dropdown...');
                        } else if (action === 'email') {
                            console.log('Opening WhatsApp/SMS panel...');
                        }
                    }}
                />
            ),
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            rowSelection,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableRowSelection: true,
    });

    // Animation variants
    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden space-y-6">

            {/* Top Section: Insights & Charts */}
            <div className="flex gap-6 h-48 shrink-0">
                {/* Left: Oracle Banner */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-sm font-semibold opacity-70 mb-3 ml-1" style={{ color: 'var(--text-primary)' }}>Oracle Insights</h3>
                    <InsightCarousel />
                </div>

                {/* Right: Pipeline Chart */}
                <div className="w-80 shrink-0">
                    <PipelineChart onSelectStage={(stage) => {
                        setStageFilter(stage);
                        console.log('Filtering by stage:', stage);
                        // Simple filter logic demo
                        setGlobalFilter(stage === 'Applied' ? '' : stage); // Reset or set
                    }} />
                </div>
            </div>

            {/* Main Table Container */}
            <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative">
                {/* Glow effect source */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />

                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 bg-white/40 z-20 relative">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search Candidates, Skills, or Status..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all placeholder:text-gray-400 font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 rounded-xl text-sm font-medium text-gray-700 transition-colors border border-white/40">
                            <Filter size={16} /> Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-brand)] hover:brightness-110 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-500/20">
                            <Mail size={16} /> Bulk Action
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent bg-white/5">
                    <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 shadow-sm border-b border-white/20">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none group"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-1 group-hover:text-[var(--primary-brand)] transition-colors">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === 'asc' && <ChevronUp size={14} />}
                                                {header.column.getIsSorted() === 'desc' && <ChevronDown size={14} />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                            <AnimatePresence>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="h-32 text-center text-gray-500 italic">
                                            No candidates found in "Deep Nexus".
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <motion.tr
                                            key={row.id}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                            className={`
                        group relative transition-colors duration-200 
                        hover:bg-white/50 hover:z-10
                        ${row.getIsSelected() ? 'bg-purple-50/50 shadow-[0_0_15px_rgba(108,92,231,0.15)] border-l-2 border-purple-500' : ''}
                    `}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/20 bg-white/30 backdrop-blur-md text-xs text-gray-500 flex justify-between items-center px-6 font-mono">
                    <span>{table.getFilteredRowModel().rows.length} Vectors Loaded</span>
                    <span className="opacity-60">RecruitOS v2.0 // Intelligent Grid</span>
                </div>
            </div>
        </div>
    );
}
