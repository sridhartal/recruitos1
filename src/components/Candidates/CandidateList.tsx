'use client';

import { useState, useMemo } from 'react';
import { GlassCard, PrimaryButton } from '@/components/DesignSystem';
import { Search, Filter, ArrowUpDown, ExternalLink } from 'lucide-react';
import { MatchedCandidate } from '@/services/candidateMatchingService';

interface CandidateListProps {
  candidates: MatchedCandidate[];
  onSearchWeb?: () => void;
  isSearching?: boolean;
}

type SortField = 'matchScore' | 'name' | 'experience' | 'location';
type SortDirection = 'asc' | 'desc';

export default function CandidateList({ 
  candidates, 
  onSearchWeb,
  isSearching = false 
}: CandidateListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('matchScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterMinScore, setFilterMinScore] = useState(0);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesScore = candidate.matchScore >= filterMinScore;

      return matchesSearch && matchesScore;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'matchScore':
          aValue = a.matchScore;
          bValue = b.matchScore;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
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
  }, [candidates, searchQuery, sortField, sortDirection, filterMinScore]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-3">
      {/* Header with Search Web Button */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">
          Candidates ({filteredAndSortedCandidates.length})
        </h3>
        {onSearchWeb && (
          <PrimaryButton
            label={isSearching ? 'Searching...' : 'Search Web'}
            icon={ExternalLink}
            onClick={onSearchWeb}
            disabled={isSearching}
            className="px-3 py-1.5 text-xs"
          />
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white/70"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600">Min Score:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={filterMinScore}
              onChange={(e) => setFilterMinScore(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-xs bg-white/70"
            />
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/40">
              <th
                className="text-left py-2 px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => handleSort('matchScore')}
              >
                <div className="flex items-center gap-1">
                  Match Score
                  <ArrowUpDown size={12} className="text-gray-400" />
                </div>
              </th>
              <th
                className="text-left py-2 px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown size={12} className="text-gray-400" />
                </div>
              </th>
              <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                Skills
              </th>
              <th
                className="text-left py-2 px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => handleSort('experience')}
              >
                <div className="flex items-center gap-1">
                  Experience
                  <ArrowUpDown size={12} className="text-gray-400" />
                </div>
              </th>
              <th
                className="text-left py-2 px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center gap-1">
                  Location
                  <ArrowUpDown size={12} className="text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCandidates.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  No candidates found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-b border-white/20 hover:bg-white/30 transition-colors"
                >
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getScoreColor(
                        candidate.matchScore
                      )}`}
                    >
                      {candidate.matchScore}%
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-[10px] text-gray-500">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-1">
                      {candidate.matchedSkills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.matchedSkills.length > 3 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600">
                          +{candidate.matchedSkills.length - 3}
                        </span>
                      )}
                      {candidate.missingSkills.length > 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700">
                          -{candidate.missingSkills.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs text-gray-900">
                      {candidate.experience} years
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs text-gray-600">{candidate.location}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
