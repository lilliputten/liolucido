import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString, truncate } from '@/lib/helpers/strings';
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
import {
  TUpdatedQuestionsCountDetail,
  updatedQuestionsCountEventName,
} from '@/constants/eventTypes';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { getTopicQuestions } from '@/features/questions/actions';
import { QuestionsBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion, TQuestionId } from '@/features/questions/types';

import { PageEmpty } from '../shared/PageEmpty';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionsListCardProps extends TPropsWithClassName {
  questions: TQuestion[];
  handleDeleteQuestion: (questionId: TQuestionId) => void;
  handleEditQuestion: (questionId: TQuestionId) => void;
  handleAddQuestion: () => void;
  handleEditAnswers: (questionId: TQuestionId) => void;
}

interface TToolbarActionsProps {
  handleAddQuestion: () => void;
  handleDeleteTopic?: () => void;
  goBack: () => void;
}

function Toolbar(props: TToolbarActionsProps) {
  const { handleAddQuestion, goBack } = props;
  const [isReloading, startReload] = React.useTransition();

  const questionsContext = useQuestionsContext();

  const handleReload = React.useCallback(() => {
    const { topicId, setQuestions } = questionsContext;
    startReload(async () => {
      try {
        const promise = getTopicQuestions(topicId);
        toast.promise(promise, {
          loading: 'Reloading questions data...',
          success: 'Questions successfully reloaded.',
          error: 'Error reloading questions.',
        });
        const questions = (await promise) || [];
        setQuestions((prevQuestions) => {
          const prevQuestionsCount = prevQuestions.length;
          // Dispatch a custom event with the updated questions data
          const questionsCount = questions.length;
          if (questionsCount !== prevQuestionsCount) {
            const detail: TUpdatedQuestionsCountDetail = { topicId, questionsCount };
            const event = new CustomEvent<TUpdatedQuestionsCountDetail>(
              updatedQuestionsCountEventName,
              {
                detail,
                bubbles: true,
              },
            );
            setTimeout(() => window.dispatchEvent(event), 100);
          }
          return questions;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ManageTopicQuestionsListCard:handleReload] catch', {
          error,
        });
        debugger; // eslint-disable-line no-debugger
      }
    });
  }, [questionsContext]);

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
      {handleDeleteTopic && (
        <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
          <Icons.trash className="size-4" />
          <span>Delete Topic</span>
        </Button>
      )}
      */}
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
        <TableHead id="no" className="truncate text-right max-sm:hidden">
          No
        </TableHead>
        {isAdminMode && isDev && (
          <TableHead id="topicId" className="truncate max-sm:hidden">
            ID
          </TableHead>
        )}
        <TableHead id="text" className="truncate">
          Question Text
        </TableHead>
        <TableHead id="answers" className="truncate">
          Answers
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TQuestionTableRowProps {
  question: TQuestion;
  idx: number;
  handleDeleteQuestion: TManageTopicQuestionsListCardProps['handleDeleteQuestion'];
  handleEditQuestion: TManageTopicQuestionsListCardProps['handleEditQuestion'];
  handleEditAnswers: TManageTopicQuestionsListCardProps['handleEditAnswers'];
  isAdminMode: boolean;
}

function QuestionTableRow(props: TQuestionTableRowProps) {
  const {
    question,
    handleDeleteQuestion,
    handleEditQuestion,
    handleEditAnswers,
    isAdminMode,
    idx,
  } = props;
  const { id, text, _count } = question;
  const answersCount = _count?.answers;
  const questionsContext = useQuestionsContext();
  const { routePath } = questionsContext;
  return (
    <TableRow className="truncate" data-question-id={id}>
      <TableCell id="no" className="max-w-[1em] truncate text-right opacity-50 max-sm:hidden">
        <div className="truncate">{idx + 1}</div>
      </TableCell>
      {isAdminMode && isDev && (
        <TableCell id="questionId" className="max-w-[8em] truncate max-sm:hidden">
          <div className="truncate">
            <span className="mr-[2px] opacity-30">#</span>
            {id}
          </div>
        </TableCell>
      )}
      <TableCell id="text" className="max-w-[12em] truncate">
        <Link className="truncate text-lg font-medium hover:underline" href={`${routePath}/${id}`}>
          {truncate(text, 40)}
        </Link>
      </TableCell>
      <TableCell id="answers" className="max-w-[8em] truncate">
        <div className="truncate">
          {answersCount ? (
            <span className="font-bold">{answersCount}</span>
          ) : (
            <span className="opacity-30">—</span>
          )}
        </div>
      </TableCell>
      <TableCell className="w-[2em] text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditAnswers(question.id)}
            aria-label="Edit Answers"
            title="Edit Answers"
          >
            <Icons.answers className="size-5" />
          </Button>
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
            className="size-9 shrink-0 text-destructive"
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
  const {
    className,
    questions,
    handleDeleteQuestion,
    handleAddQuestion,
    handleEditQuestion,
    handleEditAnswers,
  } = props;
  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

  const router = useRouter();
  const topicsContext = useTopicsContext();
  const questionsContext = useQuestionsContext();

  /* // UNUSED: Current topic
   * const topic = React.useMemo(() => {
   *   return topicsContext.topics.find(({ id }) => id === questionsContext.topicId);
   * }, [questionsContext.topicId, topicsContext]);
   */

  const goBack = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(questionsContext.topicsListRoutePath);
      }
    }, 200);
  }, [router, questionsContext]);

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

  const hasQuestions = !!questionsContext.questions.length;

  return (
    <Card
      className={cn(
        isDev && '__ManageTopicQuestionsListCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Header', // DEBUG
          'item-start flex flex-col gap-4 lg:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__ManageTopicQuestionsListCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <QuestionsBreadcrumbs
            className={cn(
              isDev && '__ManageTopicQuestionsListCard_Breadcrumbs', // DEBUG
            )}
            inactiveQuestions
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Manage Questions</span>
            </CardTitle>
            */}
        </div>
        <Toolbar
          handleAddQuestion={handleAddQuestion}
          handleDeleteTopic={handleDeleteTopic}
          goBack={goBack}
        />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        {hasQuestions ? (
          <ScrollArea
            saveScrollKey="ManageTopicQuestionsListCard"
            saveScrollHash={saveScrollHash}
            viewportClassName="px-6"
          >
            <Table>
              <QuestionTableHeader isAdminMode={isAdmin} />
              <TableBody>
                {questions.map((question, idx) => (
                  <QuestionTableRow
                    key={question.id}
                    idx={idx}
                    question={question}
                    handleDeleteQuestion={handleDeleteQuestion}
                    handleEditQuestion={handleEditQuestion}
                    handleEditAnswers={handleEditAnswers}
                    isAdminMode={isAdmin}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <PageEmpty
            className="size-full flex-1"
            iconName="questions"
            title="No questions have been created yet"
            description="You dont have any questions yet. Add any question to your profile."
            framed={false}
            buttons={
              <>
                {/*
                <Button onClick={goBack} className="flex gap-2">
                  <Icons.arrowLeft className="size-4" />
                  Go Back
                </Button>
                */}
                <Button onClick={handleAddQuestion} className="flex gap-2">
                  <Icons.add className="size-4" />
                  Add Question
                </Button>
              </>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
