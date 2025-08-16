'use server';

import { Prisma } from '@prisma/client';

import { TApiResponse } from '@/shared/types/api';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { nulledSettings, TSettings } from '@/features/settings/types';

export async function updateSettings(settings: TSettings): Promise<TApiResponse<TSettings>> {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    return {
      data: null,
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    };
  }
  // NOTE: Don't pass userId to `create`
  const { userId: _, ...settingsForCreate } = { ...nulledSettings, ...settings };
  const update: Prisma.UserSettingsUpdateInput = settingsForCreate;
  const create: Prisma.UserSettingsCreateInput = {
    ...settingsForCreate,
    user: { connect: { id: userId } },
  };
  try {
    /* // Full type example:
     * const update: Prisma.XOR<Prisma.UserSettingsUpdateInput, Prisma.UserSettingsUncheckedUpdateInput> = { ...settings };
     */
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update,
      create,
    });

    return {
      data: updatedSettings as TSettings,
      ok: true,
      // TODO: Add invalidation keys for React Query
      // invalidateKeys: ['settings', `user-${userId}-settings`],
      // TODO: Add service messages for client display
      // messages: [{ type: 'success', message: 'Settings updated successfully' }],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateSettings] Caught error', {
      error,
      update,
      create,
      user,
      userId,
    });
    debugger; // eslint-disable-line no-debugger

    return {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update settings',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
  }
}
