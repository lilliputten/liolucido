import { DeleteTopicModal } from '@/components/pages/ManageTopicsPage';

interface DeleteTopicModalPageProps {
  searchParams: Promise<{ topicId?: string }>;
}

export default async function DeleteTopicModalPage({ searchParams }: DeleteTopicModalPageProps) {
  const { topicId } = await searchParams;
  if (topicId) {
    return <DeleteTopicModal topicId={topicId} />;
  }
}
