import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

import { ContentSkeleton } from './ContentSkeleton';

export function ManageTopicQuestionAnswersLoading() {
  return (
    <ContentSkeleton
      className={cn(
        isDev && '__ManageTopicQuestionAnswersLoading', // DEBUG
      )}
    />
  );
}
