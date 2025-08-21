import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import {
  TopicsManageScopeIds,
  topicsNamespaces,
  topicsRoutes,
  TTopicsManageScopeId,
} from '@/contexts/TopicsContext';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';
import { ManageTopicsStoreProvider } from '@/stores/ManageTopicsStoreProvider';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId }>;

type TManageTopicsLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
  addTopicModal: React.ReactNode; // slot from @addTopicModal
  deleteTopicModal: React.ReactNode; // slot from @deleteTopicModal
};

export async function ManageTopicsLayout(props: TManageTopicsLayoutProps) {
  const {
    children,
    addTopicModal, // slot from @addTopicModal
    deleteTopicModal, // slot from @deleteTopicModal
    params,
  } = props;
  const { locale, scope: manageScope } = await params;

  const namespace = topicsNamespaces[manageScope];
  const routePath = topicsRoutes[manageScope];

  // An invalid scope received
  if (!namespace || !routePath) {
    // eslint-disable-next-line no-console
    console.warn('[ManageTopicsLayout] An invalid scope received:', manageScope);
    notFound();
  }

  const user = await getCurrentUser();
  const userId = user?.id;
  // TODO: Check also if the user really exists in the database>
  const isValidUser = !!userId && (await checkIfUserExists(userId));
  if (!isValidUser) {
    redirect(welcomeRoute);
  }

  const isAdminMode = manageScope === TopicsManageScopeIds.ALL_TOPICS;

  // Check if it's admin user for 'all' scope
  if (isAdminMode && user.role !== 'ADMIN') {
    // eslint-disable-next-line no-console
    console.warn('[ManageTopicsLayout] Admin user role required for topics scope', manageScope);
    notFound();
  }

  // const t = await getTranslations({ locale, namespace });

  // Enable static rendering
  setRequestLocale(locale);

  /*// UNUSED: Fetching the topics is proceeding on the client side, see `ManageTopicsListWrapper`. TODO: In the future the `TopicsContext` must be compeltely replcaed by react query-provided data
   * // const topicsPromise = isAdminMode ? getAllUsersTopics() : getThisUserTopics();
   * // const topics: TTopic[] = (await topicsPromise) || [];
   * const topicsPromise = getAvailableTopics({ adminMode: isAdminMode });
   * const topicResults = await topicsPromise;
   * const topics = topicResults.topics;
   */

  // TODO: Remove when done migrating to useAvailableTopicsByScope
  return (
    <ManageTopicsStoreProvider manageScope={manageScope}>
      {children}
      {addTopicModal}
      {deleteTopicModal}
    </ManageTopicsStoreProvider>
  );
}
