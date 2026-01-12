import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    // Extract job description using Gemini
    const jobDescription = await geminiService.extractJobDescription(text);

    return NextResponse.json({
      success: true,
      jobDescription,
    });
  } catch (error) {
    console.error('Error parsing job description:', error);
    return NextResponse.json(
      { error: 'Failed to parse job description' },
      { status: 500 }
    );
  }
}
