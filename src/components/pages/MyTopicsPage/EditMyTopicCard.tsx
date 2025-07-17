'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';

interface TEditMyTopicCardProps extends TPropsWithClassName {
  topicId: TTopicId;
}
type TChildProps = Omit<TEditMyTopicCardProps, 'className'>;

function Title() {
  const router = useRouter();
  return (
    <div className="__EditMyTopicCard_Title grid grid-cols-[2em_1fr] gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 hover:opacity-80"
        aria-label="Back to the topics list"
        title="Back to the topics list"
        onClick={() => router.back()}
      >
        <Icons.arrowLeft className="size-4" />
      </Button>
      <CardTitle className="flex items-center">
        <span>Edit topic</span>
      </CardTitle>
      <CardDescription className="col-span-2 col-start-1 text-balance">
        Edit topic properties.
      </CardDescription>
    </div>
  );
}

function Header(_props: TChildProps) {
  return (
    <CardHeader
      className={cn(
        isDev && '__EditMyTopicCard_Header', // DEBUG
        'flex flex-row items-center',
      )}
    >
      <Title />
      {/* XXX: See a toolbar example in `MyTopicsListCard`
      <Toolbar {...props} />
      */}
    </CardHeader>
  );
}

interface TEditTopicFormProps {
  topic: TTopic;
}
function EditTopicForm(props: TEditTopicFormProps) {
  const { topic } = props;
  return (
    <div>
      {/* TODO */}
      <p>Topic: {topic.id}</p>
      <pre>{JSON.stringify(topic, null, 2)}</pre>
    </div>
  );
}

export function EditMyTopicCard(props: TEditMyTopicCardProps) {
  const { className, topicId } = props;
  const { topics } = useTopicsContext();
  const topic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topics, topicId],
  );
  if (!topicId || !topic) {
    throw new Error('No such topic exists.');
  }
  return (
    <Card
      className={cn(
        isDev && '__EditMyTopicCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header {...props} />
      <CardContent
        className={cn(
          isDev && '__EditMyTopicCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden',
        )}
      >
        <EditTopicForm topic={topic} />
      </CardContent>
    </Card>
  );
}
