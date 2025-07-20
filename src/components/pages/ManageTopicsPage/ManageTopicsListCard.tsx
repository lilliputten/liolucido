import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
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
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TopicsManageTypes } from '@/contexts/TopicsContextConstants';
import { TTopic, TTopicId } from '@/features/topics/types';

import { TCachedUsers, useCachedUsersForTopics } from './hooks/useCachedUsersForTopics';

const saveScrollHash = getRandomHashString();

interface TManageTopicsListCardProps extends TPropsWithClassName {
  topics: TTopic[];
  handleDeleteTopic: (topicId: TTopicId) => void;
  handleEditTopic: (topicId: TTopicId) => void;
  handleAddTopic: () => void;
}
type TChildProps = Omit<TManageTopicsListCardProps, 'className'>;

function Title() {
  return (
    <div
      className={cn(
        isDev && '__ManageTopicsListCard_Title', // DEBUG
        'grid flex-1 gap-2',
      )}
    >
      <CardTitle>Current topics</CardTitle>
      <CardDescription className="text-balance">
        Topics you have added to the profile.
      </CardDescription>
    </div>
  );
}

function Toolbar(props: TChildProps) {
  const { handleAddTopic } = props;
  return (
    <div
      className={cn(
        isDev && '__ManageTopicsListCard_Toolbar', // DEBUG
        '__ml-auto __shrink-0 flex flex-wrap gap-2',
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

function Header(props: TChildProps) {
  return (
    <CardHeader
      className={cn(
        isDev && '__ManageTopicsListCard_Header', // DEBUG
        'flex flex-row flex-wrap items-start',
      )}
    >
      <Title />
      <Toolbar {...props} />
    </CardHeader>
  );
}

function TopicTableHeader({ isAdminMode }: { isAdminMode: boolean }) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead id="name" className="truncate">
          Topic Name
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
  isAdminMode: boolean;
  cachedUsers: TCachedUsers;
}

function TopicTableRow(props: TTopicTableRowProps) {
  const { topic, handleDeleteTopic, handleEditTopic, isAdminMode, cachedUsers } = props;
  const { id, name, langCode, langName, keywords, userId } = topic;
  const topicUser = isAdminMode ? cachedUsers[userId] : undefined;

  return (
    <TableRow className="truncate" data-topic-id={id}>
      <TableCell className="max-w-[150px] truncate">
        <div className="truncate text-lg font-medium">{name}</div>
      </TableCell>
      {isAdminMode && (
        <TableCell id="topicUser" className="max-w-[150px] truncate max-sm:hidden">
          <div className="truncate" title={topicUser?.name || undefined}>
            {topicUser?.name || '...'}
          </div>
        </TableCell>
      )}
      <TableCell id="language" className="max-w-[150px] truncate max-sm:hidden">
        <div className="truncate">
          {[langName, langCode && `(${langCode})`].filter(Boolean).join(' ')}
        </div>
      </TableCell>
      <TableCell id="keywords" className="max-w-[150px] truncate max-sm:hidden">
        <div className="truncate">{keywords}</div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
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
            onClick={() => handleDeleteTopic(topic.id)}
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
  const { className, topics, handleDeleteTopic, handleEditTopic } = props;
  const { manageType } = useTopicsContext();
  const isAdminMode = manageType === TopicsManageTypes.ALL_TOPICS;
  // const user = useSessionUser();
  // const isAdmin = !!user && user.role === 'ADMIN';
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
      <Header {...props} />
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
