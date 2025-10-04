import { constructMetadata } from '@/lib/constructMetadata';
import { cn } from '@/lib/utils';
import { AvailableTopicsPageWrapper, WorkoutTopicGo } from '@/components/pages/AvailableTopics';
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

export default async function ViewTopicGoPage({ params }: TAwaitedProps) {
  const { topicId } = await params;

  if (!topicId) {
    return <PageError error={'Not topic specified.'} />;
  }

  // TODO: Check if no active workout and then go to workout review/control page (on the client, because the user might be unauthorized)

  return (
    <AvailableTopicsPageWrapper>
      <PageHeader heading={'Workout Topic'} />
      <WorkoutTopicGo
        className={cn(
          isDev && '__page_ViewTopicGoPage', // DEBUG
        )}
        // topicId={topicId}
      />
    </AvailableTopicsPageWrapper>
  );
}
