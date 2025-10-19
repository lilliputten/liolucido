import { getTranslations } from 'next-intl/server';

import { constructMetadata } from '@/lib/constructMetadata';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/config';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAnswerId } from '@/features/answers/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { ManageTopicQuestionAnswersPageModalsWrapper } from './ManageTopicQuestionAnswersPageModalsWrapper';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
}>;

interface ManageTopicQuestionAnswersPageProps extends TAwaitedProps {
  showGenerateModal?: boolean;
  showAddModal?: boolean;
  deleteAnswerId?: TAnswerId;
  editAnswerId?: TAnswerId;
}

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ManageTopicQuestionAnswers' });
  const title = t('title');
  const description = t('description');
  return constructMetadata({
    locale,
    title,
    description,
  });
}

export default async function ManageTopicQuestionAnswersPageWrapper(
  props: ManageTopicQuestionAnswersPageProps,
) {
  const { showGenerateModal, showAddModal, deleteAnswerId, editAnswerId, params } = props;

  const { topicId, questionId } = await params;

  if (!topicId) {
    return <PageError error={'No topic ID specified.'} />;
  }

  if (!questionId) {
    return <PageError error={'No question ID specified.'} />;
  }

  // const t = await getTranslations({ locale, namespace: 'ManageTopicQuestionAnswers' });

  return (
    <PageWrapper
      className={cn(
        isDev && '__ManageTopicQuestionAnswersPageWrapper', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__ManageTopicQuestionAnswersPageWrapper_Inner', // DEBUG
        'w-full rounded-lg gap-4 py-6',
      )}
      limitWidth
    >
      <ManageTopicQuestionAnswersPageModalsWrapper
        topicId={topicId}
        questionId={questionId}
        showGenerateModal={showGenerateModal}
        showAddModal={showAddModal}
        deleteAnswerId={deleteAnswerId}
        editAnswerId={editAnswerId}
      />
    </PageWrapper>
  );
}
