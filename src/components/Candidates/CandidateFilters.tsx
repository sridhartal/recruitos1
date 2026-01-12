'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/DesignSystem';
import { Filter, X } from 'lucide-react';

type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface CandidateFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  stage: Stage | 'all';
  minScore: number;
  maxScore: number;
  location: string;
  experienceMin: number;
  experienceMax: number;
  skills: string[];
}

export default function CandidateFilters({ onFilterChange }: CandidateFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    stage: 'all',
    minScore: 0,
    maxScore: 100,
    location: '',
    experienceMin: 0,
    experienceMax: 20,
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');

  const updateFilter = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const addSkill = () => {
    if (newSkill.trim() && !filters.skills.includes(newSkill.trim())) {
      const updated = { ...filters, skills: [...filters.skills, newSkill.trim()] };
      setFilters(updated);
      onFilterChange(updated);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const updated = { ...filters, skills: filters.skills.filter(s => s !== skill) };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      stage: 'all' as const,
      minScore: 0,
      maxScore: 100,
      location: '',
      experienceMin: 0,
      experienceMax: 20,
      skills: [],
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: 'var(--accent-teal)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Stage Filter */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) => updateFilter('stage', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none text-xs"
            style={{
              background: 'var(--glass-surface)',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Fitment Score Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Fitment Score
          </label>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Min</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => updateFilter('minScore', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:outline-none text-xs"
                style={{
                  background: 'var(--glass-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>Max</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => updateFilter('maxScore', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:outline-none text-xs"
                style={{
                  background: 'var(--glass-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Location
          </label>
          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none text-xs"
            style={{
              background: 'var(--glass-surface)',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Experience Range */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Experience (years)
          </label>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>Min</label>
              <input
                type="number"
                min="0"
                max="20"
                value={filters.experienceMin}
                onChange={(e) => updateFilter('experienceMin', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:outline-none text-xs"
                style={{
                  background: 'var(--glass-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>Max</label>
              <input
                type="number"
                min="0"
                max="20"
                value={filters.experienceMax}
                onChange={(e) => updateFilter('experienceMax', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:outline-none text-xs"
                style={{
                  background: 'var(--glass-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Skills Filter */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-3 py-1.5 rounded-lg border focus:ring-2 focus:outline-none text-xs"
              style={{
                background: 'var(--glass-surface)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'var(--text-primary)'
              }}
            />
            <button
              onClick={addSkill}
              className="px-3 py-1.5 text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium"
              style={{ backgroundColor: 'var(--accent-teal)' }}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                style={{
                  background: 'rgba(0, 210, 193, 0.1)',
                  color: 'var(--text-primary)'
                }}
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
