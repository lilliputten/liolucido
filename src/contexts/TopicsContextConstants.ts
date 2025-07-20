import { allTopicsRoute, myTopicsRoute, TRoutePath } from '@/config/routesConfig';
import { TTopic } from '@/features/topics/types';

export const defaultTopicsNamespace = 'ManageTopicsPage';

export const TopicsManageTypes = {
  MY_TOPICS: 'MY_TOPICS',
  ALL_TOPICS: 'ALL_TOPICS',
} as const;

export type TTopicsManageType = keyof typeof TopicsManageTypes; // 'MY_TOPICS' | 'ALL_TOPICS';
export const defaultTopicsManageType: TTopicsManageType = TopicsManageTypes.MY_TOPICS;

export const topicsRoutes: Record<TTopicsManageType, TRoutePath> = {
  MY_TOPICS: myTopicsRoute,
  ALL_TOPICS: allTopicsRoute,
};

export interface TopicsContextData {
  topics: TTopic[];
  setTopics: React.Dispatch<React.SetStateAction<TTopic[]>>;
  /** Topics type: only user's topics or all topics (for admin) */
  manageType: TTopicsManageType;
  /** Route for this topics manage context (depends on `manageType`) */
  routePath: TRoutePath;
  /** Translation namespace, for `useTranslations` or `getTranslations`, default is "ManageTopicsPage" */
  namespace: string;
}
