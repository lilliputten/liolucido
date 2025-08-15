import { ManageTopicQuestionsPage } from '@/components/pages/ManageTopicQuestions';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

interface DeleteTopicPageProps extends TAwaitedProps {
  searchParams: Promise<{ questionId: string }>;
}

export default async function DeleteTopicPage({ searchParams, params }: DeleteTopicPageProps) {
  const { questionId } = await searchParams;

  return <ManageTopicQuestionsPage params={params} deleteQuestionId={questionId} />;
}
