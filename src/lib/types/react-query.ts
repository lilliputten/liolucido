import { QueryKey, useQueryClient } from '@tanstack/react-query';

import { TAvailableAnswer } from '@/features/answers/types';
import { TAvailableQuestion } from '@/features/questions/types';
import { TAvailableTopic } from '@/features/topics/types';

import { TGetResultsInfiniteQueryData } from './api';

export type TAllUsedKeys = Record<string, QueryKey>;
export type TQueryClient = ReturnType<typeof useQueryClient>;

// Available topic queries results data

export type TAvailableTopicsResultsQueryData = TGetResultsInfiniteQueryData<TAvailableTopic>;

// Available question queries results data

export type TAvailableQuestionsResultsQueryData = TGetResultsInfiniteQueryData<TAvailableQuestion>;

// Available question queries results data

export type TAvailableAnswersResultsQueryData = TGetResultsInfiniteQueryData<TAvailableAnswer>;
