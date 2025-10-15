import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { APIError } from '@/lib/types/api';
import { generateArray } from '@/lib/helpers';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScrollAreaInfinite } from '@/components/ui/ScrollAreaInfinite';
import { Skeleton } from '@/components/ui/Skeleton';
import { Switch } from '@/components/ui/Switch';
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
import { updateAnswer } from '@/features/answers/actions';
import { useAnswersBreadcrumbsItems } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import {
  useAvailableAnswers,
  useAvailableQuestionById,
  useAvailableTopicById,
  useGoBack,
  useGoToTheRoute,
  useSessionUser,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

const saveScrollHash = getRandomHashString();

export interface TManageTopicQuestionAnswersListCardProps {
  topicId: TTopicId;
  questionId: TQuestionId;
  availableTopicQuery: ReturnType<typeof useAvailableTopicById>;
  availableQuestionQuery: ReturnType<typeof useAvailableQuestionById>;
  availableAnswersQuery: ReturnType<typeof useAvailableAnswers>;
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
        <TableHead id="isCorrect" className="truncate max-sm:hidden">
          Correct
        </TableHead>
        <TableHead id="isGenerated" className="truncate max-sm:hidden">
          Generated
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TAnswerTableRowProps {
  answer: TAnswer;
  idx: number;
  answersListRoutePath: string;
  isAdminMode: boolean;
  availableAnswersQuery: ReturnType<typeof useAvailableAnswers>;
}

function AnswerTableRow(props: TAnswerTableRowProps) {
  const { answer, answersListRoutePath, isAdminMode, idx, availableAnswersQuery } = props;
  const answerId = answer.id;
  const answerRoutePath = `${answersListRoutePath}/${answerId}`;
  const { id, text, isCorrect, isGenerated } = answer;

  const [isPending, startTransition] = React.useTransition();

  const handleToggleCorrect = React.useCallback(
    (checked: boolean) => {
      startTransition(async () => {
        const updatedAnswer = { ...answer, isCorrect: checked };
        try {
          // Update via server function
          await updateAnswer(updatedAnswer);
          // Update the item to the cached react-query data
          availableAnswersQuery.updateAnswer(updatedAnswer);
          // TODO: Update or invalidate all other possible AvailableAnswer and AvailableAnswers cached data
          // Invalidate all other keys...
          availableAnswersQuery.invalidateAllKeysExcept([availableAnswersQuery.queryKey]);
        } catch (error) {
          const details = error instanceof APIError ? error.details : null;
          const message = 'Cannot update answer status';
          // eslint-disable-next-line no-console
          console.error('[AnswerTableRow:handleToggleCorrect]', message, {
            details,
            error,
            answerId: answer.id,
          });
          debugger; // eslint-disable-line no-debugger
          toast.error(message);
        }
      });
    },
    [answer, availableAnswersQuery],
  );
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
      <TableCell id="text" className="max-w-[20em] truncate">
        <Link className="truncate text-lg font-medium hover:underline" href={answerRoutePath}>
          {truncateMarkdown(text, 40)}
        </Link>
      </TableCell>
      <TableCell id="isCorrect" className="w-[8em] max-sm:hidden">
        <Switch
          checked={isCorrect}
          onCheckedChange={handleToggleCorrect}
          disabled={isPending}
          className="data-[state=checked]:bg-green-500"
        />
      </TableCell>
      <TableCell id="isGenerated" className="w-[8em] max-sm:hidden">
        {isGenerated && <Icons.CircleCheck className="stroke-blue-500" />}
      </TableCell>
      <TableCell id="actions" className="w-[2em] text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            // onClick={() => handleEditAnswer(answer.id)}
            aria-label="Edit"
            title="Edit"
          >
            <Link className="flex" href={`${answerRoutePath}/edit`}>
              <Icons.Edit className="size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-destructive"
            // onClick={() => handleDeleteAnswer(answer.id)}
            aria-label="Delete"
            title="Delete"
          >
            <Link
              className="flex"
              href={`${answersListRoutePath}/delete?answerId=${answer.id}&from=ManageTopicQuestionAnswersListCard`}
            >
              <Icons.Trash className="size-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface TManageTopicQuestionAnswersListCardContentProps
  extends TManageTopicQuestionAnswersListCardProps {
  availableAnswersQuery: ReturnType<typeof useAvailableAnswers>;
  answersListRoutePath: string;
}

export function ManageTopicQuestionAnswersListCardContent(
  props: TManageTopicQuestionAnswersListCardContentProps & { className?: string },
) {
  const {
    className,
    // topicId,
    // questionId,
    availableAnswersQuery,
    answersListRoutePath,
  } = props;

  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';

  const {
    allAnswers,
    hasAnswers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isAnswersLoading,
    isFetched: isAnswersFetched,
    // queryKey: availableAnswersQueryKey,
    // queryProps: availableAnswersQueryProps,
  } = availableAnswersQuery;

  const isOverallLoading = !isAnswersFetched || isAnswersLoading;

  if (isOverallLoading) {
    return (
      <div
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCardContent_Skeleton', // DEBUG
          'flex flex-col gap-4 px-6',
        )}
      >
        <Skeleton className="h-8 w-full rounded-lg" />
        {generateArray(3).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!hasAnswers) {
    return (
      <PageEmpty
        className="size-full flex-1"
        icon={Icons.Answers}
        title="No answers have been created yet"
        description="You dont have any answers yet. Add any answer to your profile."
        framed={false}
        buttons={
          <>
            <Button>
              <Link href={`${answersListRoutePath}/add`} className="flex gap-2">
                <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
                Add New Answer
              </Link>
            </Button>
          </>
        }
      />
    );
  }

  // TODO: Use ScrollAreaInfinite
  return (
    <ScrollAreaInfinite
      effectorData={allAnswers}
      fetchNextPage={fetchNextPage}
      isLoading={isAnswersLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      saveScrollKey="ManageTopicQuestionAnswersListCard"
      saveScrollHash={saveScrollHash}
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListCardContent', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
      viewportClassName={cn(
        isDev && '__ManageTopicQuestionAnswersListCardContent_Viewport', // DEBUG
        'px-6',
      )}
      containerClassName={cn(
        isDev && '__ManageTopicQuestionAnswersListCardContent_Container', // DEBUG
        'relative w-full flex flex-col gap-4',
      )}
    >
      <Table>
        <AnswerTableHeader isAdminMode={isAdmin} />
        <TableBody>
          {allAnswers.map((answer, idx) => (
            <AnswerTableRow
              key={answer.id}
              idx={idx}
              answer={answer}
              answersListRoutePath={answersListRoutePath}
              isAdminMode={isAdmin}
              availableAnswersQuery={availableAnswersQuery}
            />
          ))}
        </TableBody>
      </Table>
    </ScrollAreaInfinite>
  );
}

export function ManageTopicQuestionAnswersListCard(
  props: TManageTopicQuestionAnswersListCardProps,
) {
  const {
    topicId,
    questionId,
    availableTopicQuery,
    availableQuestionQuery,
    availableAnswersQuery,
  } = props;

  const { manageScope } = useManageTopicsStore();

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const {
    topic,
    // isFetched: isTopicFetched,
    // isLoading: isTopicLoading,
  } = availableTopicQuery;
  // const isTopicLoadingOverall = !topic && (!isTopicFetched || isTopicLoading);
  if (!topic) {
    throw new Error('No topic found');
  }

  const {
    question,
    // isFetched: isQuestionFetched,
    // isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  // const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);
  if (!question) {
    throw new Error('No question found');
  }

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

  const {
    refetch: refetchAnswers,
    isRefetching: isAnswersRefetching,
    // isLoading: isAnswersLoading,
    // isFetched: isAnswersFetched,
  } = availableAnswersQuery;

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'md',
        onClick: goBack,
      },
      {
        id: 'Reload',
        content: 'Reload',
        variant: 'ghost',
        icon: Icons.Refresh,
        visibleFor: 'lg',
        pending: isAnswersRefetching,
        onClick: () => refetchAnswers(),
      },
      {
        id: 'Add New Answer',
        content: 'Add New Answer',
        variant: 'ghost',
        icon: Icons.Add,
        visibleFor: 'lg',
        onClick: () => goToTheRoute(`${answersListRoutePath}/add`),
      },
    ],
    [goBack, isAnswersRefetching, refetchAnswers, goToTheRoute, answersListRoutePath],
  );

  const breadcrumbs = useAnswersBreadcrumbsItems({
    scope: manageScope,
    isLoading: !topic || !question,
    topic: topic,
    question: question,
  });

  return (
    <>
      <DashboardHeader
        heading="Manage Answers"
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_DashboardHeader', // DEBUG
          'mx-6',
        )}
        actions={actions}
        breadcrumbs={breadcrumbs}
        inactiveLastBreadcrumb
      />
      <Card
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <ManageTopicQuestionAnswersListCardContent
          {...props}
          className={cn(
            isDev && '__ManageTopicQuestionAnswersListCard_CardContent', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden px-0',
          )}
          answersListRoutePath={answersListRoutePath}
          availableAnswersQuery={availableAnswersQuery}
        />
      </Card>
    </>
  );
}
