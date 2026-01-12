'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown, Mail, Phone, Briefcase } from 'lucide-react';
import { Candidate } from '@/services/mockDataService';
import { FilterState } from './CandidateFilters';

interface CandidateDashboardProps {
  onClose?: () => void;
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
}

type SortField = 'name' | 'email' | 'position' | 'fitmentScore' | 'stage';
type SortDirection = 'asc' | 'desc';
type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface CandidateWithDetails extends Candidate {
  positionApplied: string;
  fitmentScore: number;
  stage: Stage;
}

export default function CandidateDashboard({ 
  onClose, 
  filters: externalFilters,
  onFiltersChange 
}: CandidateDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('fitmentScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Use external filters if provided, otherwise use internal state
  const [internalFilters, setInternalFilters] = useState<FilterState>({
    stage: 'all',
    minScore: 0,
    maxScore: 100,
    location: '',
    experienceMin: 0,
    experienceMax: 20,
    skills: [],
  });

  const filters = externalFilters || internalFilters;

  // Mock data - in real app, this would come from API
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  
  // Fetch candidates on mount
  useEffect(() => {
    fetch('/api/mock-data/candidates')
      .then(res => res.json())
      .then(data => {
        // API returns array directly or wrapped in candidates property
        setAllCandidates(Array.isArray(data) ? data : (data.candidates || []));
      })
      .catch(err => console.error('Error fetching candidates:', err));
  }, []);
  
  // Transform candidates with additional fields
  const candidatesWithDetails: CandidateWithDetails[] = useMemo(() => {
    const positions = ['Senior Python Developer', 'Full Stack Engineer', 'Frontend Developer', 'Backend Engineer', 'DevOps Engineer'];
    const stages: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
    
    return allCandidates.map((candidate, index) => ({
      ...candidate,
      positionApplied: positions[index % positions.length],
      fitmentScore: Math.floor(Math.random() * 40) + 60, // 60-100
      stage: stages[Math.floor(Math.random() * stages.length)] as Stage,
    }));
  }, [allCandidates]);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidatesWithDetails.filter((candidate) => {
      // Basic search
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.positionApplied.toLowerCase().includes(searchQuery.toLowerCase());

      // Advanced filters
      const matchesStage = filters.stage === 'all' || candidate.stage === filters.stage;
      const matchesScore = candidate.fitmentScore >= filters.minScore && 
        candidate.fitmentScore <= filters.maxScore;
      const matchesSkills = filters.skills.length === 0 || 
        filters.skills.some(skill => 
          candidate.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
        );
      const matchesLocation = !filters.location || 
        candidate.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesExperience = candidate.experience >= filters.experienceMin && 
        candidate.experience <= filters.experienceMax;

      return matchesSearch && matchesStage && matchesScore && matchesSkills && matchesLocation && matchesExperience;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'position':
          aValue = a.positionApplied.toLowerCase();
          bValue = b.positionApplied.toLowerCase();
          break;
        case 'fitmentScore':
          aValue = a.fitmentScore;
          bValue = b.fitmentScore;
          break;
        case 'stage':
          aValue = a.stage;
          bValue = b.stage;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [candidatesWithDetails, searchQuery, sortField, sortDirection, filters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50';
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStageColor = (stage: Stage) => {
    const colors: Record<Stage, string> = {
      'Applied': 'bg-blue-50 text-blue-700',
      'Screening': 'bg-purple-50 text-purple-700',
      'Interview': 'bg-orange-50 text-orange-700',
      'Offer': 'bg-green-50 text-green-700',
      'Hired': 'bg-emerald-50 text-emerald-700',
      'Rejected': 'bg-red-50 text-red-700',
    };
    return colors[stage] || 'bg-gray-50 text-gray-700';
  };

  const handleAction = (action: string, candidate: CandidateWithDetails) => {
    console.log(`${action} for ${candidate.name}`);
    // Handle actions like view, contact, move stage, etc.
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else {
      setInternalFilters(newFilters);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3 flex-shrink-0 border-b border-white/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Candidate Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredAndSortedCandidates.length} candidates found
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="p-4 pb-3 flex-shrink-0">
        {/* Basic Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search candidates by name, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm bg-white/70"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/50 border-b border-white/40">
              <tr>
                <th
                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Candidate Name
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center gap-1">
                    Position Applied
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => handleSort('fitmentScore')}
                >
                  <div className="flex items-center gap-1">
                    Fitment Score
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                  onClick={() => handleSort('stage')}
                >
                  <div className="flex items-center gap-1">
                    Stage
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-white/20 hover:bg-white/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-xs font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone size={10} />
                          {candidate.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-700">{candidate.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-700">{candidate.positionApplied}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getScoreColor(
                          candidate.fitmentScore
                        )}`}
                      >
                        {candidate.fitmentScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStageColor(
                          candidate.stage
                        )}`}
                      >
                        {candidate.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAction('view', candidate)}
                          className="px-2 py-1 text-[10px] text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-md transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleAction('contact', candidate)}
                          className="px-2 py-1 text-[10px] text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-md transition-colors"
                        >
                          Contact
                        </button>
                        <button
                          onClick={() => handleAction('move', candidate)}
                          className="px-2 py-1 text-[10px] text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-md transition-colors"
                        >
                          Move
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
