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
          <Filter size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Stage Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) => updateFilter('stage', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
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
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Max</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => updateFilter('maxScore', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
          />
        </div>

        {/* Experience Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Experience (years)
          </label>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Min</label>
              <input
                type="number"
                min="0"
                max="20"
                value={filters.experienceMin}
                onChange={(e) => updateFilter('experienceMin', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Max</label>
              <input
                type="number"
                min="0"
                max="20"
                value={filters.experienceMax}
                onChange={(e) => updateFilter('experienceMax', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Skills Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white"
            />
            <button
              onClick={addSkill}
              className="px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg hover:bg-black transition-colors text-xs font-medium"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px]"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-600 transition-colors"
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
