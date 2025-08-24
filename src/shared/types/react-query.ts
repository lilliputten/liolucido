import { QueryKey, useQueryClient } from '@tanstack/react-query';

import { TAvailableAnswer } from '@/features/answers/types';
import { TAvailableQuestion } from '@/features/questions/types';
import { TAvailableTopic } from '@/features/topics/types';

import { TGetResultsIniniteQueryData } from './generic/api';

export type TAllUsedKeys = Record<string, QueryKey>;
export type TQueryClient = ReturnType<typeof useQueryClient>;

// Available topic queries results data

export type TAvailableTopicsResultsQueryData = TGetResultsIniniteQueryData<TAvailableTopic>;

// Available question queries results data

export type TAvailableQuestionsResultsQueryData = TGetResultsIniniteQueryData<TAvailableQuestion>;

// Available question queries results data

export type TAvailableAnswersResultsQueryData = TGetResultsIniniteQueryData<TAvailableAnswer>;
