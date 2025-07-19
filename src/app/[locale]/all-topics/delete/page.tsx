import { ManageTopicsPage } from '@/components/pages/ManageTopicsPage/ManageTopicsPage';
import { TTopicId } from '@/features/topics/types';

interface DeleteTopicPageProps {
  searchParams: Promise<{ id: string }>;
}

export default async function DeleteTopicPage({ searchParams }: DeleteTopicPageProps) {
  const { id } = await searchParams;
  const topicId = id ? (parseInt(id) as TTopicId) : undefined;

  return <ManageTopicsPage deleteTopicId={topicId} />;
}
