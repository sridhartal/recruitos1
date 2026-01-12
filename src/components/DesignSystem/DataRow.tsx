import React from 'react';
import { ArrowRight } from 'lucide-react';

interface DataRowProps {
  avatar?: string;
  name: string;
  role?: string;
  location?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Data Row (List Item)
 * Minimalist list item with hover effects.
 */
export const DataRow = ({ 
  avatar, 
  name, 
  role, 
  location,
  onClick,
  className = ''
}: DataRowProps) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 bg-white/40 hover:bg-white rounded-2xl transition-colors cursor-pointer group mb-2 border border-transparent hover:border-white/50 ${className}`}
  >
    <div className="flex items-center gap-4">
      {avatar ? (
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
        {role && <p className="text-xs text-gray-500">{role}</p>}
      </div>
    </div>
    {location && <div className="text-sm text-gray-500">{location}</div>}
    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black transition-all">
      <ArrowRight size={18} />
    </button>
  </div>
);
