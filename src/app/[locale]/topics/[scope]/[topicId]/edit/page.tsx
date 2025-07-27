import { EditTopicCard } from '@/components/pages/ManageTopicsPage';
import { PageError } from '@/components/shared/PageError';

interface EditManageTopicPageProps {
  params: {
    topicId: string;
  };
}

export default async function EditManageTopicPage({ params }: EditManageTopicPageProps) {
  const { topicId } = await params;

  if (!topicId) {
    return <PageError error={'Invalid topic ID.'} />;
  }

  return <EditTopicCard topicId={topicId} />;
}
