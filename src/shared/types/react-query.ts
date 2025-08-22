import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

import { TGetAvailableTopicsResults } from '@/features/topics/actions/getAvailableTopicsSchema';

export type TAllUsedKeys = Record<string, QueryKey>;
export type TQueryClient = ReturnType<typeof useQueryClient>;

// Available topic queries

export type TAvailableTopicsResultsQueryData = InfiniteData<TGetAvailableTopicsResults, unknown>;
