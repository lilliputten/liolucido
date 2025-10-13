import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import { PageError } from '@/components/shared/PageError';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

type TManageTopicQuestionsLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
  addQuestionModal: React.ReactNode; // slot from @addQuestionModal
  deleteQuestionModal: React.ReactNode; // slot from @deleteQuestionModal
};

export default async function ManageTopicQuestionsLayout(props: TManageTopicQuestionsLayoutProps) {
  const {
    children,
    addQuestionModal, // slot from @addQuestionModal
    deleteQuestionModal, // slot from @deleteQuestionModal
    params,
  } = props;
  const resolvedParams = await params;
  const {
    locale,
    // scope,
    topicId,
  } = resolvedParams;
  // const topicsListRoutePath = topicsRoutes[scope];
  // const topicRootRoutePath = `${topicsListRoutePath}/${topicId}` as TRoutePath;
  // const routePath = `${topicsListRoutePath}/${topicId}/questions` as TRoutePath;

  if (!topicId) {
    return <PageError error={'Topic ID not specified.'} />;
  }

  const user = await getCurrentUser();
  const userId = user?.id;
  // TODO: Check also if the user really exists in the database>
  const isValidUser = !!userId && (await checkIfUserExists(userId));
  if (!isValidUser) {
    redirect(welcomeRoute);
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      {children}
      {addQuestionModal}
      {deleteQuestionModal}
    </>
  );
}
