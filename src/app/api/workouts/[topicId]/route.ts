import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

const updateWorkoutSchema = z.object({
  questionsOrder: z.string().optional(),
  // finished: z.boolean().optional(),
});

/** GET /api/workouts/[topicId] - Get specific workout */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicId } = await params;

    const workout = await prisma.userTopicWorkout.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId,
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts/[topicId] GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** PUT /api/workouts/[topicId] - Update workout */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicId } = await params;
    const body = await request.json();
    const updateData = updateWorkoutSchema.parse(body);

    const workout = await prisma.userTopicWorkout.update({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId,
        },
      },
      data: updateData,
    });

    return NextResponse.json(workout);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts/[topicId] PUT]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/workouts/[topicId] - Delete workout */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicId } = await params;

    await prisma.userTopicWorkout.delete({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts/[topicId] DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
