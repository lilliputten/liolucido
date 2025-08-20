'use client';

import { createContext, ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { createManageTopicsStore, ManageTopicsState, ManageTopicsStore } from './ManageTopicsStore';

export type ManageTopicsStoreApi = ReturnType<typeof createManageTopicsStore>;

export const ManageTopicsContext = createContext<ManageTopicsStoreApi | undefined>(undefined);

export interface ManageTopicsProviderProps extends ManageTopicsState {
  children: ReactNode;
}

// initState: ManageTopicsState = defaultManageTopicsState,
export const ManageTopicsStoreProvider = (props: ManageTopicsProviderProps) => {
  const { children, ...initState } = props;
  const storeRef = useRef<ManageTopicsStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createManageTopicsStore(initState);
  }
  return (
    <ManageTopicsContext.Provider value={storeRef.current}>{children}</ManageTopicsContext.Provider>
  );
};

export const useManageTopicsStoreSelector = <T,>(selector: (store: ManageTopicsStore) => T): T => {
  const counterStoreContext = useContext(ManageTopicsContext);
  if (!counterStoreContext) {
    throw new Error(`useManageTopicsStoreSelector must be used within ManageTopicsStoreProvider`);
  }
  return useStore(counterStoreContext, selector);
};

export const useManageTopicsStore = () => useManageTopicsStoreSelector((state) => state);

export const useManageTopicsStoreManageScope = () =>
  useManageTopicsStoreSelector((state) => state.manageScope);
