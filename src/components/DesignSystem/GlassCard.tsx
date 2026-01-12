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
  <div className={cn(
    "backdrop-blur-xl bg-white/70 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
    "rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
    className
  )}>
    {children}
  </div>
);
