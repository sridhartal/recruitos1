import React from 'react';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * Primary Button
 * High contrast, pill-shaped action button.
 */
export const PrimaryButton = ({ 
  label, 
  onClick, 
  icon: Icon,
  className = '',
  type = 'button',
  disabled = false
}: PrimaryButtonProps) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`group flex items-center justify-center gap-1.5 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 hover:opacity-90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
    style={{
      backgroundColor: disabled ? 'rgba(0, 210, 193, 0.5)' : 'var(--accent-teal)'
    }}
  >
    <span>{label}</span>
    {Icon && <Icon size={14} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" />}
  </button>
);
