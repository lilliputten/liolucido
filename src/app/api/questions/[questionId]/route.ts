import { NextRequest, NextResponse } from 'next/server';

import { getQuestion } from '@/features/questions/actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  try {
    const { questionId } = await params;
    const question = await getQuestion(questionId);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch question:', error);
    debugger; // eslint-disable-line no-debugger
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
