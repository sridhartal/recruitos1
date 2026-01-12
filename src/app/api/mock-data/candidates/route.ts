import { NextResponse } from 'next/server';
import { mockDataService } from '@/services/mockDataService';

export async function GET() {
  try {
    const candidates = mockDataService.getCandidates();
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}
