'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { useGoBack } from '@/hooks/useGoBack';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TopicsBreadcrumbs } from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopic, TTopicId } from '@/features/topics/types';

import { ViewTopicContent } from './ViewTopicContent';

interface TViewTopicCardProps extends TPropsWithClassName {
  topicId: TTopicId;
}

export function ViewTopicCard(props: TViewTopicCardProps) {
  const { className, topicId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const [toolbarPortalRoot, setToolbarPortalRoot] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => setToolbarPortalRoot(toolbarPortalRef.current), [toolbarPortalRef]);
  const router = useRouter();
  const topicsContext = useTopicsContext();
  const { topics } = topicsContext;
  const topic: TTopic | undefined = React.useMemo(
    () => topics.find(({ id }) => id === topicId),
    [topics, topicId],
  );
  if (!topicId || !topic) {
    throw new Error('No such topic exists');
  }
  const goBack = useGoBack(topicsContext.routePath);

  // Delete Topic Modal
  const handleDeleteTopic = React.useCallback(() => {
    const hasTopic = !!topicsContext.topics.find(({ id }) => id === topic.id);
    if (hasTopic) {
      router.push(`${topicsContext.routePath}/delete?topicId=${topic.id}&from=ViewTopicCard`);
    } else {
      toast.error('The requested topic does not exist.');
      router.replace(topicsContext.routePath);
    }
  }, [router, topicsContext, topic]);

  /* // Add Topic Modal
   * const handleAddQuestion = React.useCallback(() => {
   *   router.push(`${topicsContext.routePath}/${topic.id}/questions/add`);
   * }, [router, topicsContext, topic]);
   */

  return (
    <Card
      className={cn(
        isDev && '__ViewTopicCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewTopicCard_Header', // DEBUG
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditTopicCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <TopicsBreadcrumbs
            className={cn(
              isDev && '__EditTopicCard_Breadcrumbs', // DEBUG
            )}
            topicId={topicId}
            inactiveTopic
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Show Topic</span>
            </CardTitle>
            */}
        </div>
        <div
          ref={toolbarPortalRef}
          className={cn(
            isDev && '__ViewTopicCard_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        />
      </CardHeader>

      <CardContent
        className={cn(
          isDev && '__ViewTopicCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ViewTopicContent
          topic={topic}
          goBack={goBack}
          handleDeleteTopic={handleDeleteTopic}
          // handleAddQuestion={handleAddQuestion}
          toolbarPortalRoot={toolbarPortalRoot}
        />
      </CardContent>
    </Card>
  );
}
