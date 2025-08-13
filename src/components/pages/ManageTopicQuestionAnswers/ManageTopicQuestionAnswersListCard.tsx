import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString, truncate } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useGoBack } from '@/hooks/useGoBack';
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
import { TUpdatedAnswersCountDetail, updatedQuestionsCountEventName } from '@/constants/eventTypes';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { getQuestionAnswers } from '@/features/answers/actions';
import { AnswersBreadcrumbs } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer, TAnswerId } from '@/features/answers/types';

import { PageEmpty } from '../shared/PageEmpty';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionAnswersListCardProps extends TPropsWithClassName {
  handleDeleteAnswer: (answerId: TAnswerId) => void;
  handleEditAnswer: (answerId: TAnswerId) => void;
  handleAddAnswer: () => void;
}

interface TToolbarActionsProps {
  handleAddAnswer: () => void;
  handleDeleteQuestion?: () => void;
  goBack: () => void;
}

function Toolbar(props: TToolbarActionsProps) {
  const { handleAddAnswer, goBack } = props;
  const [isReloading, startReload] = React.useTransition();

  const answersContext = useAnswersContext();

  const handleReload = React.useCallback(() => {
    const { questionId, setAnswers } = answersContext;
    startReload(async () => {
      try {
        const promise = getQuestionAnswers(questionId);
        toast.promise(promise, {
          loading: 'Reloading answers data...',
          success: 'Answers successfully reloaded',
          error: 'Error reloading answers.',
        });
        const answers = (await promise) || [];
        setAnswers((prevAnswers) => {
          const prevAnswersCount = prevAnswers.length;
          // Dispatch a custom event with the updated answers data
          const answersCount = answers.length;
          if (answersCount !== prevAnswersCount) {
            const detail: TUpdatedAnswersCountDetail = { questionId, answersCount };
            const event = new CustomEvent<TUpdatedAnswersCountDetail>(
              updatedQuestionsCountEventName,
              {
                detail,
                bubbles: true,
              },
            );
            setTimeout(() => window.dispatchEvent(event), 100);
          }
          return answers;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ManageTopicQuestionAnswersListCard:handleReload] catch', {
          error,
        });
        debugger; // eslint-disable-line no-debugger
      }
    });
  }, [answersContext]);

  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button variant="ghost" size="sm" className="flex gap-2 px-4" onClick={goBack}>
        <Icons.ArrowLeft className="hidden size-4 sm:block" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex items-center gap-2 px-4',
          isReloading && 'pointer-events-none opacity-50',
        )}
        onClick={handleReload}
      >
        <Icons.refresh className={cn('hidden size-4 sm:block', isReloading && 'animate-spin')} />
        <span>Reload</span>
      </Button>
      {/*
      {handleDeleteQuestion && (
        <Button variant="destructive" size="sm" onClick={handleDeleteQuestion} className="gap-2">
          <Icons.trash className="size-4" />
          <span>Delete Question</span>
        </Button>
      )}
      */}
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
        <TableHead id="no" className="truncate text-right max-sm:hidden">
          No
        </TableHead>
        {isAdminMode && isDev && (
          <TableHead id="topicId" className="truncate max-sm:hidden">
            ID
          </TableHead>
        )}
        <TableHead id="text" className="truncate">
          Answer Text
        </TableHead>
        <TableHead id="isCorrect" className="truncate">
          Correct
        </TableHead>
        <TableHead id="isGenerated" className="truncate">
          Generated
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TAnswerTableRowProps {
  answer: TAnswer;
  idx: number;
  handleDeleteAnswer: TManageTopicQuestionAnswersListCardProps['handleDeleteAnswer'];
  handleEditAnswer: TManageTopicQuestionAnswersListCardProps['handleEditAnswer'];
  isAdminMode: boolean;
}

