import { NextRequest, NextResponse } from 'next/server';

import { TApiResponse } from '@/lib/types/api';
import { getAvailableQuestions } from '@/features/questions/actions';

/** GET /api/topics/[topicId]/questions - Get questions for a topic */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;
    const results = await getAvailableQuestions({ topicId });
    // const { items: questions, totalCount } = results;

    const response: TApiResponse<typeof results> = {
      data: results,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /topics/[topicId]/questions GET]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch questions',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
