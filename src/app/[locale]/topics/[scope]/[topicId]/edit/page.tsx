import { constructMetadata } from '@/lib/utils';
import { EditTopicCard, ManageTopicsPageWrapper } from '@/components/pages/ManageTopicsPage';
import { PageHeader } from '@/components/pages/shared';
import { PageError } from '@/components/shared/PageError';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  // const t = await getTranslations({ locale, namespace });
  const title = 'Manage Topic Properties';
  return constructMetadata({
    locale,
    title,
    // description,
  });
}

export default async function EditManageTopicPage({ params }: TAwaitedProps) {
  const { topicId } = await params;

  if (!topicId) {
    return <PageError error={'Topic ID not specified.'} />;
  }

  return (
    <ManageTopicsPageWrapper>
      <PageHeader heading={'Manage Topic Properties'} />
      <EditTopicCard topicId={topicId} />
    </ManageTopicsPageWrapper>
  );
}
