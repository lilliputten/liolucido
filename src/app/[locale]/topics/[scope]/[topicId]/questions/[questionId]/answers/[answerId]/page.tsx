import { cn, constructMetadata } from '@/lib/utils';
import { ViewAnswerCard } from '@/components/pages/ManageTopicQuestionAnswers/ViewAnswerCard/ViewAnswerCard';
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
  answerId: string;
}>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const title = 'Manage Answer';
  return constructMetadata({
    locale,
    title,
  });
}

export default async function ViewAnswerPage({ params }: TAwaitedProps) {
  const { topicId, questionId, answerId } = await params;

  if (!answerId) {
    return <PageError error={'Not answer specified.'} />;
  }

  return (
    <ManageTopicsPageWrapper>
      <PageHeader heading={'Manage Answer'} />
      <ViewAnswerCard
        className={cn(
          isDev && '__page_ViewAnswerPage', // DEBUG
          // 'mx-4',
        )}
        topicId={topicId}
        questionId={questionId}
        answerId={answerId}
      />
    </ManageTopicsPageWrapper>
  );
}
