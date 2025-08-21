import {
  allTopicsRoute,
  availableTopicsRoute,
  myTopicsRoute,
  TRoutePath,
} from '@/config/routesConfig';

export const TopicsManageScopeIds = {
  AVAILABLE_TOPICS: 'available',
  MY_TOPICS: 'my',
  ALL_TOPICS: 'all',
} as const;
export type TTopicsManageScopeId = (typeof TopicsManageScopeIds)[keyof typeof TopicsManageScopeIds];
export const defaultTopicsManageScope: TTopicsManageScopeId = TopicsManageScopeIds.MY_TOPICS;

export const topicsRoutes: Record<TTopicsManageScopeId, TRoutePath> = {
  [TopicsManageScopeIds.AVAILABLE_TOPICS]: availableTopicsRoute,
  [TopicsManageScopeIds.MY_TOPICS]: myTopicsRoute,
  [TopicsManageScopeIds.ALL_TOPICS]: allTopicsRoute,
};

export const topicsNamespaces: Record<TTopicsManageScopeId, string> = {
  [TopicsManageScopeIds.AVAILABLE_TOPICS]: 'AvailableTopicsPage',
  [TopicsManageScopeIds.MY_TOPICS]: 'MyTopicsPage',
  [TopicsManageScopeIds.ALL_TOPICS]: 'AllTopicsPage',
};
export const defaultTopicsNamespace = topicsNamespaces[TopicsManageScopeIds.MY_TOPICS];
