import { NextRequest, NextResponse } from 'next/server';

import { TApiResponse } from '@/shared/types/api';
import { getCurrentUser } from '@/lib/session';
import { updateSettings } from '@/features/settings/actions/updateSettings';
import { settingsSchema, TSettings } from '@/features/settings/types';

/** NOTE: Could be used alternatively, instead of direct call of the server function `src/features/settings/actions/updateSettings` */
export async function PUT(request: NextRequest) {
  try {
    // Check user authorization
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

    // Parse and validate request body
    const body = await request.json();
    const validatedSettings = settingsSchema.parse(body);

    // Update settings
    const updatedSettings = (await updateSettings(validatedSettings)) as TSettings;

    const response: TApiResponse<TSettings> = {
      data: updatedSettings,
      ok: true,
      invalidateKeys: ['settings', `user-${user.id}-settings`],
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['settings', `user-${user.id}-settings`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Settings updated successfully' }],
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /settings PUT]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: error instanceof Error ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal server error',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: error instanceof Error ? 400 : 500 });
  }
}
