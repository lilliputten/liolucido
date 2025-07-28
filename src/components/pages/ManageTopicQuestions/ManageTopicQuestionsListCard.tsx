import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
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
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TQuestion, TQuestionId } from '@/features/questions/types';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionsListCardProps extends TPropsWithClassName {
  questions: TQuestion[];
  handleDeleteQuestion: (questionId: TQuestionId) => void;
  handleEditQuestion: (questionId: TQuestionId) => void;
  handleAddQuestion: () => void;
}

interface TToolbarActionsProps {
  handleAddQuestion: () => void;
  handleDeleteTopic?: () => void;
}

function Toolbar(props: TToolbarActionsProps) {
  const router = useRouter();
  const { handleAddQuestion, handleDeleteTopic } = props;
  const questionsContext = useQuestionsContext();
  const goBack = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(questionsContext.topicRootRoutePath);
      }
    }, 200);
  }, [router, questionsContext]);
  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionsListCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button variant="ghost" size="sm" className="flex gap-2 px-4" onClick={goBack}>
        <Icons.arrowLeft className="hidden size-4 sm:block" />
        <span>Back</span>
      </Button>
      {handleDeleteTopic && (
        <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
          <Icons.trash className="size-4" />
          <span>Delete Topic</span>
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2 px-4">
        <Icons.add className="hidden size-4 sm:block" />
        <span>
          Add <span className="hidden sm:inline-flex">New Question</span>
        </span>
      </Button>
    </div>
  );
}

function QuestionTableHeader({ isAdminMode }: { isAdminMode: boolean }) {
  return (
    <TableHeader>
      <TableRow>
        {isAdminMode && isDev && (
          <TableHead id="topicId" className="truncate max-sm:hidden">
            ID
          </TableHead>
        )}
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
  isAdminMode: boolean;
}

function QuestionTableRow(props: TQuestionTableRowProps) {
  const { question, handleDeleteQuestion, handleEditQuestion, isAdminMode } = props;
  const { id, text } = question;
  return (
    <TableRow className="truncate" data-question-id={id}>
      {isAdminMode && isDev && (
        <TableCell id="questionId" className="max-w-[8em] truncate max-sm:hidden">
          <div className="truncate">
            <span className="mr-[2px] opacity-30">#</span>
            {id}
          </div>
        </TableCell>
      )}
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
  const { className, questions, handleDeleteQuestion, handleAddQuestion, handleEditQuestion } =
    props;
  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

  const router = useRouter();
  const topicsContext = useTopicsContext();
  const questionsContext = useQuestionsContext();

  // Delete Topic Modal
  const handleDeleteTopic = React.useCallback(() => {
    const { topicId } = questionsContext;
    const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
    if (hasTopic) {
      router.push(
        `${topicsContext.routePath}/delete?topicId=${topicId}&from=ManageTopicQuestionsListCard`,
      );
    } else {
      toast.error('The requested topic does not exist.');
      router.replace(topicsContext.routePath);
    }
  }, [router, topicsContext, questionsContext]);

  return (
    <Card
      className={cn(
        isDev && '__ManageTopicQuestionsListCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Header', // DEBUG
          'flex flex-row flex-wrap items-start',
        )}
      >
        <div
          className={cn(
            isDev && '__ManageTopicQuestionsListCard_Title', // DEBUG
            'grid flex-1 gap-2',
          )}
        >
          <CardTitle>Manage questions</CardTitle>
          <CardDescription className="text-balance">
            Questions you have added to the profile.
          </CardDescription>
        </div>
        <Toolbar handleAddQuestion={handleAddQuestion} handleDeleteTopic={handleDeleteTopic} />
      </CardHeader>
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
            <QuestionTableHeader isAdminMode={isAdmin} />
            <TableBody>
              {questions.map((question) => (
                <QuestionTableRow
                  key={question.id}
                  question={question}
                  handleDeleteQuestion={handleDeleteQuestion}
                  handleEditQuestion={handleEditQuestion}
                  isAdminMode={isAdmin}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
