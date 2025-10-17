import { getTranslations } from 'next-intl/server';

import { constructMetadata } from '@/lib/constructMetadata';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { isDev } from '@/config';
import { topicsNamespaces, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TTopicId } from '@/features/topics/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { ManageTopicsPageModalsWrapper } from './ManageTopicsPageModalsWrapper';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId }>;

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

interface TManageTopicsPageWrapperProps extends TAwaitedProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
  editQuestionsTopicId?: TTopicId;
  from?: string;
}

export default async function ManageTopicsPageWrapper(props: TManageTopicsPageWrapperProps) {
  const {
    showAddModal,
    deleteTopicId,
    editTopicId,
    editQuestionsTopicId,
    from,
    // params,
  } = props;
  // const resolvedParams = await params;
  // const { locale, scope } = resolvedParams;
  // const namespace = topicsNamespaces[scope];
  // const t = await getTranslations({ locale, namespace });
  return (
    <PageWrapper
      className={cn(
        isDev && '__ManageTopicsPageWrapper', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__ManageTopicsPageWrapper_Inner', // DEBUG
        'w-full rounded-lg gap-6 py-6',
      )}
      limitWidth
    >
      <ManageTopicsPageModalsWrapper
        showAddModal={showAddModal}
        deleteTopicId={deleteTopicId}
        editTopicId={editTopicId}
        editQuestionsTopicId={editQuestionsTopicId}
        from={from}
      />
    </PageWrapper>
  );
}
