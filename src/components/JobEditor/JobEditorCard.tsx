'use client';

import { useState } from 'react';
import { GlassCard, PrimaryButton } from '@/components/DesignSystem';
import { Edit2, Save, X, Send, Users } from 'lucide-react';

export interface JobDescription {
  title: string;
  skills: string[];
  seniority: string;
  salary?: string;
  location?: string;
  experience?: string;
}

interface JobEditorCardProps {
  jobDescription: JobDescription;
  onSave?: (job: JobDescription) => void;
  onCancel?: () => void;
  onPost?: (job: JobDescription) => Promise<void>;
  onMatchCandidates?: (job: JobDescription) => Promise<void>;
}

export default function JobEditorCard({ 
  jobDescription: initialJob, 
  onSave,
  onCancel,
  onPost,
  onMatchCandidates
}: JobEditorCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [jobDescription, setJobDescription] = useState<JobDescription>(initialJob);
  const [newSkill, setNewSkill] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setJobDescription(initialJob);
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(jobDescription);
    }
  };

  const handleFieldChange = (field: keyof JobDescription, value: string | string[]) => {
    setJobDescription(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobDescription.skills.includes(newSkill.trim())) {
      handleFieldChange('skills', [...jobDescription.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleFieldChange(
      'skills',
      jobDescription.skills.filter(skill => skill !== skillToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const handlePost = async () => {
    if (onPost) {
      setIsPosting(true);
      try {
        await onPost(jobDescription);
      } finally {
        setIsPosting(false);
      }
    }
  };

  const handleMatchCandidates = async () => {
    if (onMatchCandidates) {
      setIsMatching(true);
      try {
        await onMatchCandidates(jobDescription);
      } finally {
        setIsMatching(false);
      }
    }
  };

  return (
    <GlassCard className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 leading-tight">Job Description</h3>
        {!isEditing ? (
          <div className="flex items-center gap-2">
            {onMatchCandidates && (
              <PrimaryButton
                label={isMatching ? "Matching..." : "Match Candidates"}
                icon={Users}
                onClick={handleMatchCandidates}
                disabled={isMatching || isPosting}
                className="px-3 py-1.5 text-xs"
              />
            )}
            {onPost && (
              <PrimaryButton
                label={isPosting ? "Posting..." : "Post"}
                icon={Send}
                onClick={handlePost}
                className="px-3 py-1.5 text-xs"
                disabled={isPosting || isMatching}
              />
            )}
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-white/50"
            >
              <Edit2 size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-white/50"
            >
              <X size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium">Cancel</span>
            </button>
            <PrimaryButton
              label="Save"
              icon={Save}
              onClick={handleSave}
              className="px-3 py-1.5 text-xs"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={jobDescription.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
            />
          ) : (
            <p className="text-gray-900 font-medium text-sm leading-relaxed">{jobDescription.title}</p>
          )}
        </div>

        {/* Seniority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seniority Level
          </label>
          {isEditing ? (
            <select
              value={jobDescription.seniority}
              onChange={(e) => handleFieldChange('seniority', e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm bg-white"
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          ) : (
            <p className="text-gray-900 text-sm leading-relaxed">{jobDescription.seniority}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {jobDescription.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/50 rounded-full text-sm text-gray-900 border border-white/50"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add skill..."
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Salary */}
        {jobDescription.salary && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            {isEditing ? (
              <input
                type="text"
                value={jobDescription.salary}
                onChange={(e) => handleFieldChange('salary', e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
              />
            ) : (
              <p className="text-gray-900 text-sm leading-relaxed">{jobDescription.salary}</p>
            )}
          </div>
        )}

        {/* Location */}
        {jobDescription.location && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={jobDescription.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
              />
            ) : (
              <p className="text-gray-900 text-sm leading-relaxed">{jobDescription.location}</p>
            )}
          </div>
        )}

        {/* Experience */}
        {jobDescription.experience && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Required
            </label>
            {isEditing ? (
              <input
                type="text"
                value={jobDescription.experience}
                onChange={(e) => handleFieldChange('experience', e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
              />
            ) : (
              <p className="text-gray-900 text-sm leading-relaxed">{jobDescription.experience}</p>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
