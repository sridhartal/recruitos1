import React from 'react';
import { Search, Send } from 'lucide-react';

interface PillInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchClick?: () => void;
  className?: string;
  icon?: 'search' | 'send';
  disabled?: boolean;
}

/**
 * Pill Input (Search/Chat)
 * Fully rounded input with nested action button.
 */
export const PillInput = ({ 
  placeholder = "Search...",
  value,
  onChange,
  onKeyPress,
  onSearchClick,
  className = '',
  icon = 'search',
  disabled = false
}: PillInputProps) => {
  const IconComponent = icon === 'send' ? Send : Search;
  
  return (
    <div className={`relative group w-full max-w-2xl ${className}`}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        className="w-full h-12 pl-5 pr-12 bg-white rounded-full shadow-sm border-none ring-1 ring-gray-100 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        onClick={onSearchClick}
        disabled={disabled}
        className="absolute right-1.5 top-1.5 h-9 w-9 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <IconComponent size={16} className="flex-shrink-0" />
      </button>
    </div>
  );
};
