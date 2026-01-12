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
        className="w-full h-12 pl-5 pr-12 rounded-full shadow-sm border-none ring-1 text-sm focus:ring-2 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[var(--text-secondary)]"
        style={{
          background: 'var(--glass-surface)',
          ['--tw-ring-color' as any]: 'rgba(255, 255, 255, 0.5)',
          color: 'var(--text-primary)',
        } as React.CSSProperties}
        onFocus={(e) => {
          e.target.style.setProperty('--tw-ring-color', 'var(--primary-brand)');
        }}
        onBlur={(e) => {
          e.target.style.setProperty('--tw-ring-color', 'rgba(255, 255, 255, 0.5)');
        }}
      />
      <button
        onClick={onSearchClick}
        disabled={disabled}
        className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ backgroundColor: 'var(--accent-teal)' }}
      >
        <IconComponent size={16} className="flex-shrink-0" />
      </button>
    </div>
  );
};
