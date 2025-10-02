'use client';

import React from 'react';

import { Icons } from '@/components/shared/Icons';

export function MarkdownHint() {
  return (
    <>
      This text allows markdown markup, look at the{' '}
      <a
        href="https://www.markdownguide.org/basic-syntax/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 underline hover:no-underline"
      >
        Markdown Guide
        <Icons.ExternalLink className="size-3" />
      </a>{' '}
      for the syntax info.
    </>
  );
}
