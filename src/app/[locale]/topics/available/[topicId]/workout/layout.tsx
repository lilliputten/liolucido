import { notFound } from 'next/navigation';

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

  const topic = await getTopic(topicId);
  if (!topic) {
    notFound();
  }

  const questions = await getTopicQuestions(topicId);
  const questionIds = questions.map((q) => q.id);

  return (
    <WorkoutContextProvider topic={topic} questionIds={questionIds}>
      {children}
    </WorkoutContextProvider>
  );
}
