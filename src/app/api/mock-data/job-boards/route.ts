import { NextResponse } from 'next/server';
import { mockDataService } from '@/services/mockDataService';

export async function GET() {
  try {
    const jobBoards = mockDataService.getJobBoardsConfig();
    return NextResponse.json(jobBoards);
  } catch (error) {
    console.error('Error fetching job boards config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job boards config' },
      { status: 500 }
    );
  }
}
