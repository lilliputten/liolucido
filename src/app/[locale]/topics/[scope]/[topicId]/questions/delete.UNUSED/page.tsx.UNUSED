import { ManageTopicQuestionsPage } from '@/components/pages/ManageTopicQuestions';

interface DeleteTopicPageProps {
  searchParams: Promise<{ questionId: string }>;
}

export default async function DeleteTopicPage({ searchParams }: DeleteTopicPageProps) {
  const { questionId } = await searchParams;

  return <ManageTopicQuestionsPage deleteQuestionId={questionId} />;
}
