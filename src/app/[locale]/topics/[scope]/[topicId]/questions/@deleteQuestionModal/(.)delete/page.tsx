import { DeleteQuestionModal } from '@/components/pages/ManageTopicQuestions';

interface DeleteQuestionModalPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function DeleteQuestionModalPage({
  searchParams,
}: DeleteQuestionModalPageProps) {
  const { id } = await searchParams;
  if (id) {
    return <DeleteQuestionModal questionId={id} />;
  }
}
