import { NextRequest, NextResponse } from 'next/server';

import { TApiResponse } from '@/shared/types/api';
import { getQuestionAnswers } from '@/features/answers/actions';

/** GET /api/questions/[questionId]/answers - Get answers for a question */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  try {
    const { questionId } = await params;
    const answers = await getQuestionAnswers(questionId);

    const response: TApiResponse<typeof answers> = {
      data: answers,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /questions/[questionId]/answers GET]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch answers',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
