import { DeleteQuestionModal } from '@/components/pages/ManageTopicQuestions';

interface DeleteQuestionModalPageProps {
  searchParams: Promise<{ questionId?: string; from?: string }>;
}

export default async function DeleteQuestionModalPage({
  searchParams,
}: DeleteQuestionModalPageProps) {
  const { questionId, from } = await searchParams;
  if (questionId) {
    return <DeleteQuestionModal questionId={questionId} from={from} />;
  }
}
