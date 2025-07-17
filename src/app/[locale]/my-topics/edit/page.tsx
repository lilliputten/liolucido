import { EditMyTopicCard } from '@/components/pages/MyTopicsPage/EditMyTopicCard';
import { PageError } from '@/components/shared/PageError';
import { TTopicId } from '@/features/topics/types';

interface EditMyTopicPageProps {
  searchParams: Promise<{ id: string }>;
}

export default async function EditMyTopicPage({ searchParams }: EditMyTopicPageProps) {
  const { id } = await searchParams;
  const topicId = id ? (parseInt(id) as TTopicId) : undefined;

  if (!topicId) {
    return <PageError error={'No topic specified.'} />;
  }

  return <EditMyTopicCard topicId={topicId} />;
}
