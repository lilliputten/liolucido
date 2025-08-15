import React from 'react';

interface FormHintProps {
  children?: React.ReactNode;
}

export function FormHint({ children }: FormHintProps) {
  if (!children) {
    return null;
  }
  return <div className="relative text-sm opacity-50">{children}</div>;
}
