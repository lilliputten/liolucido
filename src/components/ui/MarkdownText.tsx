'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';
import * as Icons from '@/components/shared/Icons';

interface MarkdownProps {
  children: string;
  className?: string;
  omitLinks?: boolean;
}

export function MarkdownText({ children, className, omitLinks }: MarkdownProps) {
  // @see https://github.com/remarkjs/react-markdown
  return (
    <div
      className={cn(
        'MarkdownText',
        'prose prose-sm max-w-none',
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-p:leading-relaxed prose-p:text-foreground',
        'prose-a:text-theme prose-a:no-underline hover:prose-a:underline',
        'prose-strong:font-semibold prose-strong:text-foreground',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground',
        'prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted',
        'prose-blockquote:border-l-theme prose-blockquote:text-muted-foreground',
        'prose-ol:text-foreground prose-ul:text-foreground',
        'prose-li:text-foreground',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize link behavior
          a: ({ href, children, ...props }) => {
            if (omitLinks) {
              return children;
            }
            const isHttp = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isHttp ? '_blank' : undefined}
                rel={isHttp ? 'noopener noreferrer' : undefined}
                {...props}
                className="inline-flex items-center gap-1"
              >
                {children}
                {isHttp && <Icons.ExternalLink className="opcaity-50 size-3" />}
              </a>
            );
          },
          /* // UNUSED: code
           * code: (props) => {
           *   const { children, ...rest } = props;
           *   console.log('[MarkdownText:DEBUG] props', { props });
           *   return (
           *     <code className="rounded bg-muted px-1 py-0.5 text-sm" {...rest}>
           *       {children}
           *     </code>
           *   );
           * },
           */
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
