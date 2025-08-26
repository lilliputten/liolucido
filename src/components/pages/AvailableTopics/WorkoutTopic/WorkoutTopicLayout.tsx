import { PageError } from '@/components/shared/PageError';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  //  scope: TTopicsManageScopeId;
  topicId: string;
}>;

type TWorkoutTopicLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
};

// const scope: TTopicsManageScopeId = TopicsManageScopeIds.AVAILABLE_TOPICS;

export async function WorkoutTopicLayout(props: TWorkoutTopicLayoutProps) {
  const { children, params } = props;
  const resolvedParams = await params;
  const { topicId } = resolvedParams;
  // const topicsListRoutePath = topicsRoutes[scope];
  // const topicRootRoutePath = `${topicsListRoutePath}/${topicId}`;
  // const routePath = `${topicsListRoutePath}/${topicId}/workout`;

  if (!topicId) {
    return <PageError error={'Topic ID not specified.'} />;
  }

  return children;
}
