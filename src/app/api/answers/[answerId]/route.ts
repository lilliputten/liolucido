import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { deleteAnswer, updateAnswer } from '@/features/answers/actions';
import { TAnswer } from '@/features/answers/types';

const updateAnswerSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  questionId: z.string(),
  isCorrect: z.boolean().optional(),
  isGenerated: z.boolean().optional(),
});

/** PUT /api/answers/[answerId] - Update answer */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ answerId: string }> },
) {
  try {
    const { answerId } = await params;
    const body = await request.json();
    const answerData = updateAnswerSchema.parse({ ...body, id: answerId });

    const updatedAnswer = await updateAnswer(answerData as TAnswer);

    const response: TApiResponse<typeof updatedAnswer> = {
      data: updatedAnswer,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /answers/[answerId] PUT]', error);

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
              : 'Failed to update answer',
        details:
          error instanceof z.ZodError
            ? { errors: error.errors }
            : { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: error instanceof z.ZodError ? 400 : 500 });
  }
}

/** DELETE /api/answers/[answerId] - Delete answer */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ answerId: string }> },
) {
  try {
    const { answerId } = await params;
    const body = await request.json();
    const answerData = body as TAnswer;

    const deletedAnswer = await deleteAnswer(answerData);

    const response: TApiResponse<typeof deletedAnswer> = {
      data: deletedAnswer,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /answers/[answerId] DELETE]', error);

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to delete answer',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
