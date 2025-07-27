import { ManageTopicsPage } from '@/components/pages/ManageTopicsPage/ManageTopicsPage';

interface DeleteTopicPageProps {
  searchParams: Promise<{ id: string }>;
}

export default async function DeleteTopicPage({ searchParams }: DeleteTopicPageProps) {
  const { id } = await searchParams;

  return <ManageTopicsPage deleteTopicId={id} />;
}
