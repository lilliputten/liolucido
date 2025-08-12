import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { UserTopicWorkoutSchema } from '@/generated/prisma';

const createWorkoutSchema = UserTopicWorkoutSchema.omit({
  userId: true,
  // topicId: true,
  createdAt: true,
  updatedAt: true,
});

/** POST /api/workouts - Create new workout */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      topicId,
      questionsOrder,
      // finished,
    } = createWorkoutSchema.parse(body);

    const workout = await prisma.userTopicWorkout.create({
      data: {
        userId: user.id,
        topicId,
        questionsOrder,
        // finished,
      },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts POST]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
