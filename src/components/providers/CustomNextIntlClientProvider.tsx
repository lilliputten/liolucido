'use client';

import React from 'react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

import { getIntlMessageFallback, onIntlError } from '@/i18n';

interface TProps {
  children: React.ReactNode;
  messages?: AbstractIntlMessages;
  locale?: string;
}

export function CustomNextIntlClientProvider({ children, messages, locale }: TProps) {
  const [timeZone, setTimeZone] = React.useState('UTC');
  React.useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(timeZone);
  }, []);

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      onError={onIntlError}
      getMessageFallback={getIntlMessageFallback}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
