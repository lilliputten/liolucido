import { TTopicId } from '@/features/topics/types';
import { ConfirmDeleteTopicModal } from '@/pages/MyTopicsPage/ConfirmDeleteTopicModal';

interface DeleteTopicModalPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function DeleteTopicModalPage({ searchParams }: DeleteTopicModalPageProps) {
  const { id } = await searchParams;
  const topicId = id ? (parseInt(id) as TTopicId) : undefined;
  if (topicId) {
    return <ConfirmDeleteTopicModal topicId={topicId} />;
  }
}
