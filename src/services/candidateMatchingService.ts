import { Candidate } from './mockDataService';
import { JobDescription } from '@/types/job';

export interface MatchedCandidate extends Candidate {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Calculate match score based on skills overlap
 * Returns a score from 0-100
 */
export function calculateMatchScore(
  candidate: Candidate,
  jobDescription: JobDescription
): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
} {
  const jobSkills = jobDescription.skills.map((skill) => skill.toLowerCase());
  const candidateSkills = candidate.skills.map((skill) => skill.toLowerCase());

  // Find matched and missing skills
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jobSkills.forEach((skill) => {
    // Check for exact match or partial match
    const matched = candidateSkills.some((cSkill) => {
      return cSkill.includes(skill) || skill.includes(cSkill);
    });

    if (matched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate base score from skill overlap (70% weight)
  const skillMatchRatio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
  const skillScore = skillMatchRatio * 70;

  // Calculate seniority match (20% weight)
  let seniorityScore = 0;
  const candidateExp = candidate.experience;
  const seniority = jobDescription.seniority?.toLowerCase() || '';

  if (seniority === 'junior' && candidateExp <= 3) {
    seniorityScore = 20;
  } else if (seniority === 'mid' && candidateExp >= 2 && candidateExp <= 5) {
    seniorityScore = 20;
  } else if (seniority === 'senior' && candidateExp >= 5) {
    seniorityScore = 20;
  } else {
    // Partial match based on proximity
    if (seniority === 'junior' && candidateExp <= 4) {
      seniorityScore = 10;
    } else if (seniority === 'mid' && candidateExp >= 1 && candidateExp <= 7) {
      seniorityScore = 10;
    } else if (seniority === 'senior' && candidateExp >= 4) {
      seniorityScore = 10;
    }
  }

  // Bonus for having more skills than required (10% weight)
  const extraSkills = candidateSkills.filter(
    (cSkill) => !jobSkills.some((jSkill) => cSkill.includes(jSkill) || jSkill.includes(cSkill))
  );
  const bonusScore = Math.min(extraSkills.length * 2, 10);

  const totalScore = Math.round(skillScore + seniorityScore + bonusScore);

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    matchedSkills: matchedSkills.map((s) => {
      // Return original case from job description
      return jobDescription.skills.find((js) => js.toLowerCase() === s) || s;
    }),
    missingSkills: missingSkills.map((s) => {
      return jobDescription.skills.find((js) => js.toLowerCase() === s) || s;
    }),
  };
}

/**
 * Match candidates against a job description
 */
export function matchCandidates(
  candidates: Candidate[],
  jobDescription: JobDescription
): MatchedCandidate[] {
  const matched = candidates.map((candidate) => {
    const { score, matchedSkills, missingSkills } = calculateMatchScore(candidate, jobDescription);

    return {
      ...candidate,
      matchScore: score,
      matchedSkills,
      missingSkills,
    };
  });

  // Sort by match score (descending)
  return matched.sort((a, b) => b.matchScore - a.matchScore);
}
