import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { UserTopicWorkoutSchema } from '@/generated/prisma';

// type TCreateWorkout = Omit<UserTopicWorkout, 'userId' | 'createdAt' | 'updatedAt'>;
const createWorkoutSchema = UserTopicWorkoutSchema.omit({
  userId: true,
  // topicId: true,
  createdAt: true,
  updatedAt: true,
});
type TCreateWorkout = z.infer<typeof createWorkoutSchema>;

/** POST /api/workouts - Create new workout */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const rawData: TCreateWorkout = {
      questionResults: '',
      questionsOrder: '',
      stepIndex: 0,
      started: false,
      finished: false,
      currentRatio: 0, // Current ratio (if finished)
      currentTime: 0, // Current time remained to finish, in seconds (if finished)
      correctAnswers: 0, // Current correct answers count (if finished)
      selectedAnswerId: '', // Answer for the current question. If defined then consider that user already chosen the answer but hasn't went to the next question (show the choice and suggest to go further)
      totalRounds: 0, // Total rounds for this workout
      allRatios: '', // All score ratios through all rounds, json packed list of ints (percent)
      allTimes: '', // All score times through all rounds, in seconds, json packed list of ints (seconds)
      averageRatio: 0, // Average score ratio through all rounds, percent
      averageTime: 0, // Average score time through all rounds, in seconds
      ...body,
    };
    const newWorkoutData = createWorkoutSchema.parse(rawData);
    const workout = await prisma.userTopicWorkout.create({
      data: { ...newWorkoutData, userId: user.id },
    });
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts POST]', error);
    debugger; // eslint-disable-line no-debugger
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
