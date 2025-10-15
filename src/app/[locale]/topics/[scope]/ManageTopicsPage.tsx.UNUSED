import { getTranslations } from 'next-intl/server';

import { constructMetadata } from '@/lib/constructMetadata';
import { topicsNamespaces, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TTopicId } from '@/features/topics/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { PageHeader } from '../shared';
import { ManageTopicsPageModalsWrapper } from './ManageTopicsPageModalsWrapper';
import { ManageTopicsPageWrapper } from './ManageTopicsPageWrapper';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId }>;

interface ManageTopicsPageProps extends TAwaitedProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
  editQuestionsTopicId?: TTopicId;
  from?: string;
}

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale, scope } = await params;
  const namespace = topicsNamespaces[scope];
  if (namespace) {
    const t = await getTranslations({ locale, namespace });
    const title = t('title');
    const description = t('description');
    return constructMetadata({
      locale,
      title,
      description,
    });
  }
}

export async function ManageTopicsPage(props: ManageTopicsPageProps) {
  const { showAddModal, deleteTopicId, editTopicId, editQuestionsTopicId, from, params } = props;
  const resolvedParams = await params;
  const { locale, scope } = resolvedParams;
  const namespace = topicsNamespaces[scope];
  const t = await getTranslations({ locale, namespace });
  return (
    <ManageTopicsPageWrapper>
      <PageHeader heading={t('title')} text={t('description')} />
      <ManageTopicsPageModalsWrapper
        showAddModal={showAddModal}
        deleteTopicId={deleteTopicId}
        editTopicId={editTopicId}
        editQuestionsTopicId={editQuestionsTopicId}
        from={from}
      />
    </ManageTopicsPageWrapper>
  );
}
