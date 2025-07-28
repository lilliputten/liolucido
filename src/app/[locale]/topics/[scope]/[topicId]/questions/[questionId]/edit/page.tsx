import { constructMetadata } from '@/lib/utils';
import { EditQuestionCard } from '@/components/pages/ManageTopicQuestions';
import { ManageTopicsPageWrapper } from '@/components/pages/ManageTopicsPage';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
}>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Edit Question Properties';
  return constructMetadata({
    locale,
    title,
  });
}

export default async function EditManageQuestionPage({ params }: TAwaitedProps) {
  const { questionId } = await params;

  if (!questionId) {
    return <PageError error={'Invalid question ID.'} />;
  }

  return (
    <ManageTopicsPageWrapper>
      <PageHeader heading={'Edit Question Properties'} />
      <EditQuestionCard questionId={questionId} />
    </ManageTopicsPageWrapper>
  );
}
