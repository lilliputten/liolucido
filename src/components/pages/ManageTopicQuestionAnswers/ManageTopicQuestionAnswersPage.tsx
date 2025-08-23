import { getTranslations } from 'next-intl/server';

import { constructMetadata } from '@/lib/utils';
import { PageError } from '@/components/shared/PageError';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAnswerId } from '@/features/answers/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { ManageTopicsPageWrapper } from '../ManageTopicsPage';
import { PageHeader } from '../shared';
import { ManageTopicQuestionAnswersPageModalsWrapper } from './ManageTopicQuestionAnswersPageModalsWrapper';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
}>;

interface ManageTopicQuestionAnswersPageProps extends TAwaitedProps {
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

export async function ManageTopicQuestionAnswersPage(props: ManageTopicQuestionAnswersPageProps) {
  const { showAddModal, deleteAnswerId, editAnswerId, params } = props;

  const { locale, topicId, questionId } = await params;

  if (!topicId) {
    return <PageError error={'No topic ID specified.'} />;
  }

  if (!questionId) {
    return <PageError error={'No question ID specified.'} />;
  }

  const t = await getTranslations({ locale, namespace: 'ManageTopicQuestionAnswers' });

  return (
    <ManageTopicsPageWrapper>
      <PageHeader
        heading={t('title')}
        // text={t('description')}
      />
      <ManageTopicQuestionAnswersPageModalsWrapper
        topicId={topicId}
        questionId={questionId}
        showAddModal={showAddModal}
        deleteAnswerId={deleteAnswerId}
        editAnswerId={editAnswerId}
      />
    </ManageTopicsPageWrapper>
  );
}
