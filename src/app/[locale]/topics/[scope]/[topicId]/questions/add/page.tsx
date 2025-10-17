// import { ManageTopicQuestionsPage } from '@/components/pages/ManageTopicQuestions/ManageTopicQuestionsPage';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

import ManageTopicQuestionsPage from '../page';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

export default function AddQuestionPage(props: TAwaitedProps) {
  const { params } = props;
  return <ManageTopicQuestionsPage params={params} />;
}
