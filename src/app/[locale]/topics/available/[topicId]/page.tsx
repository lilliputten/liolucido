import { notFound } from 'next/navigation';

import { constructMetadata } from '@/lib/constructMetadata';
import { cn } from '@/lib/utils';
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

  let topic;
  try {
    topic = await getTopic(topicId);
    if (!topic) {
      notFound();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[src/app/[locale]/topics/available/[topicId]/page.tsx]', error);
    debugger; // eslint-disable-line no-debugger
    notFound();
  }

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
