import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { updateTopic } from '@/features/topics/actions';
import { TTopic } from '@/features/topics/types';

const updateTopicSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  keywords: z.string().optional(),
  langCode: z.string().optional(),
  langName: z.string().optional(),
  langCustom: z.boolean().optional(),
  answersCountRandom: z.boolean().optional(),
  answersCountMin: z.union([z.string().optional(), z.number()]),
  answersCountMax: z.union([z.string().optional(), z.number()]),
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
    console.error('[API /topics/[topicId] PUT]', error);
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
