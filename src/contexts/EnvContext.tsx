'use client';

import React from 'react';

interface EnvContextType {
  botUsername: string;
}

const EnvContext = React.createContext<EnvContextType | undefined>(undefined);

export function EnvProvider({
  children,
  botUsername,
}: {
  children: React.ReactNode;
  botUsername: string;
}) {
  return <EnvContext.Provider value={{ botUsername }}>{children}</EnvContext.Provider>;
}

export function useEnv() {
  const context = React.useContext(EnvContext);
  if (!context) {
    throw new Error('useEnv must be used within an EnvProvider');
  }
  return context;
}
