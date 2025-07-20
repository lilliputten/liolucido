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
import { TQuestion, TQuestionId } from '@/features/questions/types';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionsListCardProps extends TPropsWithClassName {
  questions: TQuestion[];
  handleDeleteQuestion: (questionId: TQuestionId) => void;
  handleEditQuestion: (questionId: TQuestionId) => void;
  handleAddQuestion: () => void;
}
type TChildProps = Omit<TManageTopicQuestionsListCardProps, 'className'>;

function Title() {
  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionsListCard_Title', // DEBUG
        'grid flex-1 gap-2',
      )}
    >
      <CardTitle>Current questions</CardTitle>
      <CardDescription className="text-balance">
        Questions you have added to the profile.
      </CardDescription>
    </div>
  );
}

function Toolbar(props: TChildProps) {
  const { handleAddQuestion } = props;
  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionsListCard_Toolbar', // DEBUG
        '__ml-auto __shrink-0 flex flex-wrap gap-2',
      )}
    >
      <Button disabled variant="ghost" size="sm" className="flex gap-2 px-4">
        <Link href="#" className="flex items-center gap-2">
          <Icons.refresh className="hidden size-4 sm:block" />
          <span>Refresh</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2 px-4">
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
        isDev && '__ManageTopicQuestionsListCard_Header', // DEBUG
        'flex flex-row flex-wrap items-start',
      )}
    >
      <Title />
      <Toolbar {...props} />
    </CardHeader>
  );
}

function QuestionTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead id="text" className="truncate">
          Question Text
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TQuestionTableRowProps {
  question: TQuestion;
  handleDeleteQuestion: TManageTopicQuestionsListCardProps['handleDeleteQuestion'];
  handleEditQuestion: TManageTopicQuestionsListCardProps['handleEditQuestion'];
}

function QuestionTableRow(props: TQuestionTableRowProps) {
  const { question, handleDeleteQuestion, handleEditQuestion } = props;
  const { id, text } = question;
  return (
    <TableRow className="truncate" data-question-id={id}>
      <TableCell id="text" className="max-w-[8em] truncate">
        <div className="truncate text-lg font-medium">{text}</div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditQuestion(question.id)}
            aria-label="Edit"
            title="Edit"
          >
            <Icons.edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleDeleteQuestion(question.id)}
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

export function ManageTopicQuestionsListCard(props: TManageTopicQuestionsListCardProps) {
  const { className, questions, handleDeleteQuestion, handleEditQuestion } = props;
  return (
    <Card
      className={cn(
        isDev && '__ManageTopicQuestionsListCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header {...props} />
      <CardContent
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea
          saveScrollKey="ManageTopicQuestionsListCard"
          saveScrollHash={saveScrollHash}
          viewportClassName="px-6"
        >
          <Table>
            <QuestionTableHeader />
            <TableBody>
              {questions.map((question) => (
                <QuestionTableRow
                  key={question.id}
                  question={question}
                  handleDeleteQuestion={handleDeleteQuestion}
                  handleEditQuestion={handleEditQuestion}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
