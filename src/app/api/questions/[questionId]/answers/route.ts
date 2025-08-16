import { NextRequest, NextResponse } from 'next/server';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TAnswerData } from '@/features/answers/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      const response: TApiResponse<null> = {
        data: null,
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { questionId } = await params;

    /* // DEBUG: Emulate custom error
     * throw new Error('Test server error');
     */

    const answers = await prisma.answer.findMany({
      where: { questionId },
      select: {
        id: true,
        text: true,
        isCorrect: true,
        isGenerated: true,
        questionId: true,
        // createdAt: true,
        // updatedAt: true,
        // question: {
        //   select: {
        //     id: true,
        //     text: true,
        //     createdAt: true,
        //     updatedAt: true,
        //   },
        // },
      },
    });

    /* // DEBUG: Emulate mailformed plain text error (json is expected)
     * return new Response('SAMPLE PLAIN TEXT REPONSE', { headers: { 'Content-Type': 'text/plain' } });
     */

    const response: TApiResponse<TAnswerData[]> = {
      data: answers,
      ok: true,
      /* // TODO: Pass keys to invalidaate react query data, if necessary
       * invalidateKeys: [`question-${questionId}-answers`, `question-${questionId}`],
       */
      /* // TODO: Pass messages to display on the client side
       * messages: [{ type: 'success', message: `Loaded ${answers.length} answers` }],
       */
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /questions/[questionId]/answers GET]', error);
    // debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch answers',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
