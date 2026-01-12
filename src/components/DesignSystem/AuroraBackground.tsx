import React from 'react';

/**
 * Background Wrapper
 * Adds the soft gradient background with lilac and aqua tones.
 */
export const AuroraBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen w-full overflow-hidden font-sans" style={{ 
    background: 'linear-gradient(120deg, var(--bg-gradient-start), #fff 50%, var(--bg-gradient-end))',
    color: 'var(--text-primary)'
  }}>
    {/* Gradient Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] mix-blend-multiply filter" style={{ backgroundColor: 'rgba(243, 229, 245, 0.4)' }} />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] mix-blend-multiply filter" style={{ backgroundColor: 'rgba(224, 247, 250, 0.4)' }} />
    <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full blur-[100px] mix-blend-multiply filter" style={{ backgroundColor: 'rgba(108, 92, 231, 0.15)' }} />
    
    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);
