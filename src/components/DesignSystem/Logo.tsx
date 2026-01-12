'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* 1Wrk Logo with Gradient */}
      <div className="relative flex items-center">
        {/* The "1" with curved accent */}
        <div className="relative flex items-center">
          {/* Main vertical stroke */}
          <div 
            className="w-0.5"
            style={{ 
              backgroundColor: '#6C5CE7',
              height: size === 'sm' ? '20px' : size === 'md' ? '28px' : '36px'
            }}
          />
          {/* Curved accent elements - simplified */}
          <div className="absolute -left-1.5 -top-0.5">
            <svg 
              width={size === 'sm' ? '12' : size === 'md' ? '14' : '16'} 
              height={size === 'sm' ? '12' : size === 'md' ? '14' : '16'} 
              viewBox="0 0 16 16" 
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D2C1" />
                  <stop offset="50%" stopColor="#6C5CE7" />
                  <stop offset="100%" stopColor="#6C5CE7" />
                </linearGradient>
              </defs>
              <path
                d="M 2 4 Q 4 2, 6 4 Q 8 6, 10 4"
                stroke="url(#curveGradient)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <span 
          className="ml-4 font-bold"
          style={{ 
            background: 'linear-gradient(90deg, #6C5CE7 0%, #00D2C1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: size === 'sm' ? '1.125rem' : size === 'md' ? '1.5rem' : '1.875rem',
            lineHeight: '1'
          }}
        >
          1Wrk
        </span>
      </div>
      {showText && (
        <span 
          className="font-bold" 
          style={{ 
            color: 'var(--text-primary)',
            fontSize: size === 'sm' ? '1.125rem' : size === 'md' ? '1.5rem' : '1.875rem',
            lineHeight: '1'
          }}
        >
          OS
        </span>
      )}
    </div>
  );
};
