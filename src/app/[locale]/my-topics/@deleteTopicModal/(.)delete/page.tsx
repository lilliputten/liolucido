import { ConfirmDeleteTopicModal } from '@/components/pages/MyTopicsPage/ConfirmDeleteTopicModal';
import { TTopicId } from '@/features/topics/types';

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
