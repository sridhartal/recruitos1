import { NextResponse } from 'next/server';
import { mockDataService } from '@/services/mockDataService';

export async function GET() {
  try {
    const hiringManagers = mockDataService.getHiringManagers();
    return NextResponse.json(hiringManagers);
  } catch (error) {
    console.error('Error fetching hiring managers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hiring managers' },
      { status: 500 }
    );
  }
}
