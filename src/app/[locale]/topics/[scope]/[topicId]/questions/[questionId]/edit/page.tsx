import { EditQuestionCard } from '@/components/pages/ManageTopicQuestions';
import { PageError } from '@/components/shared/PageError';

interface EditManageQuestionPageProps {
  params: {
    questionId: string;
  };
}

export default async function EditManageQuestionPage({ params }: EditManageQuestionPageProps) {
  const { questionId } = await params;

  if (!questionId) {
    return <PageError error={'Invalid question ID.'} />;
  }

  return <EditQuestionCard questionId={questionId} />;
}
