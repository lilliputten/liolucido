import { ManageTopicQuestionAnswersPage } from '@/components/pages/ManageTopicQuestionAnswers';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
}>;

export default function AddAnswerModalPage({ params }: TAwaitedProps) {
  return <ManageTopicQuestionAnswersPage showAddModal={true} params={params} />;
}
