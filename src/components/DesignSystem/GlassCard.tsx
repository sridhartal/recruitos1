import React from 'react';

// Utility for class merging
const cn = (...classes: (string | undefined | null | false)[]): string => 
  classes.filter(Boolean).join(' ');

/**
 * Glass Card
 * The core container for the "Soft UI" look with glassmorphism.
 */
export const GlassCard = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div 
    className={cn(
      "backdrop-blur-xl rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
      className
    )}
    style={{
      background: 'var(--glass-surface)',
      border: 'var(--glass-border)',
      backdropFilter: 'var(--glass-blur)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
    }}
  >
    {children}
  </div>
);
