import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';

import { TCachedUsers, useCachedUsersForTopics } from './hooks/useCachedUsersForTopics';

const saveScrollHash = getRandomHashString();

interface TManageTopicsListCardProps extends TPropsWithClassName {
  topics: TTopic[];
  handleDeleteTopic: (topicId: TTopicId, from: string) => void;
  handleEditTopic: (topicId: TTopicId) => void;
  handleEditQuestions: (topicId: TTopicId) => void;
  handleAddTopic: () => void;
}
type TToolbarProps = Omit<TManageTopicsListCardProps, 'className'>;

function Toolbar(props: TToolbarProps) {
  const { handleAddTopic } = props;
  return (
    <div
      className={cn(
        isDev && '__ManageTopicsListCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button disabled variant="ghost" size="sm" className="flex gap-2 px-4">
        <Link href="#" className="flex items-center gap-2">
          <Icons.refresh className="hidden size-4 sm:block" />
          <span>Refresh</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddTopic} className="flex gap-2 px-4">
        <Icons.add className="hidden size-4 sm:block" />
        <span>
          Add <span className="hidden sm:inline-flex">New Topic</span>
        </span>
      </Button>
    </div>
  );
}

function TopicTableHeader({ isAdminMode }: { isAdminMode: boolean }) {
  return (
    <TableHeader>
      <TableRow>
        {isAdminMode && isDev && (
          <TableHead id="topicId" className="truncate max-sm:hidden">
            ID
          </TableHead>
        )}
        <TableHead id="name" className="truncate">
          Topic Name
        </TableHead>
        <TableHead id="questions" className="truncate">
          Questions
        </TableHead>
        {isAdminMode && (
          <TableHead id="topicUser" className="truncate max-sm:hidden">
            User
          </TableHead>
        )}
        <TableHead id="language" className="truncate max-sm:hidden">
          Language
        </TableHead>
        <TableHead id="keywords" className="truncate max-sm:hidden">
          Keywords
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TTopicTableRowProps {
  topic: TTopic;
  handleDeleteTopic: TManageTopicsListCardProps['handleDeleteTopic'];
  handleEditTopic: TManageTopicsListCardProps['handleEditTopic'];
  handleEditQuestions: TManageTopicsListCardProps['handleEditQuestions'];
  isAdminMode: boolean;
  cachedUsers: TCachedUsers;
}

function TopicTableRow(props: TTopicTableRowProps) {
  const {
    topic,
    handleDeleteTopic,
    handleEditTopic,
    handleEditQuestions,
    isAdminMode,
    cachedUsers,
  } = props;
  const { id, name, langCode, langName, keywords, userId, _count } = topic;
  const questionsCount = _count?.questions;
  const topicUser = isAdminMode ? cachedUsers[userId] : undefined;

  return (
    <TableRow className="truncate" data-topic-id={id}>
      {isAdminMode && isDev && (
        <TableCell id="topicId" className="max-w-[8em] truncate max-sm:hidden">
          <div className="truncate">
            <span className="mr-[2px] opacity-30">#</span>
            {id}
          </div>
        </TableCell>
      )}
      <TableCell id="name" className="max-w-[8em] truncate">
        <div className="truncate text-lg font-medium">{name}</div>
      </TableCell>
      <TableCell id="questions" className="max-w-[8em] truncate">
        <div className="truncate">
          {questionsCount ? (
            <span className="font-bold">{questionsCount}</span>
          ) : (
            <span className="opacity-30">—</span>
          )}
        </div>
      </TableCell>
      {isAdminMode && (
        <TableCell id="topicUser" className="max-w-[8em] truncate max-sm:hidden">
          <div className="truncate" title={topicUser?.name || undefined}>
            {topicUser?.name || <Skeleton className="h-[2em] w-[8em] rounded-sm" />}
          </div>
        </TableCell>
      )}
      <TableCell id="language" className="max-w-[8em] truncate max-sm:hidden">
        <div className="truncate">
          {[langName, langCode && `(${langCode})`].filter(Boolean).join(' ')}
        </div>
      </TableCell>
      <TableCell id="keywords" className="max-w-[8em] truncate max-sm:hidden">
        <div className="truncate">{keywords}</div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditQuestions(topic.id)}
            aria-label="Edit Questions"
            title="Edit Questions"
          >
            <Icons.questions className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditTopic(topic.id)}
            aria-label="Edit"
            title="Edit"
          >
            <Icons.edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleDeleteTopic(topic.id, 'ManageTopicsListCard')}
            aria-label="Delete"
            title="Delete"
          >
            <Icons.trash className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ManageTopicsListCard(props: TManageTopicsListCardProps) {
  const { className, topics, handleDeleteTopic, handleEditTopic, handleEditQuestions } = props;
  const { manageScope } = useTopicsContext();
  const user = useSessionUser();
  const isAdminMode = manageScope === TopicsManageScopeIds.ALL_TOPICS || user?.role === 'ADMIN';
  const cachedUsers = useCachedUsersForTopics({
    topics,
    bypass: !isAdminMode, // Do not use users data if not admin user role
  });
  return (
    <Card
      className={cn(
        isDev && '__ManageTopicsListCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ManageTopicsListCard_Header', // DEBUG
          'flex flex-row flex-wrap items-start',
        )}
      >
        {/* // UNUSED: Title
         <div
          className={cn(
            isDev && '__ManageTopicsListCard_Title', // DEBUG
            'grid flex-1 gap-2',
          )}
        >
          <CardTitle>Current topics</CardTitle>
          <CardDescription className="sr-only text-balance">My own topics.</CardDescription>
        </div>
         */}
        <Toolbar {...props} />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicsListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea
          saveScrollKey="ManageTopicsListCard"
          saveScrollHash={saveScrollHash}
          viewportClassName="px-6"
        >
          <Table>
            <TopicTableHeader isAdminMode={isAdminMode} />
            <TableBody>
              {topics.map((topic) => (
                <TopicTableRow
                  key={topic.id}
                  topic={topic}
                  handleDeleteTopic={handleDeleteTopic}
                  handleEditTopic={handleEditTopic}
                  handleEditQuestions={handleEditQuestions}
                  isAdminMode={isAdminMode}
                  cachedUsers={cachedUsers}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
