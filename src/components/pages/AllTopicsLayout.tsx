import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import { constructMetadata } from '@/lib/utils';
import { TopicsContextProvider } from '@/contexts/TopicsContext';
import { TopicsManageTypes } from '@/contexts/TopicsContextConstants';
import { getAllUsersTopics } from '@/features/topics/actions/getAllUsersTopics';
import { TTopic } from '@/features/topics/types';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { ManageTopicsPageWrapper } from './ManageTopicsPage';
import { PageHeader } from './shared';

type TAllTopicsLayoutProps = TAwaitedLocaleProps & {
  children: React.ReactNode;
  addTopicModal: React.ReactNode; // slot from @addTopicModal
  deleteTopicModal: React.ReactNode; // slot from @deleteTopicModal
};

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AllTopicsPage' });
  return constructMetadata({
    locale,
    title: t('title'),
    description: t('description'),
  });
}

export async function AllTopicsLayout(props: TAllTopicsLayoutProps) {
  const {
    children,
    addTopicModal, // slot from @addTopicModal
    deleteTopicModal, // slot from @deleteTopicModal
    params,
  } = props;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AllTopicsPage' });

  // NOTE: Checking NEXT_PUBLIC_USER_REQUIRED or existed user session
  const user = await getCurrentUser();
  const userId = user?.id;
  // TODO: Check also if the user really exists in the database>
  const isValidUser = !!userId && (await checkIfUserExists(userId));
  if (!isValidUser) {
    redirect(welcomeRoute);
  }

  // Enable static rendering
  setRequestLocale(locale);

  const topics: TTopic[] | undefined = await getAllUsersTopics();

  return (
    <TopicsContextProvider
      topics={topics}
      namespace={'AllTopicsPage'}
      manageType={TopicsManageTypes.ALL_TOPICS}
    >
      <ManageTopicsPageWrapper>
        <PageHeader heading={t('title')} text={t('description')} />
        {children}
        {addTopicModal}
        {deleteTopicModal}
      </ManageTopicsPageWrapper>
    </TopicsContextProvider>
  );
}
