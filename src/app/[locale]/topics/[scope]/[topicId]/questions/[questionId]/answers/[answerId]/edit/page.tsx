import { constructMetadata } from '@/lib/constructMetadata';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/config';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { EditAnswerPageHolder } from './EditAnswerPageHolder';

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

export default async function EditManageAnswerPageWrapper({ params }: TAwaitedProps) {
  const { topicId, questionId, answerId } = await params;

  if (!topicId) {
    return <PageError error={'No topic ID specified.'} />;
  }
  if (!questionId) {
    return <PageError error={'No question ID specified.'} />;
  }
  if (!answerId) {
    return <PageError error={'No answer ID specified.'} />;
  }

  return (
    <PageWrapper
      className={cn(
        isDev && '__EditManageAnswerPageWrapper', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__EditManageAnswerPageWrapper_Inner', // DEBUG
        'w-full rounded-lg gap-4 py-6',
      )}
      limitWidth
    >
      <EditAnswerPageHolder topicId={topicId} questionId={questionId} answerId={answerId} />
    </PageWrapper>
  );
}
