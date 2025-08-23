import { QueryKey, useQueryClient } from '@tanstack/react-query';

import { TAvailableQuestion } from '@/features/questions/types';
import { TAvailableTopic } from '@/features/topics/types';

import { TGetResultsIniniteQueryData } from './generic/api';

export type TAllUsedKeys = Record<string, QueryKey>;
export type TQueryClient = ReturnType<typeof useQueryClient>;

// Available topic queries

export type TAvailableTopicsResultsQueryData = TGetResultsIniniteQueryData<TAvailableTopic>;

// Available question queries

export type TAvailableQuestionsResultsQueryData = TGetResultsIniniteQueryData<TAvailableQuestion>;
