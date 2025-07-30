import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { TRoutePath, welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import { PageError } from '@/components/shared/PageError';
import { AnswersContextProvider } from '@/contexts/AnswersContext';
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { getQuestionAnswers } from '@/features/answers/actions/getQuestionAnswers';
import { TAnswer } from '@/features/answers/types';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
  topicId: string;
  questionId: string;
}>;

type TManageTopicQuestionAnswersLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
  addAnswerModal: React.ReactNode; // slot from @addAnswerModal
  deleteAnswerModal: React.ReactNode; // slot from @deleteAnswerModal
};

export async function ManageTopicQuestionAnswersLayout(
  props: TManageTopicQuestionAnswersLayoutProps,
) {
  const {
    children,
    addAnswerModal, // slot from @addAnswerModal
    deleteAnswerModal, // slot from @deleteAnswerModal
    params,
  } = props;
  const resolvedParams = await params;
  const { locale, scope, topicId, questionId } = resolvedParams;
  const topicsListRoutePath = topicsRoutes[scope];
  const topicRootRoutePath = `${topicsListRoutePath}/${topicId}` as TRoutePath;
  const questionsListRoutePath = `${topicRootRoutePath}/questions` as TRoutePath;
  const questionRootRoutePath = `${questionsListRoutePath}/${questionId}` as TRoutePath;
  const routePath = `${questionRootRoutePath}/answers` as TRoutePath;

  if (!topicId) {
    return <PageError error={'No topic ID specified.'} />;
  }

  if (!questionId) {
    return <PageError error={'No question ID specified.'} />;
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

  const answers: TAnswer[] = await getQuestionAnswers(questionId);

  return (
    <AnswersContextProvider
      answers={answers}
      routePath={routePath}
      questionRootRoutePath={questionRootRoutePath}
      questionsListRoutePath={questionsListRoutePath}
      questionId={questionId}
      topicRootRoutePath={topicRootRoutePath}
      topicsListRoutePath={topicsListRoutePath}
      topicId={topicId}
    >
      {children}
      {addAnswerModal}
      {deleteAnswerModal}
    </AnswersContextProvider>
  );
}
