import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { TApiResponse } from '@/shared/types/api';
import { safeJsonParse } from '@/lib/helpers/json';
import { zodMakeAllFieldsOptionalString } from '@/lib/helpers/types';
import { getAvailableTopics } from '@/features/topics/actions';
import {
  GetAvailableTopicsParamsSchema,
  TTopicOrderBy,
} from '@/features/topics/actions/getAvailableTopicsSchema';

const ParsedSchema = GetAvailableTopicsParamsSchema;
const ParsedSchemaRaw = ParsedSchema.extend({
  orderBy: z.string().optional(), // JSON string
});
const _ParamsSchema = zodMakeAllFieldsOptionalString(ParsedSchemaRaw);
type TParams = z.infer<typeof _ParamsSchema>;

/** GET /api/topics - Get topics */
export async function GET(_request: NextRequest, { params }: { params: Promise<TParams> }) {
  try {
    const resolvedParams = await params;
    const parsedParams = ParsedSchemaRaw.parse(resolvedParams);
    const {
      skip,
      take,
      showOnlyMyTopics,
      includeUser,
      includeQuestionsCount,
      orderBy: orderByStr,
    } = parsedParams;

    const orderBy = orderByStr
      ? safeJsonParse<TTopicOrderBy | undefined>(orderByStr, undefined)
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
