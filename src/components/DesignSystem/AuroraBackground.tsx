import React from 'react';

/**
 * Background Wrapper
 * Adds the soft "Aurora" gradient mesh behind the content.
 */
export const AuroraBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen w-full bg-gray-50 overflow-hidden font-sans text-gray-900">
    {/* Gradient Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply filter" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply filter" />
    <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-pink-100/40 rounded-full blur-[100px] mix-blend-multiply filter" />
    
    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);
