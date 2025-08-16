import { NextRequest, NextResponse } from 'next/server';

import { TApiResponse } from '@/shared/types/api';
import { getQuestion } from '@/features/questions/actions';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  try {
    const { questionId } = await params;
    const question = await getQuestion(questionId);

    if (!question) {
      const response: TApiResponse<null> = {
        data: null,
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Question not found',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: TApiResponse<typeof question> = {
      data: question,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`question-${questionId}`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'info', message: 'Question loaded successfully' }],
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /questions/[questionId] GET]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch question',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
