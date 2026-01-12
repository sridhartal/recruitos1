import { NextRequest, NextResponse } from 'next/server';
import { mockDataService } from '@/services/mockDataService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, jobBoards } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const config = mockDataService.getJobBoardsConfig();
    const enabledBoards = jobBoards || Object.keys(config).filter(
      (key) => config[key].enabled
    );

    const results = await Promise.all(
      enabledBoards.map(async (boardKey: string) => {
        const board = config[boardKey];
        if (!board || !board.enabled) {
          return { board: boardKey, success: false, error: 'Board not enabled' };
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, board.simulationDelay || 2000));

        // Simulate success (90% success rate for demo)
        const success = Math.random() > 0.1;

        return {
          board: board.name,
          boardKey,
          success,
          message: success
            ? `Job posted successfully to ${board.name}`
            : `Failed to post to ${board.name}`,
        };
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
      },
    });
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json(
      { error: 'Failed to post job' },
      { status: 500 }
    );
  }
}
