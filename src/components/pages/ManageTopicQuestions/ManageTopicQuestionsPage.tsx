import { getTranslations } from 'next-intl/server';

import { constructMetadata } from '@/lib/utils';
import { PageError } from '@/components/shared/PageError';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TQuestionId } from '@/features/questions/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { ManageTopicsPageWrapper } from '../ManageTopicsPage';
import { PageHeader } from '../shared';
import { ManageTopicQuestionsPageModalsWrapper } from './ManageTopicQuestionsPageModalsWrapper';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

interface ManageTopicQuestionsPageProps extends TAwaitedProps {
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
  editAnswersQuestionId?: TQuestionId;
}

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ManageTopicQuestions' });
  const title = t('title');
  const description = t('description');
  return constructMetadata({
    locale,
    title,
    description,
  });
}

export async function ManageTopicQuestionsPage(props: ManageTopicQuestionsPageProps) {
  const { showAddModal, deleteQuestionId, editQuestionId, editAnswersQuestionId, params } = props;

  const resolvedParams = await params;
  const { locale, topicId } = resolvedParams;

  if (!topicId) {
    return <PageError error={'No topic specified.'} />;
  }

  const t = await getTranslations({ locale, namespace: 'ManageTopicQuestions' });

  return (
    <ManageTopicsPageWrapper>
      <PageHeader
        heading={t('title')}
        // text={t('description')}
      />
      <ManageTopicQuestionsPageModalsWrapper
        showAddModal={showAddModal}
        deleteQuestionId={deleteQuestionId}
        editQuestionId={editQuestionId}
        editAnswersQuestionId={editAnswersQuestionId}
      />
    </ManageTopicsPageWrapper>
  );
}
