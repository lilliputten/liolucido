import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { getQuestion, updateQuestion } from '@/features/questions/actions';
import { TQuestionData } from '@/features/questions/types';

const updateQuestionSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  text: z.string().min(1),
  answersCountRandom: z.boolean().optional(),
  answersCountMin: z.union([z.string().optional(), z.number()]),
  answersCountMax: z.union([z.string().optional(), z.number()]),
});

/** GET /api/questions/[questionId] - Get question */
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
        message: error instanceof Error ? error.message : 'Failed to fetch question',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/** PUT /api/questions/[questionId] - Update question */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> },
) {
  try {
    const { questionId } = await params;
    const body = await request.json();
    const questionData = updateQuestionSchema.parse({ ...body, id: questionId });

    const updatedQuestion = await updateQuestion(questionData as TQuestionData);

    const response: TApiResponse<typeof updatedQuestion> = {
      data: updatedQuestion,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /questions/[questionId] PUT]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: error instanceof z.ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
        message:
          error instanceof z.ZodError
            ? 'Invalid question data'
            : error instanceof Error
              ? error.message
              : 'Failed to update question',
        details:
          error instanceof z.ZodError
            ? { errors: error.errors }
            : { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: error instanceof z.ZodError ? 400 : 500 });
  }
}
