import { DeleteQuestionModal } from '@/components/pages/ManageTopicQuestions';
import { TQuestionId } from '@/features/questions/types';

interface DeleteQuestionModalPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function DeleteQuestionModalPage({
  searchParams,
}: DeleteQuestionModalPageProps) {
  const { id } = await searchParams;
  const questionId = id ? (parseInt(id) as TQuestionId) : undefined;
  if (questionId) {
    return <DeleteQuestionModal questionId={questionId} />;
  }
}
