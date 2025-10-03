import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { TPropsWithClassName } from '@/shared/types/generic';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollAreaInfinite } from '@/components/ui/ScrollAreaInfinite';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { updateAnswer } from '@/features/answers/actions';
import { AnswersBreadcrumbs } from '@/features/answers/components/AnswersBreadcrumbs';
import { TAnswer } from '@/features/answers/types';
import { TQuestionId } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';
import {
  useAvailableAnswers,
  useAvailableQuestionById,
  useAvailableTopicById,
  useGoBack,
  useSessionUser,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

import { PageEmpty } from '../shared/PageEmpty';

const saveScrollHash = getRandomHashString();

interface TManageTopicQuestionAnswersListCardProps extends TPropsWithClassName {
  topicId: TTopicId;
  questionId: TQuestionId;
  // handleDeleteAnswer: (answerId: TAnswerId) => void;
  // handleEditAnswer: (answerId: TAnswerId) => void;
  // handleAddAnswer: () => void;
}

interface TToolbarActionsProps {
  goBack: () => void;
  availableAnswersQuery: ReturnType<typeof useAvailableAnswers>;
  answersListRoutePath: string;
}

function Toolbar(props: TToolbarActionsProps) {
  const { answersListRoutePath, goBack, availableAnswersQuery } = props;
  const {
    refetch: refetchAnswers,
    isRefetching: isAnswersRefetching,
    isLoading: isAnswersLoading,
    isFetched: isAnswersFetched,
  } = availableAnswersQuery;
  const isOverallLoading = !isAnswersFetched || isAnswersLoading;

  if (isOverallLoading) {
    return (
      <div
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Toolbar_Skeleton', // DEBUG
          'flex gap-2',
        )}
      >
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListCard_Toolbar', // DEBUG
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
          isAnswersRefetching && 'pointer-events-none opacity-50',
        )}
        onClick={() => refetchAnswers()}
      >
        <Icons.Refresh
          className={cn('hidden size-4 opacity-50 sm:flex', isAnswersRefetching && 'animate-spin')}
        />
        <span>Reload</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Link href={`${answersListRoutePath}/add`} className="flex gap-2">
          <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
          <span>
            Add <span className="hidden sm:inline-flex">New Answer</span>
          </span>
        </Link>
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
  props: TManageTopicQuestionAnswersListCardContentProps,
) {
  const {
    // className,
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
        {[...Array(3)].map((_, i) => (
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
        isDev && '__ManageTopicQuestionAnswersListCard_Scroll', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
      viewportClassName={cn(
        isDev && '__ManageTopicQuestionAnswersListCard_Scroll_Viewport', // DEBUG
        'px-6',
      )}
      containerClassName={cn(
        isDev && '__ManageTopicQuestionAnswersListCard_Scroll_Container', // DEBUG
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
  const { className, topicId, questionId } = props;

  const { manageScope } = useManageTopicsStore();

  // Calculate paths...
  const topicsListRoutePath = `/topics/${manageScope}`;
  const topicRoutePath = `${topicsListRoutePath}/${topicId}`;
  const questionsListRoutePath = `${topicRoutePath}/questions`;
  const questionRoutePath = `${questionsListRoutePath}/${questionId}`;
  const answersListRoutePath = `${questionRoutePath}/answers`;
  // const answerRoutePath = `${answersListRoutePath}/${answerId}`;

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const {
    data: topic,
    // isFetched: isTopicFetched,
    // isLoading: isTopicLoading,
  } = availableTopicQuery;
  // const isTopicLoadingOverall = !topic && (!isTopicFetched || isTopicLoading);

  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    data: question,
    // isFetched: isQuestionFetched,
    // isLoading: isQuestionLoading,
  } = availableQuestionQuery;
  // const isQuestionLoadingOverall = !question && (!isQuestionFetched || isQuestionLoading);

  const availableAnswersQuery = useAvailableAnswers({ questionId });

  // const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(questionsListRoutePath);

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
            scope={manageScope}
            isLoading={!topic || !question}
            topic={topic}
            question={question}
            // answer={answer}
            inactiveLast
          />
        </div>
        <Toolbar
          goBack={goBack}
          availableAnswersQuery={availableAnswersQuery}
          answersListRoutePath={answersListRoutePath}
        />
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ManageTopicQuestionAnswersListCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
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
      </CardContent>
    </Card>
  );
}
