import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { rootRoute } from '@/config/routesConfig';
import { getRandomHashString, truncateString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { TCachedUsers, useCachedUsersForTopics } from '@/hooks/topics/useCachedUsersForTopics';
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
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { TopicsManageScopeIds, topicsNamespaces } from '@/contexts/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';
import { useAvailableTopicsByScope, useGoBack, useSessionUser } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

const saveScrollHash = getRandomHashString();

interface TManageTopicsListCardProps {
  handleDeleteTopic: (topicId: TTopicId, from: string) => void;
  handleEditTopic: (topicId: TTopicId) => void;
  handleEditQuestions: (topicId: TTopicId) => void;
  handleAddTopic: () => void;
  availableTopicsQuery: ReturnType<typeof useAvailableTopicsByScope>;
}
interface TManageTopicsListCardContentProps extends TManageTopicsListCardProps {
  className?: string;
  goBack: () => void;
}

function TopicTableHeader({ isAdminMode }: { isAdminMode: boolean }) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead id="no" className="truncate text-right max-lg:hidden">
          No
        </TableHead>
        {isAdminMode && isDev && (
          <TableHead id="topicId" className="truncate max-lg:hidden">
            ID
          </TableHead>
        )}
        <TableHead id="name" className="truncate">
          Topic Name
        </TableHead>
        <TableHead id="questions" className="truncate max-lg:hidden">
          Questions
        </TableHead>
        {isAdminMode && (
          <TableHead id="topicUser" className="truncate max-lg:hidden">
            User
          </TableHead>
        )}
        <TableHead id="language" className="truncate max-lg:hidden">
          Language
        </TableHead>
        <TableHead id="keywords" className="truncate max-lg:hidden">
          Keywords
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface TTopicTableRowProps {
  topic: TTopic;
  idx: number;
  handleDeleteTopic: TManageTopicsListCardProps['handleDeleteTopic'];
  handleEditTopic: TManageTopicsListCardProps['handleEditTopic'];
  handleEditQuestions: TManageTopicsListCardProps['handleEditQuestions'];
  isAdminMode: boolean;
  cachedUsers: TCachedUsers;
}

function TopicTableRow(props: TTopicTableRowProps) {
  const {
    topic,
    handleDeleteTopic,
    handleEditTopic,
    handleEditQuestions,
    isAdminMode,
    cachedUsers,
    idx,
  } = props;
  const { id, name, langCode, langName, keywords, userId, _count } = topic;
  const questionsCount = _count?.questions;
  const topicUser = isAdminMode ? cachedUsers[userId] : undefined;
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  return (
    <TableRow className="truncate" data-topic-id={id}>
      <TableCell id="no" className="max-w-[1em] truncate text-right opacity-50 max-lg:hidden">
        <div className="truncate">{idx + 1}</div>
      </TableCell>
      {isAdminMode && isDev && (
        <TableCell id="topicId" className="max-w-[8em] truncate max-lg:hidden">
          <div className="truncate">
            <span className="mr-[2px] opacity-30">#</span>
            {id}
          </div>
        </TableCell>
      )}
      <TableCell id="name" className="max-w-[8em] truncate">
        <Link className="truncate text-lg font-medium hover:underline" href={`${routePath}/${id}`}>
          {truncateString(name, 40)}
        </Link>
      </TableCell>
      <TableCell id="questions" className="max-w-[8em] truncate max-lg:hidden">
        <div className="truncate">
          {questionsCount ? (
            <span className="font-bold">{questionsCount}</span>
          ) : (
            <span className="opacity-30">—</span>
          )}
        </div>
      </TableCell>
      {isAdminMode && (
        <TableCell id="topicUser" className="max-w-[8em] truncate max-lg:hidden">
          <div className="truncate" title={topicUser?.name || undefined}>
            {topicUser?.name || <Skeleton className="h-[2em] w-[8em] rounded-sm" />}
          </div>
        </TableCell>
      )}
      <TableCell id="language" className="max-w-[8em] truncate max-lg:hidden">
        <div className="truncate">
          {[langName, langCode && `(${langCode})`].filter(Boolean).join(' ')}
        </div>
      </TableCell>
      <TableCell id="keywords" className="max-w-[8em] truncate max-lg:hidden">
        <div className="truncate">{keywords}</div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditQuestions(topic.id)}
            aria-label="Edit Questions"
            title="Edit Questions"
          >
            <Icons.Questions className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => handleEditTopic(topic.id)}
            aria-label="Edit"
            title="Edit"
          >
            <Icons.Edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-destructive"
            onClick={() => handleDeleteTopic(topic.id, 'ManageTopicsListCard')}
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

export function ManageTopicsListCardContent(props: TManageTopicsListCardContentProps) {
  const {
    className,
    handleDeleteTopic,
    handleEditTopic,
    handleEditQuestions,
    handleAddTopic,
    availableTopicsQuery,
    goBack,
  } = props;
  const { manageScope } = useManageTopicsStore();
  const user = useSessionUser();
  const isAdminMode = manageScope === TopicsManageScopeIds.ALL_TOPICS || user?.role === 'ADMIN';
  const {
    isLoading,
    hasTopics,
    allTopics,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isError,
    error,
  } = availableTopicsQuery;

  const cachedUsers = useCachedUsersForTopics({
    topics: allTopics,
    bypass: !isAdminMode, // Do not use users data if not admin user role
  });

  if (isError) {
    return (
      <PageError
        className={cn(
          isDev && '__ManageTopicsListWrapper_Error', // DEBUG
        )}
        error={error || 'Error loading available topics data'}
        reset={refetch}
        // extraActions={extraActions}
      />
    );
  }

  if (!hasTopics) {
    return (
      <PageEmpty
        className="size-full flex-1"
        // onButtonClick={handleAddTopic}
        // buttonTitle="Add Topic"
        icon={Icons.Topics}
        title="No topics have been created yet"
        description="You dont have any topics yet. Add any topic to your profile."
        buttons={
          <>
            <Button variant="ghost" onClick={goBack} className="flex gap-2">
              <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
              Go Back
            </Button>
            <Button onClick={handleAddTopic} className="flex gap-2">
              <Icons.Topics className="hidden size-4 opacity-50 sm:flex" />
              Add Topic
            </Button>
          </>
        }
      />
    );
  }

  return (
    <ScrollAreaInfinite
      effectorData={allTopics}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      saveScrollKey="ManageTopicsListCard"
      saveScrollHash={saveScrollHash}
      className={cn(
        isDev && '__ManageTopicsListCard_Scroll', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
      viewportClassName={cn(
        isDev && '__ManageTopicsListCard_Scroll_Viewport', // DEBUG
        'px-6',
      )}
      containerClassName={cn(
        isDev && '__ManageTopicsListCard_Scroll_Container', // DEBUG
        'relative w-full flex flex-col gap-4',
      )}
    >
      <Table>
        <TopicTableHeader isAdminMode={isAdminMode} />
        <TableBody>
          {allTopics.map((topic, idx) => (
            <TopicTableRow
              key={topic.id}
              idx={idx}
              topic={topic}
              handleDeleteTopic={handleDeleteTopic}
              handleEditTopic={handleEditTopic}
              handleEditQuestions={handleEditQuestions}
              isAdminMode={isAdminMode}
              cachedUsers={cachedUsers}
            />
          ))}
        </TableBody>
      </Table>
    </ScrollAreaInfinite>
  );
}

export function ManageTopicsListCard(props: TManageTopicsListCardProps) {
  const {
    // handleDeleteTopic,
    // handleEditTopic,
    // handleEditQuestions,
    handleAddTopic,
    availableTopicsQuery,
  } = props;
  const { manageScope } = useManageTopicsStore();
  const namespace = topicsNamespaces[manageScope];
  const t = useTranslations(namespace);

  const { refetch, isRefetching } = availableTopicsQuery;

  const goBack = useGoBack(rootRoute);

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
        id: 'Add',
        content: 'Add New Topic',
        variant: 'ghost',
        icon: Icons.Add,
        visibleFor: 'md',
        onClick: handleAddTopic,
      },
    ],
    [goBack, handleAddTopic, handleReload, isRefetching],
  );

  return (
    <>
      <DashboardHeader
        heading={t('title')}
        className={cn(
          isDev && '__ManageTopicsListCard_DashboardHeader', // DEBUG
          'mx-6',
        )}
        // breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <Card
        className={cn(
          isDev && '__ManageTopicsListCard_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <ManageTopicsListCardContent
          {...props}
          className={cn(
            isDev && '__ManageTopicsListCard_CardContent', // DEBUG
            'flex flex-row flex-wrap items-start',
          )}
          goBack={goBack}
        />
      </Card>
    </>
  );
}
