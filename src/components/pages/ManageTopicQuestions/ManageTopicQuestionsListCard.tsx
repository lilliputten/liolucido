import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { TPropsWithClassName } from '@/shared/types/generic';
import { handleApiResponse } from '@/lib/api';
import { useInvalidateReactQueryKeys } from '@/lib/data/invalidateReactQueryKeys';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
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
import {
  TUpdatedQuestionsCountDetail,
  updatedQuestionsCountEventName,
} from '@/constants/eventTypes';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { QuestionsBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion, TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useGoBack, useGoToTheRoute, useSessionUser } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { PageEmpty } from '../shared/PageEmpty';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionsListCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  // questions: TQuestion[];
  handleDeleteQuestion: (questionId: TQuestionId) => void;
  handleEditQuestion: (questionId: TQuestionId) => void;
  handleAddQuestion: () => void;
  handleEditAnswers: (questionId: TQuestionId) => void;
}

interface TToolbarActionsProps {
  topicId: TTopicId;
  handleAddQuestion: () => void;
  handleDeleteTopic?: () => void;
  goBack: () => void;
}

function Toolbar(props: TToolbarActionsProps) {
  const { topicId, handleAddQuestion, goBack } = props;
  const [isReloading, startReload] = React.useTransition();
  const invalidateKeys = useInvalidateReactQueryKeys();

  const questionsContext = useQuestionsContext();

  const handleReload = React.useCallback(() => {
    const { setQuestions } = questionsContext;
    startReload(async () => {
      try {
        const result = await handleApiResponse(fetch(`/api/topics/${topicId}/questions`), {
          onInvalidateKeys: invalidateKeys,
          debugDetails: {
            initiator: 'Toolbar',
            action: 'getTopicQuestions',
            topicId,
          },
        });
        const questions = result.ok && result.data ? (result.data as TQuestion[]) : [];
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
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot reload questions data';
        // eslint-disable-next-line no-console
        console.error('[Toolbar]', message, {
          details,
          error,
          topicId,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(message);
      }
    });
  }, [topicId, questionsContext, invalidateKeys]);

  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionsListCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button variant="ghost" size="sm" className="flex gap-2 px-4" onClick={goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
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
        <Icons.refresh
          className={cn('hidden size-4 opacity-50 sm:flex', isReloading && 'animate-spin')}
        />
        <span>Reload</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2 px-4">
        <Icons.add className="hidden size-4 opacity-50 sm:flex" />
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
  topicRoutePath: string;
  handleDeleteQuestion: TManageTopicQuestionsListCardProps['handleDeleteQuestion'];
  handleEditQuestion: TManageTopicQuestionsListCardProps['handleEditQuestion'];
  handleEditAnswers: TManageTopicQuestionsListCardProps['handleEditAnswers'];
  isAdminMode: boolean;
}

function QuestionTableRow(props: TQuestionTableRowProps) {
  const {
    question,
    topicRoutePath,
    handleDeleteQuestion,
    handleEditQuestion,
    handleEditAnswers,
    isAdminMode,
    idx,
  } = props;
  const { id, text, _count } = question;
  const questionRoutePath = `${topicRoutePath}/${id}`;
  const answersCount = _count?.answers;
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
        <Link className="truncate text-lg font-medium hover:underline" href={questionRoutePath}>
          {truncateMarkdown(text, 40)}
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
      <TableCell id="actions" className="w-[2em] text-right">
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

export function ManageTopicQuestionsListCardContent(
  props: TManageTopicQuestionsListCardProps & { topicRoutePath: string },
) {
  const {
    topicRoutePath,
    topicId,
    // questions,
    handleDeleteQuestion,
    handleAddQuestion,
    handleEditQuestion,
    handleEditAnswers,
  } = props;

  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

  const availableQuestions = useAvailableQuestions({ topicId });
  const {
    allQuestions,
    hasQuestions,
    isFetched: isQuestionsFetched,
    isLoading: isQuestionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // queryKey: availableQuestionsQueryKey,
    // queryProps: availableQuestionsQueryProps,
  } = availableQuestions;

  if (!isQuestionsFetched) {
    return (
      <div
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Skeleton', // DEBUG
          'flex size-full flex-1 flex-col gap-4 p-6',
        )}
      >
        <Skeleton className="h-8 w-full rounded-lg" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  } else if (!hasQuestions) {
    return (
      <PageEmpty
        className="size-full flex-1"
        iconName="questions"
        title="No questions have been created yet"
        description="You dont have any questions yet. Add any question to your profile."
        framed={false}
        buttons={
          <>
            <Button onClick={handleAddQuestion} className="flex gap-2">
              <Icons.add className="hidden size-4 opacity-50 sm:flex" />
              Add New Question
            </Button>
          </>
        }
      />
    );
  }

  return (
    <ScrollAreaInfinite
      effectorData={allQuestions}
      fetchNextPage={fetchNextPage}
      isLoading={isQuestionsLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      saveScrollKey="ManageTopicQuestionsListCardContent"
      saveScrollHash={saveScrollHash}
      className={cn(
        isDev && '__ManageTopicQuestionsListCardContent_Scroll', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
      viewportClassName={cn(
        isDev && '__ManageTopicQuestionsListCardContent_Scroll_Viewport', // DEBUG
        'px-6',
      )}
      containerClassName={cn(
        isDev && '__ManageTopicQuestionsListCardContent_Scroll_Container', // DEBUG
        'relative w-full flex flex-col gap-4',
      )}
    >
      <Table>
        <QuestionTableHeader isAdminMode={isAdmin} />
        <TableBody>
          {allQuestions.map((question, idx) => (
            <QuestionTableRow
              key={question.id}
              idx={idx}
              question={question}
              topicRoutePath={topicRoutePath}
              handleDeleteQuestion={handleDeleteQuestion}
              handleEditQuestion={handleEditQuestion}
              handleEditAnswers={handleEditAnswers}
              isAdminMode={isAdmin}
            />
          ))}
        </TableBody>
      </Table>
    </ScrollAreaInfinite>
  );
}

export function ManageTopicQuestionsListCard(props: TManageTopicQuestionsListCardProps) {
  const {
    className,
    topicId,
    // handleDeleteQuestion,
    handleAddQuestion,
    // handleEditQuestion,
    // handleEditAnswers,
  } = props;
  const { manageScope } = useManageTopicsStore();
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  // const questionsListRoutePath = `${topicRoutePath}/questions`;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(topicsListRoutePath);

  // Delete Topic Modal
  const handleDeleteTopic = React.useCallback(() => {
    const url = `${topicsListRoutePath}/delete?topicId=${topicId}&from=ManageTopicQuestionsListCard`;
    goToTheRoute(url);
  }, [goToTheRoute, topicId, topicsListRoutePath]);

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
          topicId={topicId}
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
        <ManageTopicQuestionsListCardContent {...props} topicRoutePath={topicRoutePath} />
      </CardContent>
    </Card>
  );
}
