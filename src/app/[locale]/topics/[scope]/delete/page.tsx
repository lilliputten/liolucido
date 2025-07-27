import { ManageTopicsPage } from '@/components/pages/ManageTopicsPage/ManageTopicsPage';

interface DeleteTopicPageProps {
  searchParams: Promise<{ topicId: string }>;
}

export default async function DeleteTopicPage({ searchParams }: DeleteTopicPageProps) {
  const { topicId } = await searchParams;

  return <ManageTopicsPage deleteTopicId={topicId} />;
}
