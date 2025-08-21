import { createStore } from 'zustand/vanilla';

import {
  defaultTopicsManageScope,
  TTopicsManageScopeId,
} from '@/contexts/TopicsContext/TopicsContextDefinitions';

export type ManageTopicsState = {
  /** Topics type: only user's topics or all topics (for admin) */
  manageScope: TTopicsManageScopeId;
};

export type ManageTopicsActions = {
  setManageScope: (scope: TTopicsManageScopeId) => void;
};

export type ManageTopicsStore = ManageTopicsState & ManageTopicsActions;

export const defaultManageTopicsState: ManageTopicsState = {
  manageScope: defaultTopicsManageScope, // TopicsManageScopeIds.AVAILABLE_TOPICS,
};

export const createManageTopicsStore = (
  initState: ManageTopicsState = defaultManageTopicsState,
) => {
  return createStore<ManageTopicsStore>()((set) => ({
    ...initState,
    setManageScope: (scope: TTopicsManageScopeId) => set((_state) => ({ manageScope: scope })),
  }));
};
