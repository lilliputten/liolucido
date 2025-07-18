import { EditMyTopicCard } from '@/components/pages/MyTopicsPage/EditMyTopic';
import { PageError } from '@/components/shared/PageError';
import { TTopicId } from '@/features/topics/types';

interface EditMyTopicPageProps {
  params: {
    topicId: string;
  };
}

export default async function EditMyTopicPage({ params }: EditMyTopicPageProps) {
  const { topicId: topicIdRaw } = await params;
  const topicId = topicIdRaw ? (parseInt(topicIdRaw) as TTopicId) : undefined;

  if (!topicId) {
    return <PageError error={'Invalid topic ID.'} />;
  }

  return <EditMyTopicCard topicId={topicId} />;
}
