import { TTopicId } from '@/features/topics/types';
import { MyTopicsPage } from '@/pages/MyTopicsPage/MyTopicsPage';

interface DeleteTopicPageProps {
  searchParams: Promise<{ id: string }>;
}

export default async function DeleteTopicPage({ searchParams }: DeleteTopicPageProps) {
  const { id } = await searchParams;
  const topicId = id ? (parseInt(id) as TTopicId) : undefined;

  return <MyTopicsPage deleteTopicId={topicId} />;
}
