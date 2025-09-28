import { InfiniteData } from '@tanstack/react-query';

export interface TGetResults<T> {
  items: T[];
  totalCount: number;
}

export type TGetResultsInfiniteQueryData<T> = InfiniteData<TGetResults<T>, unknown>;
