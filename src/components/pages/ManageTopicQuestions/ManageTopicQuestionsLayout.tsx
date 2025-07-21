import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { TRoutePath, welcomeRoute } from '@/config/routesConfig';
import { getCurrentUser } from '@/lib/session';
import { constructMetadata } from '@/lib/utils';
import { PageError } from '@/components/shared/PageError';
import { QuestionsContextProvider } from '@/contexts/QuestionsContext';
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { getTopicQuestions } from '@/features/questions/actions/getTopicQuestions';
import { TQuestion } from '@/features/questions/types';
import { getTopic } from '@/features/topics/actions';
import { TTopicId } from '@/features/topics/types';
import { checkIfUserExists } from '@/features/users/actions/checkIfUserExists';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId; topicId: string }>;

type TManageTopicQuestionsLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
  addQuestionModal: React.ReactNode; // slot from @addQuestionModal
  deleteQuestionModal: React.ReactNode; // slot from @deleteQuestionModal
};

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

export async function ManageTopicQuestionsLayout(props: TManageTopicQuestionsLayoutProps) {
  const {
    children,
    addQuestionModal, // slot from @addQuestionModal
    deleteQuestionModal, // slot from @deleteQuestionModal
    params,
  } = props;
  const resolvedParams = await params;
  const { locale, scope, topicId: id } = resolvedParams;
  const topicId = id ? (parseInt(id) as TTopicId) : undefined;
  const topicRoutePath = topicsRoutes[scope];
  const routePath = `${topicRoutePath}/${topicId}/questions` as TRoutePath;

  if (!topicId) {
    return <PageError error={'Invalid topic ID.'} />;
  }

  const topic = await getTopic(topicId);
  if (!topic) {
    return <PageError error={'Not found a topic for the question.'} />;
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

  const questionsPromise = getTopicQuestions(topicId);
  const questions: TQuestion[] = await questionsPromise;

  return (
    <QuestionsContextProvider
      questions={questions}
      routePath={routePath}
      topicRoutePath={topicRoutePath}
      topicId={topicId}
      topicName={topic.name}
    >
      {children}
      {addQuestionModal}
      {deleteQuestionModal}
    </QuestionsContextProvider>
  );
}
