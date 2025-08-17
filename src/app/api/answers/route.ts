import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { addNewAnswer } from '@/features/answers/actions';
import { TNewAnswer } from '@/features/answers/types';

const addAnswerSchema = z.object({
  text: z.string().min(1),
  questionId: z.string(),
  isCorrect: z.boolean().optional(),
  isGenerated: z.boolean().optional(),
});

/** POST /api/answers - Add new answer */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAnswerData = addAnswerSchema.parse(body);

    const answer = await addNewAnswer(newAnswerData as TNewAnswer);

    const response: TApiResponse<typeof answer> = {
      data: answer,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /answers POST]', error);

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: error instanceof z.ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
        message:
          error instanceof z.ZodError
            ? 'Invalid answer data'
            : error instanceof Error
              ? error.message
              : 'Failed to create answer',
        details:
          error instanceof z.ZodError
            ? { errors: error.errors }
            : { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: error instanceof z.ZodError ? 400 : 500 });
  }
}
