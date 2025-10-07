import { constructMetadata } from '@/lib/constructMetadata';
import { EditAnswerCard } from '@/components/pages/ManageTopicQuestionAnswers';
import { ManageTopicsPageWrapper } from '@/components/pages/ManageTopicsPage';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
  answerId: string;
}>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Edit Answer Properties';
  return constructMetadata({
    locale,
    title,
  });
}

export default async function EditManageAnswerPage({ params }: TAwaitedProps) {
  const { topicId, questionId, answerId } = await params;

  if (!answerId) {
    return <PageError error={'Undefined answer ID.'} />;
  }

  return (
    <ManageTopicsPageWrapper>
      <PageHeader heading={'Edit Answer Properties'} />
      <EditAnswerCard topicId={topicId} questionId={questionId} answerId={answerId} />
    </ManageTopicsPageWrapper>
  );
}
