import React from 'react';
import { Phone, Mail, Calendar, X } from 'lucide-react';

interface ActionCellProps {
    onAction: (action: string) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ onAction }) => {
    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={(e) => { e.stopPropagation(); onAction('phone'); }}
                className="p-1.5 rounded-full hover:bg-purple-100 text-gray-500 hover:text-purple-600 transition-colors"
                title="Call Candidate"
            >
                <Phone size={14} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onAction('email'); }}
                className="p-1.5 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="Send Email"
            >
                <Mail size={14} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onAction('schedule'); }}
                className="p-1.5 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors"
                title="Schedule Interview"
            >
                <Calendar size={14} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onAction('reject'); }}
                className="p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                title="Reject"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default ActionCell;
