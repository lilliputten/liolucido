import { EditTopicCard } from '@/components/pages/ManageTopicsPage';
import { PageError } from '@/components/shared/PageError';
import { TTopicId } from '@/features/topics/types';

interface EditManageTopicPageProps {
  params: {
    topicId: string;
  };
}

export default async function EditManageTopicPage({ params }: EditManageTopicPageProps) {
  const { topicId: id } = await params;
  const topicId = id ? (parseInt(id) as TTopicId) : undefined;

  if (!topicId) {
    return <PageError error={'Invalid topic ID.'} />;
  }

  return <EditTopicCard topicId={topicId} />;
}
