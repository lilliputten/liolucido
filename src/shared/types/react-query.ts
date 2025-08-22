import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

import { TGetAvailableTopicsResults } from '@/lib/zod-schemes';

export type TAllUsedKeys = Record<string, QueryKey>;
export type TQueryClient = ReturnType<typeof useQueryClient>;

// Available topic queries

export type TAvailableTopicsResultsQueryData = InfiniteData<TGetAvailableTopicsResults, unknown>;
