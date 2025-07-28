import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { useAnswersContext } from '@/contexts/AnswersContext';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TAnswer, TAnswerId } from '@/features/answers/types';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionAnswersListCardProps extends TPropsWithClassName {
  answers: TAnswer[];
  handleDeleteAnswer: (answerId: TAnswerId) => void;
  handleEditAnswer: (answerId: TAnswerId) => void;
  handleAddAnswer: () => void;
}

interface TToolbarActionsProps {
  handleAddAnswer: () => void;
  handleDeleteTopic?: () => void;
}

function Toolbar(props: TToolbarActionsProps) {
  const router = useRouter();
  const { handleAddAnswer, handleDeleteTopic } = props;
  const answersContext = useAnswersContext();
  const goBack = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(answersContext.topicRootRoutePath);
      }
    }, 200);
  }, [router, answersContext]);
  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListCard_Toolbar', // DEBUG
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
      <Button variant="ghost" size="sm" onClick={handleAddAnswer} className="flex gap-2 px-4">
        <Icons.add className="hidden size-4 sm:block" />
        <span>
          Add <span className="hidden sm:inline-flex">New Answer</span>
        </span>
      </Button>
    </div>
  );
}

function AnswerTableHeader({ isAdminMode }: { isAdminMode: boolean }) {
  return (
    <TableHeader>
      <TableRow>
        {isAdminMode && isDev && (
          <TableHead id="topicId" className="truncate max-sm:hidden">
            ID
          </TableHead>
        )}
        <TableHead id="text" className="truncate">
          Answer Text
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TAnswerTableRowProps {
  answer: TAnswer;
  handleDeleteAnswer: TManageTopicQuestionAnswersListCardProps['handleDeleteAnswer'];
  handleEditAnswer: TManageTopicQuestionAnswersListCardProps['handleEditAnswer'];
  isAdminMode: boolean;
}

function AnswerTableRow(props: TAnswerTableRowProps) {
  const { answer, handleDeleteAnswer, handleEditAnswer, isAdminMode } = props;
  const { id, text } = answer;
  return (
    <TableRow className="truncate" data-answer-id={id}>
      {isAdminMode && isDev && (
        <TableCell id="answerId" className="max-w-[8em] truncate max-sm:hidden">
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
            onClick={() => handleEditAnswer(answer.id)}
            aria-label="Edit"
            title="Edit"
          >
            <Icons.edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleDeleteAnswer(answer.id)}
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

export function ManageTopicQuestionAnswersListCard(
  props: TManageTopicQuestionAnswersListCardProps,
) {
  const { className, answers, handleDeleteAnswer, handleAddAnswer, handleEditAnswer } = props;
  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

  const router = useRouter();
  const topicsContext = useTopicsContext();
  const answersContext = useAnswersContext();

  const topic = React.useMemo(() => {
    const { topicId } = answersContext;
    return topicsContext.topics.find(({ id }) => id === topicId);
  }, [answersContext, topicsContext]);

  // Delete Topic Modal
  const handleDeleteTopic = React.useCallback(() => {
    const { topicId } = answersContext;
    const hasTopic = topicsContext.topics.find(({ id }) => id === topicId);
    if (hasTopic) {
      router.push(
        `${topicsContext.routePath}/delete?topicId=${topicId}&from=ManageTopicQuestionAnswersListCard`,
      );
    } else {
      toast.error('The requested topic does not exist.');
      router.replace(topicsContext.routePath);
    }
  }, [router, topicsContext, answersContext]);

  if (!topic) {
    return null;
  }

  return (
    <Card
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListCard', // DEBUG
        // 'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Header', // DEBUG
          'flex flex-row flex-wrap items-start gap-4 max-md:flex-col',
        )}
      >
        {/* // UNUSED: Tilte & description
         <div
          className={cn(
            isDev && '__ManageTopicQuestionAnswersListCard_Title', // DEBUG
            'grid flex-1 gap-2',
          )}
        >
          <CardTitle>Manage answers for the topic "{topic.name}"</CardTitle>
          <CardDescription className="text-balance">
            Answers you have added to the profile.
          </CardDescription>
        </div>
        */}
        <Toolbar handleAddAnswer={handleAddAnswer} handleDeleteTopic={handleDeleteTopic} />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea
          saveScrollKey="ManageTopicQuestionAnswersListCard"
          saveScrollHash={saveScrollHash}
          viewportClassName="px-6"
        >
          <Table>
            <AnswerTableHeader isAdminMode={isAdmin} />
            <TableBody>
              {answers.map((answer) => (
                <AnswerTableRow
                  key={answer.id}
                  answer={answer}
                  handleDeleteAnswer={handleDeleteAnswer}
                  handleEditAnswer={handleEditAnswer}
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
