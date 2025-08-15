'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { DeleteTopicModal } from '@/components/pages/ManageTopicsPage';
import { topicsRoutes } from '@/contexts/TopicsContext';

export default function DeleteTopicModalDefault() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const checkDelete = '/delete';
  const isDeleteRoute = pathname?.endsWith(checkDelete);
  const topicId = searchParams.get('topicId');

  if (isDeleteRoute && topicId) {
    // A path without final '/delete'
    const prevChunk = pathname.substring(0, pathname.length - checkDelete.length);
    const endsWithAPath = Object.values(topicsRoutes).find((path) => prevChunk.endsWith(path));
    if (endsWithAPath) {
      const from = searchParams.get('from') || undefined;
      return <DeleteTopicModal topicId={topicId} from={from} />;
    }
  }

  return null;
}
