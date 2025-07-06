import React from 'react';

import { pathnames } from '@/constants/routes';

jest.mock('next-intl', () => ({
  useLocale() {
    return 'en';
  },
}));

interface TLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  [key: string]: unknown;
}

jest.mock('@/i18n/routing', () => ({
  Link: (props: TLinkProps) => {
    const { children, href, className, ...restProps } = props;
    return React.createElement('a', { href, className, ...restProps }, children);
  },
  pathnames,
}));
