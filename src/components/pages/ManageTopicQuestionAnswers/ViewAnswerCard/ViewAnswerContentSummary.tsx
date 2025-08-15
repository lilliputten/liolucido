'use client';

import React from 'react';
import Link from 'next/link';
import { useFormatter } from 'next-intl';

import { compareDates, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { truncateMarkdown } from '@/lib/helpers/markdown';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TAnswer } from '@/features/answers/types';

export function ViewAnswerContentSummary({ answer }: { answer: TAnswer }) {
  const format = useFormatter();
  const user = useSessionUser();
  const answersContext = useAnswersContext();
  const questionsContext = useQuestionsContext();
  const topicsContext = useTopicsContext();

  const question = React.useMemo(() => {
    return questionsContext.questions.find((q) => q.id === answer.questionId);
  }, [questionsContext.questions, answer.questionId]);

  const topic = React.useMemo(() => {
    return topicsContext.topics.find((t) => t.id === answersContext.topicId);
  }, [topicsContext.topics, answersContext.topicId]);

  const totalAnswersCount = answersContext.answers.length;

  const isOwner = !!topic?.userId && topic?.userId === user?.id;

  return (
    <div
      className={cn(
        isDev && '__ViewAnswerContentSummary', // DEBUG
        'mx-6 flex w-full flex-col gap-4',
      )}
    >
      {/* Answer Text */}
      <div data-testid="__Section_AnswerText" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Answer Text</h3>
        <div className="rounded-lg bg-slate-500/10 p-4">
          <MarkdownText>{answer.text}</MarkdownText>
        </div>
      </div>

      {/* Answer Properties */}
      <div data-testid="__Section_Properties" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            // variant={answer.isCorrect ? 'default' : 'secondary'}
            className={answer.isCorrect ? 'bg-green-500' : ''}
          >
            <Icons.CircleCheck className="mr-1 h-3 w-3" />
            {answer.isCorrect ? 'Correct' : 'Incorrect'}
          </Badge>
          {answer.isGenerated && (
            <Badge variant="outline" className="border-slate-500 text-slate-500">
              <Icons.Bot className="mr-1 h-3 w-3" />
              AI Generated
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Question Info */}
      {question && (
        <div data-testid="__Section_Question" className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">Question</h3>
            {isOwner && (
              <Button variant="ghost" size="sm">
                <Link
                  href={`${questionsContext.routePath}/${question.id}`}
                  className="flex items-center gap-2"
                >
                  <Icons.edit className="size-3" />
                  <span>Manage Question</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-slate-500/10 p-3">
            <p className="font-medium">{truncateMarkdown(question.text, 100)}</p>
            <p className="text-sm opacity-50">
              <span className="opacity-50">Total answers:</span> {totalAnswersCount}
            </p>
          </div>
        </div>
      )}

      {/* Topic Info */}
      {topic && (
        <div data-testid="__Section_Topic" className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">Topic</h3>
            {isOwner && (
              <Button variant="ghost" size="sm">
                <Link
                  href={`${topicsContext.routePath}/${topic.id}`}
                  className="flex items-center gap-2"
                >
                  <Icons.edit className="size-3" />
                  <span>Manage Topic</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-slate-500/10 p-3">
            <p className="font-medium">{topic.name}</p>
            {topic.description && (
              <p className="text-sm opacity-50">{truncateMarkdown(topic.description, 100)}</p>
            )}
            {!!topic._count?.questions && (
              <p className="text-sm opacity-50">
                <span className="opacity-50">Total questions:</span> {topic._count?.questions}
              </p>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Timestamps */}
      <div data-testid="__Section_Timeline" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Icons.CalendarDays className="h-4 w-4 opacity-50" />
            <span className="opacity-50">Created:</span>
            <span>{getFormattedRelativeDate(format, answer.createdAt)}</span>
          </div>
          {!!compareDates(answer.updatedAt, answer.createdAt) && (
            <div className="flex items-center gap-2">
              <Icons.edit className="h-4 w-4 opacity-50" />
              <span className="opacity-50">Modified:</span>
              <span>{getFormattedRelativeDate(format, answer.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div data-testid="__Section_Author" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Author</h3>
        <div className="flex items-center gap-2 text-sm">
          {isOwner ? (
            <>
              <Icons.ShieldCheck className="h-4 w-4 opacity-50" />
              <span>You're the author</span>
            </>
          ) : (
            topic && (
              <>
                <Icons.user className="h-4 w-4 opacity-50" />
                <span className="opacity-50">Topic created by:</span>
                <span>{topic.user?.name || topic.user?.email || 'Unknown'}</span>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
