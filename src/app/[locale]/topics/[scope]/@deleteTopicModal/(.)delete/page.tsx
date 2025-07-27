import { DeleteTopicModal } from '@/components/pages/ManageTopicsPage';

interface DeleteTopicModalPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function DeleteTopicModalPage({ searchParams }: DeleteTopicModalPageProps) {
  const { id: topicId } = await searchParams;
  if (topicId) {
    return <DeleteTopicModal topicId={topicId} />;
  }
}
