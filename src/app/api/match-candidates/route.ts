import { NextRequest, NextResponse } from 'next/server';
import { mockDataService } from '@/services/mockDataService';
import { matchCandidates } from '@/services/candidateMatchingService';
import { JobDescription } from '@/components/JobEditor/JobEditorCard';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const candidates = mockDataService.getCandidates();
    const matchedCandidates = matchCandidates(candidates, jobDescription as JobDescription);

    return NextResponse.json({
      candidates: matchedCandidates,
      total: matchedCandidates.length,
    });
  } catch (error) {
    console.error('Error matching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to match candidates' },
      { status: 500 }
    );
  }
}
