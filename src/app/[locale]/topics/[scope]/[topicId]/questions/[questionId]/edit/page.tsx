import { EditQuestionCard } from '@/components/pages/ManageTopicQuestions';
import { PageError } from '@/components/shared/PageError';
import { TQuestionId } from '@/features/questions/types';

interface EditManageQuestionPageProps {
  params: {
    questionId: string;
  };
}

export default async function EditManageQuestionPage({ params }: EditManageQuestionPageProps) {
  const { questionId: id } = await params;
  const questionId = id ? (parseInt(id) as TQuestionId) : undefined;

  if (!questionId) {
    return <PageError error={'Invalid question ID.'} />;
  }

  return <EditQuestionCard questionId={questionId} />;
}
