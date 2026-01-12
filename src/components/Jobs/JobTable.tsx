'use client';

import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table';
import { Edit2, Rocket, PauseCircle, ChevronDown, ChevronUp } from 'lucide-react';
import JobFunnel from './JobFunnel';

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

interface JobTableProps {
    data: Job[];
}

export default function JobTable({ data }: JobTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns: ColumnDef<Job>[] = useMemo(() => [
        {
            accessorKey: 'title',
            header: 'Role / Designation',
            cell: ({ row }) => (
                <div>
                    <div className="font-semibold text-gray-900">{row.original.title}</div>
                    <div className="text-xs text-gray-500 font-mono">#{row.original.reqId}</div>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue() as string;
                const styles = {
                    Active: 'bg-green-100 text-green-700',
                    Draft: 'bg-gray-100 text-gray-600',
                    'On Hold': 'bg-yellow-100 text-yellow-700'
                };
                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            accessorKey: 'funnel',
            header: 'Pipeline Health',
            cell: ({ getValue }) => <JobFunnel data={getValue() as Job['funnel']} />,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
                    <button className="p-1.5 rounded-lg hover:bg-purple-100 text-gray-400 hover:text-purple-600 transition-colors" title="Edit">
                        <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors" title="Boost">
                        <Rocket size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-yellow-100 text-gray-400 hover:text-yellow-600 transition-colors" title="Pause">
                        <PauseCircle size={14} />
                    </button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
            <table className="w-full">
                <thead className="bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none first:rounded-tl-2xl last:rounded-tr-2xl"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' && <ChevronUp size={14} />}
                                        {header.column.getIsSorted() === 'desc' && <ChevronDown size={14} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-white/10">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="group hover:bg-white/40 transition-colors cursor-default"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
