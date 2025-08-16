import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { UserTopicWorkoutSchema } from '@/generated/prisma';

const updateWorkoutSchema = UserTopicWorkoutSchema.omit({
  userId: true,
  topicId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

/** GET /api/workouts/[topicId] - Get specific workout */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
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
      const response: TApiResponse<null> = {
        data: null,
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Workout not found',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: TApiResponse<typeof workout> = {
      data: workout,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`workout-${topicId}`, `user-${user.id}-workouts`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'info', message: 'Workout loaded successfully' }],
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts/[topicId] GET]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch workout',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
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

    const response: TApiResponse<typeof workout> = {
      data: workout,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`workout-${topicId}`, `user-${user.id}-workouts`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Workout updated successfully' }],
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts/[topicId] PUT]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: error instanceof z.ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
        message: error instanceof z.ZodError ? 'Invalid workout data' : 'Failed to update workout',
        details:
          error instanceof z.ZodError
            ? { errors: error.errors }
            : { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: error instanceof z.ZodError ? 400 : 500 });
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

    const { topicId } = await params;

    await prisma.userTopicWorkout.delete({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId,
        },
      },
    });

    const response: TApiResponse<{ success: boolean }> = {
      data: { success: true },
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: [`workout-${topicId}`, `user-${user.id}-workouts`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Workout deleted successfully' }],
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /workouts/[topicId] DELETE]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete workout',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
