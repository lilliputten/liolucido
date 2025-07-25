'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { nulledSettings, TSettings } from '@/features/settings/types';

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
    return updatedSettings as TSettings;
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
    throw error;
  }
}
