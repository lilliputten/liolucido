import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/session';
import { WorkoutContextProvider } from '@/contexts/WorkoutContext';
import { getTopicQuestions } from '@/features/questions/actions';
import { getTopic } from '@/features/topics/actions';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ topicId: string }>;

interface WorkoutLayoutProps extends TAwaitedProps {
  children: React.ReactNode;
}

export default async function WorkoutLayout({ children, params }: WorkoutLayoutProps) {
  const { topicId } = await params;

  const user = await getCurrentUser();
  const userId = user?.id;

  const topic = await getTopic(topicId);
  if (!topic) {
    notFound();
  }

  const questions = await getTopicQuestions(topicId);
  const questionIds = questions.map((q) => q.id);
  // NOTE: It's possible to move the `WorkoutContextProvider` into the client
  // component and use the questions list form the upstreaming
  // `QuestionsContextProvider`, which is created in the
  // `src/components/pages/AvailableTopics/WorkoutTopic/WorkoutTopicLayout.tsx`
  // module.

  return (
    <WorkoutContextProvider userId={userId} topic={topic} questionIds={questionIds}>
      {children}
    </WorkoutContextProvider>
  );
}
