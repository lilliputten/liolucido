import { DeleteTopicModal } from '@/components/pages/ManageTopicsPage/DeleteTopicModal';

interface DeleteTopicModalPageProps {
  searchParams: Promise<{ topicId?: string; from?: string }>;
}

export default async function DeleteTopicModalPage({ searchParams }: DeleteTopicModalPageProps) {
  const { topicId, from } = await searchParams;
  if (topicId) {
    return <DeleteTopicModal topicId={topicId} from={from} />;
  }
}
