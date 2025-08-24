import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/session';
import { WorkoutContextProvider } from '@/contexts/WorkoutContext';
import { getAvailableTopicById } from '@/features/topics/actions';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ topicId: string }>;

interface WorkoutLayoutProps extends TAwaitedProps {
  children: React.ReactNode;
}

export default async function WorkoutLayout({ children, params }: WorkoutLayoutProps) {
  const { topicId } = await params;

  const user = await getCurrentUser();
  const userId = user?.id;

  let topicResult: Awaited<ReturnType<typeof getAvailableTopicById>>;

  try {
    topicResult = await getAvailableTopicById({ id: topicId, includeQuestions: true });
    if (!topicResult) {
      throw new Error('No topic found');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[src/app/[locale]/topics/available/[topicId]/workout/layout.tsx]', error);
    debugger; // eslint-disable-line no-debugger
    notFound();
  }

  const { questions, ...topic } = topicResult;
  const questionIds = questions.map((q) => q.id);

  return (
    <WorkoutContextProvider userId={userId} topic={topic} questionIds={questionIds}>
      {children}
    </WorkoutContextProvider>
  );
}
