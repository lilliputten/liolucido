import { constructMetadata } from '@/lib/constructMetadata';
import { cn } from '@/lib/utils';
// import { ManageQuestionsPageWrapper } from '@/components/pages/ManageTopicQuestions';
import { ViewQuestionCard } from '@/components/pages/ManageTopicQuestions/ViewQuestionCard/ViewQuestionCard';
import { ManageTopicsPageWrapper } from '@/components/pages/ManageTopicsPage';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
}>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Manage Question';
  return constructMetadata({
    locale,
    title,
  });
}

export default async function ViewQuestionPage({ params }: TAwaitedProps) {
  const { topicId, questionId } = await params;

  if (!questionId) {
    return <PageError error={'No question specified.'} />;
  }

  return (
    <ManageTopicsPageWrapper>
      <PageHeader heading={'Manage Question'} />
      <ViewQuestionCard
        className={cn(
          isDev && '__page_ViewQuestionPage', // DEBUG
          'mx-4',
        )}
        topicId={topicId}
        questionId={questionId}
      />
    </ManageTopicsPageWrapper>
  );
}
