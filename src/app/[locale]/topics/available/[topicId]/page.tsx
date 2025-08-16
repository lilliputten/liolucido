import { notFound } from 'next/navigation';

import { cn, constructMetadata } from '@/lib/utils';
import { AvailableTopicsPageWrapper, ViewAvailableTopic } from '@/components/pages/AvailableTopics';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { getTopic } from '@/features/topics/actions';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'View Available Topic';
  return constructMetadata({
    locale,
    title,
  });
}

export default async function ViewTopicPage({ params }: TAwaitedProps) {
  const { topicId } = await params;

  if (!topicId) {
    return <PageError error={'Not topic specified.'} />;
  }

  const topicResult = await getTopic(topicId);
  if (!topicResult.ok || !topicResult.data) {
    notFound();
  }
  const topic = topicResult.data;

  return (
    <AvailableTopicsPageWrapper>
      <PageHeader heading={'View Available Topic'} />
      <ViewAvailableTopic
        className={cn(
          isDev && '__page_ViewTopicPage', // DEBUG
        )}
        // topicId={topicId}
        topic={topic}
      />
    </AvailableTopicsPageWrapper>
  );
}
