import { DeleteAnswerModal } from '@/components/pages/ManageTopicQuestionAnswers';

interface DeleteAnswerModalPageProps {
  searchParams: Promise<{ answerId?: string; from?: string }>;
}

export default async function DeleteAnswerModalPage({ searchParams }: DeleteAnswerModalPageProps) {
  const { answerId, from } = await searchParams;
  if (answerId) {
    return <DeleteAnswerModal answerId={answerId} from={from} />;
  }
}
