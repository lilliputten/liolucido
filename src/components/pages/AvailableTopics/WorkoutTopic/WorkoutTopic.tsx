'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useGoBack } from '@/hooks/useGoBack';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TopicsBreadcrumbs } from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopic, TTopicId } from '@/features/topics/types';

import { WorkoutTopicContent } from './WorkoutTopicContent';
import { WorkoutTopicContentActions } from './WorkoutTopicContentActions';

interface TWorkoutTopicProps extends TPropsWithClassName {
  topicId: TTopicId;
}

export function WorkoutTopic(props: TWorkoutTopicProps) {
  const { className, topicId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const topicsContext = useTopicsContext();
  const { topics } = topicsContext;
  const topic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topics, topicId],
  );
  const goBack = useGoBack(topicsContext.routePath);
  if (!topicId || !topic) {
    throw new Error('No such topic exists');
  }
  // const {
  //   // id,
  //   // userId,
  //   // user,
  //   // name,
  //   description,
  //   // isPublic,
  //   // langCode,
  //   // langName,
  //   // keywords,
  //   // createdAt,
  //   // updatedAt,
  //   // _count,
  // } = topic;

  return (
    <Card
      className={cn(
        isDev && '__WorkoutTopic', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__WorkoutTopic_Header', // DEBUG
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditTopicCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2',
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
              topicId={topicId}
              lastItem={{ content: 'Workout' }}
            />
            <div
              ref={toolbarPortalRef}
              className={cn(
                isDev && '__WorkoutTopic_Toolbar', // DEBUG
                'flex flex-wrap items-center gap-2',
              )}
            >
              <WorkoutTopicContentActions
                topic={topic}
                goBack={goBack}
                // handleDeleteTopic={handleDeleteTopic}
                // handleAddQuestion={handleAddQuestion}
              />
            </div>
          </div>
          <TopicHeader topic={topic} className="flex-1 max-sm:flex-col-reverse" showDescription />
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__WorkoutTopic_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <WorkoutTopicContent topic={topic} />
      </CardContent>
    </Card>
  );
}
