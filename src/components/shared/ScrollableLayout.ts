'use client';

import React from 'react';

export type TLayoutType = 'scrollable' | 'clippable';
const defaultType: TLayoutType = 'scrollable';

export function useScrollableLayout(type: TLayoutType = defaultType) {
  React.useEffect(() => {
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      const node = window.document.body;
      const { dataset } = node;
      const prevLayout = dataset.layout;
      if (prevLayout === type) {
        return;
      }
      dataset.layout = type;
      return () => {
        dataset.layout = prevLayout;
      };
    }
  }, [type]);
}

export function UseScrollableLayout({ type = defaultType }: { type?: TLayoutType }) {
  useScrollableLayout(type);
  return null;
}
