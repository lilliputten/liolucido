import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { makeNullableFieldsOptional } from '@/lib/helpers/zod';
import { updateTopic } from '@/features/topics/actions';
import { TTopic } from '@/features/topics/types';
import { TopicSchema } from '@/generated/prisma';

const updateTopicSchema = makeNullableFieldsOptional(TopicSchema).omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
});

/** PUT /api/topics/[topicId] - Update topic */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;
    const body = await request.json();
    const topicData = updateTopicSchema.parse({ ...body, id: topicId });

    const updatedTopic = await updateTopic(topicData as TTopic);

    const response: TApiResponse<typeof updatedTopic> = {
      data: updatedTopic,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /topics/[topicId] PUT]', {
      error,
      params,
      request,
    });
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: error instanceof z.ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
        message:
          error instanceof z.ZodError
            ? 'Invalid topic data'
            : error instanceof Error
              ? error.message
              : 'Failed to update topic',
        details:
          error instanceof z.ZodError
            ? { errors: error.errors }
            : { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: error instanceof z.ZodError ? 400 : 500 });
  }
}
