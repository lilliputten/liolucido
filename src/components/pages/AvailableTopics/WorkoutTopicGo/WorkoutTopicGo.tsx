'use client';

import React from 'react';

import { availableTopicsRoute } from '@/config/routesConfig';
import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TopicsBreadcrumbs } from '@/features/topics/components/TopicsBreadcrumbs';
import { useGoBack } from '@/hooks';

import { WorkoutTopicGoContent } from './WorkoutTopicGoContent';
import { WorkoutTopicGoContentActions } from './WorkoutTopicGoContentActions';

export function WorkoutTopicGo(props: TPropsWithClassName) {
  const { className } = props;
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const { topic, workout, pending } = useWorkoutContext();

  const isWorkoutInProgress = workout?.started && !workout?.finished;

  const workoutRoutePath = `${availableTopicsRoute}/${topic.id}/workout`;

  // const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(workoutRoutePath);

  if (!topic.id || !topic) {
    throw new Error('No such topic exists');
  }

  React.useEffect(() => {
    if ((!workout || !isWorkoutInProgress) && !pending) {
      // eslint-disable-next-line no-console
      console.warn('[WorkoutTopicGo] No active workout: go to the workout review page', {
        workout,
      });
      goBack();
      // goToTheRoute(workoutRoutePath);
    }
  }, [goBack, workoutRoutePath, workout, isWorkoutInProgress, pending]);

  return (
    <Card
      className={cn(
        isDev && '__WorkoutTopicGo', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__WorkoutTopicGo_Header', // DEBUG
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditTopicCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-4',
          )}
        >
          <div
            className={cn(
              isDev && '__EditTopicCard_TitleWrapperTop', // DEBUG
              'flex flex-1 gap-2 max-md:flex-col md:items-center',
            )}
          >
            <TopicsBreadcrumbs
              className={cn(
                isDev && '__EditTopicCard_Breadcrumbs', // DEBUG
                'flex-1',
              )}
              scope={manageScope}
              topic={topic}
              lastItem={{
                content: 'Workout',
                link: workoutRoutePath,
              }}
            />
            <div
              ref={toolbarPortalRef}
              className={cn(
                isDev && '__WorkoutTopicGo_Toolbar', // DEBUG
                'flex flex-wrap items-center gap-2',
              )}
            >
              <WorkoutTopicGoContentActions topic={topic} goBack={goBack} />
            </div>
          </div>
          <TopicHeader
            scope={TopicsManageScopeIds.AVAILABLE_TOPICS}
            topic={topic}
            className="flex-1 max-sm:flex-col-reverse"
            showDescription
          />
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__WorkoutTopicGo_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <WorkoutTopicGoContent topic={topic} />
      </CardContent>
    </Card>
  );
}
