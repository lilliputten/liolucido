import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString, truncateString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollAreaInfinite } from '@/components/ui/ScrollAreaInfinite';
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
import { TTopic, TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { TCachedUsers, useCachedUsersForTopics } from './hooks/useCachedUsersForTopics';

const saveScrollHash = getRandomHashString();

interface TManageTopicsListCardProps extends TPropsWithClassName {
  handleDeleteTopic: (topicId: TTopicId, from: string) => void;
  handleEditTopic: (topicId: TTopicId) => void;
  handleEditQuestions: (topicId: TTopicId) => void;
  handleAddTopic: () => void;
}
type TToolbarProps = Pick<TManageTopicsListCardProps, 'handleAddTopic'>;

function Toolbar(props: TToolbarProps) {
  const { handleAddTopic } = props;
  const [isReloading, startReload] = React.useTransition();

  const { manageScope } = useManageTopicsStore();
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { refetch } = availableTopics;

  const handleReload = React.useCallback(() => {
    startReload(async () => {
      await refetch({ cancelRefetch: true });
    });
  }, [refetch]);

  return (
    <div
      className={cn(
        isDev && '__ManageTopicsListCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex items-center gap-2 px-4',
          isReloading && 'pointer-events-none opacity-50',
        )}
        onClick={handleReload}
      >
        <Icons.refresh
          className={cn('hidden size-4 opacity-50 sm:flex', isReloading && 'animate-spin')}
        />
        <span>Reload</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddTopic} className="flex gap-2 px-4">
        <Icons.add className="hidden size-4 opacity-50 sm:flex" />
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
        <TableHead id="no" className="truncate text-right max-sm:hidden">
          No
        </TableHead>
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
  idx: number;
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
    idx,
  } = props;
  const { id, name, langCode, langName, keywords, userId, _count } = topic;
  const questionsCount = _count?.questions;
  const topicUser = isAdminMode ? cachedUsers[userId] : undefined;
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  return (
    <TableRow className="truncate" data-topic-id={id}>
      <TableCell id="no" className="max-w-[1em] truncate text-right opacity-50 max-sm:hidden">
        <div className="truncate">{idx + 1}</div>
      </TableCell>
      {isAdminMode && isDev && (
        <TableCell id="topicId" className="max-w-[8em] truncate max-sm:hidden">
          <div className="truncate">
            <span className="mr-[2px] opacity-30">#</span>
            {id}
          </div>
        </TableCell>
      )}
      <TableCell id="name" className="max-w-[8em] truncate">
        <Link className="truncate text-lg font-medium hover:underline" href={`${routePath}/${id}`}>
          {truncateString(name, 40)}
        </Link>
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
            className="size-9 shrink-0 text-destructive"
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
  const { className, handleDeleteTopic, handleEditTopic, handleEditQuestions, handleAddTopic } =
    props;
  const manageTopicsStore = useManageTopicsStore();
  const { manageScope } = manageTopicsStore;
  // const { manageScope } = useTopicsContext();
  const user = useSessionUser();
  // const { user } = useSettingsContext();
  const isAdminMode = manageScope === TopicsManageScopeIds.ALL_TOPICS || user?.role === 'ADMIN';
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { isLoading, allTopics, fetchNextPage, hasNextPage, isFetchingNextPage } = availableTopics;

  const cachedUsers = useCachedUsersForTopics({
    topics: allTopics,
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
        <Toolbar handleAddTopic={handleAddTopic} />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicsListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollAreaInfinite
          effectorData={allTopics}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          saveScrollKey="ManageTopicsListCard"
          saveScrollHash={saveScrollHash}
          className={cn(
            isDev && '__ManageTopicsListCard', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden',
            className,
          )}
          viewportClassName={cn(
            isDev && '__ManageTopicsListCard_Viewport', // DEBUG
            'px-6',
          )}
          containerClassName={cn(
            isDev && '__ManageTopicsListCard_Container', // DEBUG
            'relative w-full flex flex-col gap-4',
          )}
        >
          <Table>
            <TopicTableHeader isAdminMode={isAdminMode} />
            <TableBody>
              {allTopics.map((topic, idx) => (
                <TopicTableRow
                  key={topic.id}
                  idx={idx}
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
        </ScrollAreaInfinite>
      </CardContent>
    </Card>
  );
}
