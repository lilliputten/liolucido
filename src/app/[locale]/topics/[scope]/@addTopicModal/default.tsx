'use client';

import { usePathname } from 'next/navigation';

import { AddTopicModal } from '@/components/pages/ManageTopicsPage';
import { topicsRoutes } from '@/contexts/TopicsContext';

export default function AddTopicModalDefault() {
  const pathname = usePathname();

  // Only render the modal if we're on the /add route
  const checkAdd = '/add';
  const isAddRoute = pathname?.endsWith(checkAdd);

  if (isAddRoute) {
    // A path without final '/add'
    const prevChunk = pathname.substring(0, pathname.length - checkAdd.length);
    const endsWithAPath = Object.values(topicsRoutes).find((path) => prevChunk.endsWith(path));
    if (endsWithAPath) {
      return <AddTopicModal />;
    }
  }

  return null;
}