function AnswerTableRow(props: TAnswerTableRowProps) {
  const { answer, handleDeleteAnswer, handleEditAnswer, isAdminMode, idx } = props;
  const { id, text, isCorrect, isGenerated } = answer;
  const answersContext = useAnswersContext();
  const { routePath } = answersContext;
  return (
    <TableRow className="truncate" data-answer-id={id}>
      <TableCell id="no" className="max-w-[1em] truncate text-right opacity-50 max-sm:hidden">
        <div className="truncate">{idx + 1}</div>
      </TableCell>
      {isAdminMode && isDev && (
        <TableCell id="answerId" className="max-w-[8em] truncate max-sm:hidden">
          <div className="truncate">
            <span className="mr-[2px] opacity-30">#</span>
            {id}
          </div>
        </TableCell>
      )}
      <TableCell id="text" className="max-w-[16em] truncate">
        <Link className="truncate text-lg font-medium hover:underline" href={`${routePath}/${id}`}>
          {truncate(text, 40)}
        </Link>
      </TableCell>
      <TableCell id="isCorrect" className="w-[8em]">
        {isCorrect && <Icons.CircleCheck className="stroke-green-500" />}
      </TableCell>
      <TableCell id="isGenerated" className="w-[8em]">
        {isGenerated && <Icons.CircleCheck className="stroke-blue-500" />}
      </TableCell>
      <TableCell id="actions" className="w-[2em] text-right">
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
            className="size-9 shrink-0 text-destructive"
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
  const { className, handleDeleteAnswer, handleAddAnswer, handleEditAnswer } = props;
  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

  const router = useRouter();
  // const topicsContext = useTopicsContext();
  const questionsContext = useQuestionsContext();
  const answersContext = useAnswersContext();

  const hasAnswers = !!answersContext.answers.length;

  /* // Owner question
   * const question = React.useMemo(() => {
   *   const { questionId } = answersContext;
   *   return questionsContext.questions.find(({ id }) => id === questionId);
   * }, [questionsContext, answersContext]);
   */

  // Delete Question Modal
  const handleDeleteQuestion = React.useCallback(() => {
    const { questionId } = answersContext;
    const hasQuestion = questionsContext.questions.find(({ id }) => id === questionId);
    if (hasQuestion) {
      router.push(
        `${questionsContext.routePath}/delete?questionId=${questionId}&from=ManageTopicQuestionAnswersListCard`,
      );
    } else {
      toast.error('The requested question does not exist.');
      router.replace(questionsContext.routePath);
    }
  }, [router, questionsContext, answersContext]);

  const goBack = useGoBack(answersContext.topicsListRoutePath);

  /* // Render nothing if no owner question found
   * if (!question) {
   *   return null;
   * }
   */

  return (
    <Card
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Header', // DEBUG
          'item-start flex flex-col gap-4 lg:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__ManageTopicQuestionAnswersListCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <AnswersBreadcrumbs
            className={cn(
              isDev && '__ManageTopicQuestionAnswersListCard_Breadcrumbs', // DEBUG
            )}
            // answerId={answerId}
            inactiveAnswers
          />
          {/* // UNUSED: Tilte & description
          <CardTitle className="flex flex-1 items-center overflow-hidden">
            <span className="truncate">Manage answers for the question "{question.name}"</span>
          </CardTitle>
          */}
        </div>
        <Toolbar
          handleAddAnswer={handleAddAnswer}
          handleDeleteQuestion={handleDeleteQuestion}
          goBack={goBack}
        />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {hasAnswers ? (
          <ScrollArea
            saveScrollKey="ManageTopicQuestionAnswersListCard"
            saveScrollHash={saveScrollHash}
            viewportClassName="px-6"
          >
            <Table>
              <AnswerTableHeader isAdminMode={isAdmin} />
              <TableBody>
                {answersContext.answers.map((answer, idx) => (
                  <AnswerTableRow
                    key={answer.id}
                    idx={idx}
                    answer={answer}
                    handleDeleteAnswer={handleDeleteAnswer}
                    handleEditAnswer={handleEditAnswer}
                    isAdminMode={isAdmin}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <PageEmpty
            className="size-full flex-1"
            iconName="answers"
            title="No answers have been created yet"
            description="You dont have any answers yet. Add any answer to your profile."
            framed={false}
            buttons={
              <>
                {/*
                <Button variant="ghost" onClick={goBack} className="flex gap-2">
                  <Icons.ArrowLeft className="size-4" />
                  Go Back
                </Button>
                */}
                <Button onClick={handleAddAnswer} className="flex gap-2">
                  <Icons.add className="size-4" />
                  Add Answer
                </Button>
              </>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
