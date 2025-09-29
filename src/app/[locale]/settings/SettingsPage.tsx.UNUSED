import { getCurrentUser } from '@/lib/session';

import { SettingsCard } from './SettingsCard';

export async function SettingsPage() {
  const user = await getCurrentUser();
  const userId = user?.id;
  return <SettingsCard userId={userId} />;
}
