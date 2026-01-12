import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Only .txt files are supported' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    return NextResponse.json({
      success: true,
      filename: file.name,
      content: text,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
