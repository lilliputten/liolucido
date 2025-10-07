import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/lib/types/api';
import { createWorkout } from '@/features/workouts/actions/createWorkout';

/** POST /api/workouts - Create new workout */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workout = await createWorkout(body);
    const response: TApiResponse<typeof workout> = { data: workout, ok: true };
    return NextResponse.json(response, { status: 201 });
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
              : 'Failed to create workout',
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
