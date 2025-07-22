'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TSettings } from '@/features/settings/types';

export async function updateSettings(settings: TSettings) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Got undefined user');
  }
  try {
    const update: Prisma.UserSettingsUncheckedUpdateInput = { ...settings };
    const create: Prisma.UserSettingsUncheckedCreateInput = { ...settings, userId };
    /* // Full type example:
     * const update: Prisma.XOR<Prisma.UserSettingsUpdateInput, Prisma.UserSettingsUncheckedUpdateInput> = { ...settings };
     */
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update,
      create,
    });
    return updatedSettings; // as TSettings;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[updateSettings] Caught error', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
