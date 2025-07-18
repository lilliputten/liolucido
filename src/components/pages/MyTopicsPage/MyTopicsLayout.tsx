import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import { constructMetadata } from '@/lib/utils';
import { SelectLanguageContextProvider } from '@/contexts/SelectLanguageContext';
import { TopicsContextProvider } from '@/contexts/TopicsContext';
import { getAllUsersTopics } from '@/features/topics/actions/getAllUsersTopics';
import { TTopic } from '@/features/topics/types';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

import { MyTopicsPageWrapper } from './MyTopicsPageWrapper';
import { PageHeader } from './PageHeader';

type TMyTopicsLayoutProps = TAwaitedLocaleProps & {
  children: React.ReactNode;
  addTopicModal: React.ReactNode; // slot from @addTopicModal
  deleteTopicModal: React.ReactNode; // slot from @deleteTopicModal
};

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MyTopicsPage' });
  const title = t('title');
  return constructMetadata({
    title,
    locale,
  });
}

export async function MyTopicsLayout(props: TMyTopicsLayoutProps) {
  const {
    children,
    addTopicModal, // slot from @addTopicModal
    deleteTopicModal, // slot from @deleteTopicModal
    params,
  } = props;
  const { locale } = await params;

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
    <TopicsContextProvider initialTopics={topics}>
      <SelectLanguageContextProvider>
        <MyTopicsPageWrapper>
          <PageHeader />
          {children}
          {addTopicModal}
          {deleteTopicModal}
        </MyTopicsPageWrapper>
      </SelectLanguageContextProvider>
    </TopicsContextProvider>
  );
}
