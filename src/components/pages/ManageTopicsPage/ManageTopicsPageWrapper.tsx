import { cn, constructMetadata } from '@/lib/utils';
import { AvailableTopicsPageWrapper, ViewAvailableTopic } from '@/components/pages/AvailableTopics';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Workout Topic';
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

  return (
    <AvailableTopicsPageWrapper>
      <PageHeader heading={'Workout Topic'} />
      <ViewAvailableTopic
        className={cn(
          isDev && '__page_ViewTopicPage', // DEBUG
        )}
        topicId={topicId}
      />
    </AvailableTopicsPageWrapper>
  );
}
