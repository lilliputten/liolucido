import { cn } from '@/lib/utils';
import { ViewTopicCard } from '@/components/pages/ManageTopicsPage/ViewTopicCard/ViewTopicCard';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';

interface EditManageTopicPageProps {
  params: {
    topicId: string;
  };
}

export default async function ViewTopicPage({ params }: EditManageTopicPageProps) {
  const { topicId } = await params;

  if (!topicId) {
    return <PageError error={'Not topic specified.'} />;
  }

  return (
    <ViewTopicCard
      className={cn(
        isDev && '__page_ViewTopicPage', // DEBUG
        'mx-4',
      )}
      topicId={topicId}
    />
  );
}
