import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/lib/types/api';
import { safeJsonParse } from '@/lib/helpers/json';
import {
  GetAvailableQuestionsParamsSchema,
  TQuestionOrderBy,
  TQuestionQuestionIds,
  zQuestionOrderBy,
  zQuestionQuestionIds,
} from '@/lib/zod-schemas';
import { getAvailableQuestions } from '@/features/questions/actions';

const TargetParamsSchema = GetAvailableQuestionsParamsSchema;
const TargetParamsSchemaPlain = TargetParamsSchema.extend({
  orderBy: z.string().optional(), // JSON string (object)
  questionIds: z.string().optional(), // JSON string (array)
});

/** GET /api/questions?... - Get questions for a topic or by other conditions (by questionIds */
export async function GET(
  request: NextRequest,
  // { params }: { params: Promise<{ topicId: string }> },
) {
  const { searchParams } = request.nextUrl;
  try {
    const params = Object.fromEntries(searchParams.entries());
    const parsedParams = TargetParamsSchemaPlain.parse(params);
    const {
      topicId,
      skip,
      take,
      adminMode,
      showOnlyMyQuestions,
      includeTopic,
      includeAnswersCount,
      orderBy: orderByStr,
      questionIds: questionIdsStr,
    } = parsedParams;

    // Parse json packed orderBy
    const orderBy = orderByStr
      ? zQuestionOrderBy.parse(safeJsonParse<TQuestionOrderBy>(orderByStr, {}))
      : undefined;

    // Parse json packed questionIds
    const questionIds = questionIdsStr
      ? zQuestionQuestionIds.parse(safeJsonParse<TQuestionQuestionIds>(questionIdsStr, []))
      : undefined;

    const questions = await getAvailableQuestions({
      topicId,
      skip,
      take,
      adminMode,
      showOnlyMyQuestions,
      includeTopic,
      includeAnswersCount,
      orderBy,
      questionIds,
    });

    const response: TApiResponse<typeof questions> = {
      data: questions,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API GET /api/questions]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch questions',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
