import { redirect } from 'next/navigation';

import { TRoutePath, welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import { PageError } from '@/components/shared/PageError';
import { QuestionsContextProvider } from '@/contexts/QuestionsContext';
import { TopicsManageScopeIds, topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { getTopicQuestions } from '@/features/questions/actions/getTopicQuestions';
import { TQuestion } from '@/features/questions/types';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  //  scope: TTopicsManageScopeId;
  topicId: string;
}>;

type TWorkoutTopicLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
};

const scope: TTopicsManageScopeId = TopicsManageScopeIds.AVAILABLE_TOPICS;

export async function WorkoutTopicLayout(props: TWorkoutTopicLayoutProps) {
  const { children, params } = props;
  const resolvedParams = await params;
  const { topicId } = resolvedParams;
  const topicsListRoutePath = topicsRoutes[scope];
  const topicRootRoutePath = `${topicsListRoutePath}/${topicId}` as TRoutePath;
  /** Default url for the topic */
  const routePath = `${topicsListRoutePath}/${topicId}/workout` as TRoutePath;

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

  const questionsPromise = getTopicQuestions(topicId);
  const questions: TQuestion[] = await questionsPromise;

  return (
    <QuestionsContextProvider
      questions={questions}
      routePath={routePath}
      topicRootRoutePath={topicRootRoutePath}
      topicsListRoutePath={topicsListRoutePath}
      topicId={topicId}
    >
      {children}
    </QuestionsContextProvider>
  );
}
