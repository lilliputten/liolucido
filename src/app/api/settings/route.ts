import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/session';
import { updateSettings } from '@/features/settings/actions/updateSettings';
import { settingsSchema } from '@/features/settings/types';

/** NOTE: Could be used alternatively, instead of direct call of the server function `src/features/settings/actions/updateSettings` */
export async function PUT(request: NextRequest) {
  try {
    // Check user authorization
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedSettings = settingsSchema.parse(body);

    // Update settings
    const updatedSettings = await updateSettings(validatedSettings);

    return NextResponse.json(updatedSettings);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API /settings PUT]', error);
    debugger; // eslint-disable-line no-debugger
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
