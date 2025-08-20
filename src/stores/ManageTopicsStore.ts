import { createStore } from 'zustand/vanilla';

import {
  defaultTopicsManageScope,
  TopicsManageScopeIds,
  TTopicsManageScopeId,
} from '@/contexts/TopicsContext/TopicsContextDefinitions';

export type ManageTopicsState = {
  // count: number;
  /** Topics type: only user's topics or all topics (for admin) */
  manageScope: TTopicsManageScopeId;
};

export type ManageTopicsActions = {
  // decrementCount: () => void;
  // incrementCount: () => void;
  setManageScope: (scope: TTopicsManageScopeId) => void;
};

export type ManageTopicsStore = ManageTopicsState & ManageTopicsActions;

export const defaultManageTopicsState: ManageTopicsState = {
  // count: 0,
  manageScope: TopicsManageScopeIds.AVAILABLE_TOPICS, // defaultTopicsManageScope,
};

export const createManageTopicsStore = (
  initState: ManageTopicsState = defaultManageTopicsState,
) => {
  return createStore<ManageTopicsStore>()((set) => ({
    ...initState,
    // decrementCount: () => set((state) => ({ count: state.count - 1 })),
    // incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setManageScope: (scope: TTopicsManageScopeId) => set((_state) => ({ manageScope: scope })),
  }));
};
