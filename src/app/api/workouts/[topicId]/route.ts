import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/lib/types/api';
import { deleteWorkout } from '@/features/workouts/actions/deleteWorkout';
import { getWorkout } from '@/features/workouts/actions/getWorkout';
import { updateWorkout } from '@/features/workouts/actions/updateWorkout';

/** GET /api/workouts/[topicId] - Get specific workout */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;

    const workout = await getWorkout(topicId);

    if (!workout) {
      const response: TApiResponse<null> = {
        data: null,
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Training not found',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: TApiResponse<typeof workout> = {
      data: workout,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    const isAuthError = error instanceof Error && error.message === 'Authentication required';
    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: isAuthError ? 'UNAUTHORIZED' : 'INTERNAL_ERROR',
        message: isAuthError ? error.message : 'Failed to fetch workout',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
    return NextResponse.json(response, { status: isAuthError ? 401 : 500 });
  }
}

/** PUT /api/workouts/[topicId] - Update workout */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;
    const body = await request.json();
    const workout = await updateWorkout(topicId, body);

    const response: TApiResponse<typeof workout> = {
      data: workout,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    const isAuthError = error instanceof Error && error.message === 'Authentication required';
    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code:
          error instanceof z.ZodError
            ? 'VALIDATION_ERROR'
            : isAuthError
              ? 'UNAUTHORIZED'
              : 'INTERNAL_ERROR',
        message:
          error instanceof z.ZodError
            ? 'Invalid workout data'
            : isAuthError
              ? error.message
              : 'Failed to update workout',
        details:
          error instanceof z.ZodError
            ? { errors: error.errors }
            : { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, {
      status: error instanceof z.ZodError ? 400 : isAuthError ? 401 : 500,
    });
  }
}

/** DELETE /api/workouts/[topicId] - Delete workout */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;
    await deleteWorkout(topicId);

    const response: TApiResponse<{ success: boolean }> = {
      data: { success: true },
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    const isAuthError = error instanceof Error && error.message === 'Authentication required';
    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: isAuthError ? 'UNAUTHORIZED' : 'INTERNAL_ERROR',
        message: isAuthError ? error.message : 'Failed to delete workout',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: isAuthError ? 401 : 500 });
  }
}
