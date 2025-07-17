import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
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
import { TTopic, TTopicId } from '@/features/topics/types';

interface TMyTopicsListCardProps extends TPropsWithClassName {
  topics: TTopic[];
  handleDeleteTopic: (topicId: TTopicId) => void;
  handleEditTopic: (topicId: TTopicId) => void;
  handleAddTopic: () => void;
}
type TChildProps = Omit<TMyTopicsListCardProps, 'className'>;

function Title() {
  return (
    <div className="__MyTopicsListCard_Title grid gap-2">
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
        isDev && '__MyTopicsListCard_Toolbar', // DEBUG
        'ml-auto flex shrink-0 flex-wrap gap-2',
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
        isDev && '__MyTopicsListCard_Header', // DEBUG
        'flex flex-row items-center',
      )}
    >
      <Title />
      <Toolbar {...props} />
    </CardHeader>
  );
}

function TopicTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Topic Name</TableHead>
        <TableHead>Language</TableHead>
        <TableHead>Keywords</TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TTopicTableRowProps {
  topic: TTopic;
  handleDeleteTopic: TMyTopicsListCardProps['handleDeleteTopic']; // (topicId: TTopicId) => void;
  handleEditTopic: TMyTopicsListCardProps['handleEditTopic']; // (topicId: TTopicId) => void;
}

function TopicTableRow(props: TTopicTableRowProps) {
  const { topic, handleDeleteTopic, handleEditTopic } = props;
  const { id, name, language, keywords } = topic;

  // const keywordsContent = keywords?.map(({ id, name }) => <span key={id}>{name}</span>);
  return (
    <TableRow data-topic-id={id}>
      <TableCell>
        <div className="text-lg font-medium">{name}</div>
      </TableCell>
      <TableCell>
        <div>{language}</div>
      </TableCell>
      <TableCell>
        <div>{keywords}</div>
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

export function MyTopicsListCard(props: TMyTopicsListCardProps) {
  const { className, topics, handleDeleteTopic, handleEditTopic } = props;
  return (
    <Card
      className={cn(
        isDev && '__MyTopicsListCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header {...props} />
      <CardContent
        className={cn(
          isDev && '__MyTopicsListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden',
        )}
      >
        <ScrollArea>
          <Table>
            <TopicTableHeader />
            <TableBody>
              {topics.map((topic) => (
                <TopicTableRow
                  key={topic.id}
                  topic={topic}
                  handleDeleteTopic={handleDeleteTopic}
                  handleEditTopic={handleEditTopic}
                />
              ))}
              {/* // DEMO: Check scroll support
              <DemoList count={50} />
              */}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
