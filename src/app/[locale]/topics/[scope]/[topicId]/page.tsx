import { cn, constructMetadata } from '@/lib/utils';
import { ManageTopicsPageWrapper } from '@/components/pages/ManageTopicsPage';
import { ViewTopicCard } from '@/components/pages/ManageTopicsPage/ViewTopicCard/ViewTopicCard';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Manage Topic';
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
    <ManageTopicsPageWrapper>
      <PageHeader heading={'Manage Topic'} />
      <ViewTopicCard
        className={cn(
          isDev && '__page_ViewTopicPage', // DEBUG
        )}
        topicId={topicId}
      />
    </ManageTopicsPageWrapper>
  );
}
