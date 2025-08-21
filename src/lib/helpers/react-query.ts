import { QueryKey } from '@tanstack/react-query';

export function stringifyQueryKey(qk: QueryKey) {
  // return JSON.stringify(qk);
  return String(qk);
}
