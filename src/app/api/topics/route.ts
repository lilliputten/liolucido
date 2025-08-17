import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { safeJsonParse } from '@/lib/helpers/json';
import { getAvailableTopics } from '@/features/topics/actions';
import {
  GetAvailableTopicsParamsSchema,
  TTopicOrderBy,
  zTopicOrderBy,
} from '@/features/topics/actions/getAvailableTopicsSchema';

const TargetParamsSchema = GetAvailableTopicsParamsSchema;
const TargetParamsSchemaWithPlainOderBy = TargetParamsSchema.extend({
  orderBy: z.string().optional(), // JSON string
});

/** GET /api/topics - Get topics */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  try {
    const params = Object.fromEntries(searchParams.entries());
    const parsedParams = TargetParamsSchemaWithPlainOderBy.parse(params);
    const {
      skip,
      take,
      showOnlyMyTopics,
      includeUser,
      includeQuestionsCount,
      orderBy: orderByStr,
    } = parsedParams;

    const orderBy = orderByStr
      ? zTopicOrderBy.parse(safeJsonParse<TTopicOrderBy>(orderByStr, {}))
      : undefined;

    const topics = await getAvailableTopics({
      skip,
      take,
      showOnlyMyTopics,
      includeUser,
      includeQuestionsCount,
      orderBy,
    });

    const response: TApiResponse<typeof topics> = {
      data: topics,
      ok: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      // eslint-disable-next-line no-console
      console.error('[API /topics/[topicId]/topics GET] ZodError', error);
      debugger;

      const response: TApiResponse<null> = {
        data: null,
        ok: false,
        error: {
          code: 'ZOD_ERROR',
          message: 'Zod parsing error', // error instanceof Error ? error.message : 'Failed to fetch topics',
          details: {
            // error: error instanceof Error ? error.message : String(error),
            stack: error.stack,
            issues: error.issues,
          },
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    // eslint-disable-next-line no-console
    console.error('[API /topics/[topicId]/topics GET]', error);
    debugger; // eslint-disable-line no-debugger

    const response: TApiResponse<null> = {
      data: null,
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch topics',
        details: { error: error instanceof Error ? error.message : String(error) },
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
