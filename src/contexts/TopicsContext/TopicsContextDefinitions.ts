import {
  allTopicsRoute,
  availableTopicsRoute,
  myTopicsRoute,
  TRoutePath,
} from '@/config/routesConfig';
import { TTopic } from '@/features/topics/types';

export const TopicsManageScopeIds = {
  AVAILABLE_TOPICS: 'available',
  MY_TOPICS: 'my',
  ALL_TOPICS: 'all',
} as const;
export type TTopicsManageScopeId = (typeof TopicsManageScopeIds)[keyof typeof TopicsManageScopeIds]; // 'MY_TOPICS' | 'ALL_TOPICS';
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

export interface TopicsContextData {
  topics: TTopic[];
  setTopics: React.Dispatch<React.SetStateAction<TTopic[]>>;
  /** Topics type: only user's topics or all topics (for admin) */
  manageScope: TTopicsManageScopeId;
  /** Route for this topics manage context root (depends on `manageScope`) -- the topics list page */
  routePath: TRoutePath;
  /** Translation namespace, for `useTranslations` or `getTranslations`, default is "ManageTopicsPage" */
  namespace: string;
}
