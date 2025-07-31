import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

import { ContentSkeleton } from './ContentSkeleton';

export function ManageTopicQuestionsLoading() {
  return (
    <ContentSkeleton
      className={cn(
        isDev && '__ManageTopicQuestionsLoading', // DEBUG
      )}
    />
  );
}
