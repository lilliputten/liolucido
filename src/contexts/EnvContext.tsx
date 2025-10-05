'use client';

import React from 'react';

interface EnvContextType {
  BOT_USERNAME: string;
}

const EnvContext = React.createContext<EnvContextType | undefined>(undefined);

export function EnvProvider({
  children,
  BOT_USERNAME,
}: {
  children: React.ReactNode;
  BOT_USERNAME: string;
}) {
  return <EnvContext.Provider value={{ BOT_USERNAME }}>{children}</EnvContext.Provider>;
}

export function useEnv() {
  const context = React.useContext(EnvContext);
  if (!context) {
    throw new Error('useEnv must be used within an EnvProvider');
  }
  return context;
}
