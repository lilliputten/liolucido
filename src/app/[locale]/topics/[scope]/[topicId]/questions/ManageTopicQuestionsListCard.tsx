import React from 'react';
import Link from 'next/link';

import { truncateMarkdown } from '@/lib/helpers/markdown';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { useAvailableQuestions } from '@/hooks/react-query/useAvailableQuestions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScrollAreaInfinite } from '@/components/ui/ScrollAreaInfinite';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PageEmpty } from '@/components/pages/shared';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { useQuestionsBreadcrumbsItems } from '@/features/questions/components/QuestionsBreadcrumbs';
import { TQuestion, TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById, useGoBack, useSessionUser } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

const saveScrollHash = getRandomHashString();

export interface TManageTopicQuestionsListCardProps {
  topicId: TTopicId;
  // questions: TQuestion[];
  handleDeleteQuestion: (questionId: TQuestionId) => void;
  handleEditQuestion: (questionId: TQuestionId) => void;
  handleAddQuestion: () => void;
  handleEditAnswers: (questionId: TQuestionId) => void;
  availableQuestionsQuery: ReturnType<typeof useAvailableQuestions>;
  availableTopicQuery: ReturnType<typeof useAvailableTopicById>;
}

/*
 * interface TToolbarActionsProps {
 *   topicId: TTopicId;
 *   handleAddQuestion: () => void;
 *   // handleDeleteTopic?: () => void;
 *   goBack: () => void;
 * }
 * function Toolbar(
 *   props: TToolbarActionsProps & {
 *     availableQuestionsQuery: ReturnType<typeof useAvailableQuestions>;
 *   },
 * ) {
 *   const {
 *     availableQuestionsQuery,
 *     // topicId,
 *     handleAddQuestion,
 *     goBack,
 *   } = props;
 *
 *   const { refetch, isRefetching } = availableQuestionsQuery;
 *
 *   const handleReload = React.useCallback(() => {
 *     refetch({ cancelRefetch: true });
 *   }, [refetch]);
 *
 *   return (
 *     <div
 *       className={cn(
 *         isDev && '__ManageTopicQuestionsListCard_Toolbar', // DEBUG
 *         'flex flex-wrap gap-2',
 *       )}
 *     >
 *       <Button variant="ghost" size="sm" className="flex gap-2" onClick={goBack}>
 *         <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
 *         <span>Back</span>
 *       </Button>
 *       <Button
 *         variant="ghost"
 *         size="sm"
 *         className={cn(
 *           'flex items-center gap-2 px-4',
 *           isRefetching && 'pointer-events-none opacity-50',
 *         )}
 *         onClick={handleReload}
 *       >
 *         <Icons.Refresh
 *           className={cn('hidden size-4 opacity-50 sm:flex', isRefetching && 'animate-spin')}
 *         />
 *         <span>Reload</span>
 *       </Button>
 *       <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2">
 *         <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
 *         <span>
 *           Add <span className="hidden sm:inline-flex">New Question</span>
 *         </span>
 *       </Button>
 *     </div>
 *   );
 * }
 */

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
            <Icons.Answers className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditQuestion(question.id)}
            aria-label="Edit"
            title="Edit"
          >
            <Icons.Edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-destructive"
            onClick={() => handleDeleteQuestion(question.id)}
            aria-label="Delete"
            title="Delete"
          >
            <Icons.Trash className="size-4" />
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
          'flex size-full flex-1 flex-col gap-4 px-6',
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
        icon={Icons.Questions}
        title="No questions have been created yet"
        description="You dont have any questions yet. Add any question to your profile."
        framed={false}
        buttons={
          <>
            <Button onClick={handleAddQuestion} className="flex gap-2">
              <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
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
    topicId,
    // handleDeleteQuestion,
    handleAddQuestion,
    // handleEditQuestion,
    // handleEditAnswers,
    availableQuestionsQuery,
    availableTopicQuery,
  } = props;
  const { manageScope } = useManageTopicsStore();

  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;

  const { topic } = availableTopicQuery;
  const { refetch, isRefetching } = availableQuestionsQuery;

  // const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(topicsListRoutePath);

  const handleReload = React.useCallback(() => {
    refetch({ cancelRefetch: true });
  }, [refetch]);

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'sm',
        onClick: goBack,
      },
      {
        id: 'Reload',
        content: 'Reload',
        variant: 'ghost',
        icon: Icons.Refresh,
        visibleFor: 'lg',
        pending: isRefetching,
        onClick: handleReload,
      },
      {
        id: 'Add New Question',
        content: 'Add New Question',
        variant: 'success',
        icon: Icons.Add,
        // visibleFor: 'md',
        onClick: handleAddQuestion,
      },
    ],
    [goBack, isRefetching, handleReload, handleAddQuestion],
  );

  const breadcrumbs = useQuestionsBreadcrumbsItems({
    scope: manageScope,
    // isLoading: !topic,
    topic,
  });

  return (
    <>
      <DashboardHeader
        heading="View Questions"
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_DashboardHeader', // DEBUG
          'mx-6',
        )}
        actions={actions}
        breadcrumbs={breadcrumbs}
        inactiveLastBreadcrumb
      />
      <Card
        className={cn(
          isDev && '__ManageTopicQuestionsListCard_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <ManageTopicQuestionsListCardContent
          {...props}
          questionsListRoutePath={questionsListRoutePath}
          availableQuestionsQuery={availableQuestionsQuery}
        />
      </Card>
    </>
  );
}
