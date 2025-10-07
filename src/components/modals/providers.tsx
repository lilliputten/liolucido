'use client';

import React from 'react';

import { useSignInModal } from '@/components/modals/SignInModal';

export const ModalContext = React.createContext<{
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isVisible: boolean;
}>({
  setVisible: () => {},
  isVisible: false,
});

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const { isVisible, SignInModal, setVisible } = useSignInModal();

  return (
    <ModalContext.Provider
      value={{
        isVisible,
        setVisible,
      }}
    >
      <SignInModal />
      {children}
    </ModalContext.Provider>
  );
}
