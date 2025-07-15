import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TTopic } from '@/features/topics/types';

interface TMyTopicsListTableProps extends TPropsWithClassName {
  topics: TTopic[];
  handleDeleteTopic: (topic: TTopic) => void;
  handleAddTopic: () => void; // React.Dispatch<React.SetStateAction<void>>;
}
type TChildProps = Omit<TMyTopicsListTableProps, 'className'>;

function Title() {
  return (
    <div className="__MyTopicsListTable_Title grid gap-2">
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
        isDev && '__MyTopicsListTable_Toolbar', // DEBUG
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
        isDev && '__MyTopicsListTable_Header', // DEBUG
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
  handleDeleteTopic: (topic: TTopic) => void;
}

function TopicTableRow(props: TTopicTableRowProps) {
  const { topic, handleDeleteTopic } = props;
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
            onClick={() => console.log('Edit topic')}
            aria-label="Edit"
            title="Edit"
            disabled
          >
            <Icons.edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleDeleteTopic(topic)}
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

export function MyTopicsListTable(props: TMyTopicsListTableProps) {
  const { className, topics, handleDeleteTopic: onDeleteTopic } = props;
  return (
    <Card
      className={cn(
        isDev && '__MyTopicsListTable', // DEBUG
        'xl:col-span-2',
        className,
      )}
    >
      <Header {...props} />
      <CardContent
        className={cn(
          isDev && '__MyTopicsListTable_Content', // DEBUG
          // tailwindClippingLayout(),
        )}
      >
        <Table>
          <TopicTableHeader />
          <TableBody>
            {topics.map((topic) => {
              const key = topic.id;
              return <TopicTableRow key={key} topic={topic} handleDeleteTopic={onDeleteTopic} />;
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
