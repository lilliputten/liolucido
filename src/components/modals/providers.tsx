'use client';

import React from 'react';

import { useSignInModal } from '@/components/modals/SignInModal';

export const ModalContext = React.createContext<{
  setShowSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSignInModal: boolean;
}>({
  setShowSignInModal: () => {},
  showSignInModal: false,
});

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const { showSignInModal, SignInModal, setShowSignInModal } = useSignInModal();

  return (
    <ModalContext.Provider
      value={{
        showSignInModal,
        setShowSignInModal,
      }}
    >
      <SignInModal />
      {children}
    </ModalContext.Provider>
  );
}
