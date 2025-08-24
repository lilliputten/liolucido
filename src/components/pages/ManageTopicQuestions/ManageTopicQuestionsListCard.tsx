import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
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
import { QuestionsScopeBreadcrumbs } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion, TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById, useGoBack, useGoToTheRoute, useSessionUser } from '@/hooks';
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

function Toolbar(
  props: TToolbarActionsProps & {
    availableQuestionsQuery: ReturnType<typeof useAvailableQuestions>;
  },
) {
  const {
    availableQuestionsQuery,
    // topicId,
    handleAddQuestion,
    goBack,
  } = props;

  const { refetch, isRefetching } = availableQuestionsQuery;

  const handleReload = React.useCallback(() => {
    refetch({ cancelRefetch: true });
  }, [refetch]);

  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionsListCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button variant="ghost" size="sm" className="flex gap-2" onClick={goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'flex items-center gap-2 px-4',
          isRefetching && 'pointer-events-none opacity-50',
        )}
        onClick={handleReload}
      >
        <Icons.refresh
          className={cn('hidden size-4 opacity-50 sm:flex', isRefetching && 'animate-spin')}
        />
        <span>Reload</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2">
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
  questionsListRoutePath: string;
  handleDeleteQuestion: TManageTopicQuestionsListCardProps['handleDeleteQuestion'];
  handleEditQuestion: TManageTopicQuestionsListCardProps['handleEditQuestion'];
  handleEditAnswers: TManageTopicQuestionsListCardProps['handleEditAnswers'];
  isAdminMode: boolean;
}

function QuestionTableRow(props: TQuestionTableRowProps) {
  const {
    question,
    questionsListRoutePath,
    handleDeleteQuestion,
    handleEditQuestion,
    handleEditAnswers,
    isAdminMode,
    idx,
  } = props;
  const { id, text, _count } = question;
  const questionRoutePath = `${questionsListRoutePath}/${id}`;
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
  props: TManageTopicQuestionsListCardProps & {
    questionsListRoutePath: string;
    availableQuestionsQuery: ReturnType<typeof useAvailableQuestions>;
  },
) {
  const {
    availableQuestionsQuery,
    questionsListRoutePath,
    // topicId,
    // questions,
    handleDeleteQuestion,
    handleAddQuestion,
    handleEditQuestion,
    handleEditAnswers,
  } = props;

  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

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
  } = availableQuestionsQuery;

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
              questionsListRoutePath={questionsListRoutePath}
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
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const availableQuestionsQuery = useAvailableQuestions({ topicId });

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const { data: topic } = availableTopicQuery;

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
          <QuestionsScopeBreadcrumbs
            className={cn(
              isDev && '__ManageTopicQuestionsListCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            isLoading={!topic}
            topic={topic}
            inactiveLast
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
          availableQuestionsQuery={availableQuestionsQuery}
        />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ManageTopicQuestionsListCardContent
          {...props}
          questionsListRoutePath={questionsListRoutePath}
          availableQuestionsQuery={availableQuestionsQuery}
        />
      </CardContent>
    </Card>
  );
}
