import { redirect } from 'next/navigation';

import { defaultTopicsManageScope, topicsRoutes } from '@/contexts/TopicsContextConstants';

export default async function DefaultRootPage() {
  const route = topicsRoutes[defaultTopicsManageScope];
  redirect(route);
}
