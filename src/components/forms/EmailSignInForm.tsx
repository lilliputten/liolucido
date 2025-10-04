'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { TPropsWithClassName } from '@/shared/types/generic';
import { startRoute } from '@/config/routesConfig';
import { getErrorText } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Spinner } from '@/components/shared/Icons';
import { isDev } from '@/config';
import { getAllAllowedEmails } from '@/features/allowed-users/actions/getAllAllowedEmails';

export const emailSignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type TEmailSignInData = z.infer<typeof emailSignInSchema>;

export type TEmailSignInFormType = ReturnType<typeof useForm<TEmailSignInData>>;

export const defaultValues: TEmailSignInData = {
  email: isDev ? 'lilliputten@yandex.ru' : '',
};

export function EmailSignInForm({ className }: { inBody?: boolean } & TPropsWithClassName) {
  const [isStarting, startStarting] = React.useTransition();
  const [isSubmitting, startSubmitting] = React.useTransition();
  const [message, setMessage] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const [validEmails, setValidEmails] = React.useState<string[] | undefined>();

  // Efect: Initialize
  React.useEffect(() => {
    startStarting(async () => {
      try {
        const validEmails = await getAllAllowedEmails();
        setValidEmails(validEmails);
      } catch (error) {
        const errMsg = ['Cannot get valid emails list', getErrorText(error)]
          .filter(Boolean)
          .join(': ');
        // eslint-disable-next-line no-console
        console.error('[EmailSignInForm:Effect]', errMsg, { error });
        debugger; // eslint-disable-line no-debugger
        setError(errMsg);
        // setMessage(errMsg);
        toast.error(errMsg);
      }
    });
  }, []);

  const form = useForm<TEmailSignInData>({
    mode: 'onChange',
    resolver: zodResolver(emailSignInSchema),
    defaultValues,
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isValid, isReady } = formState;

  const isAllReady = !!validEmails && isReady;
  const isSumbitAvailable = isAllReady && isValid && !isSubmitting && !isStarting;
  const SubmitIcon = isSubmitting ? Spinner : ArrowRight;

  const onSubmit = handleSubmit((data) => {
    const { email } = data;
    if (!validEmails?.includes(email)) {
      const errMsg =
        'This email is not allowed to be authorized on this site. Reach the administrator to be included in the white list.';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }
    setError('');
    setMessage('');
    startSubmitting(async () => {
      try {
        const result = await signIn('nodemailer', {
          email,
          redirect: false,
          callbackUrl: startRoute,
        });

        if (!result || result?.error) {
          throw result?.error;
        }

        const msg = 'A login message has been sent. Check your email for a sign-in link.';
        setMessage(msg);
        toast.success(msg);
      } catch (error) {
        const errMsg = ['An error occurred, please try again', getErrorText(error)]
          .filter(Boolean)
          .join(': ');
        // eslint-disable-next-line no-console
        console.error('[EmailSignInForm:onSubmit]', errMsg, {
          email,
          error,
        });
        debugger; // eslint-disable-line no-debugger
        setError(errMsg);
        toast.error(errMsg);
      }
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        isDev && '__EmailSignInForm', // DEBUG
        'flex flex-col gap-3',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="block text-center text-sm font-medium">
          Or use e-mail:
        </label>
        <div className="flex">
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="Enter your email"
            className={cn(
              isDev && '__EmailSignInForm_Input', // DEBUG
              'w-full rounded border px-5 py-2 transition focus:outline-none focus:ring-2',
              'rounded-full rounded-e-none',
              'bg-background text-foreground',
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-500/20 focus:ring-theme-500',
            )}
          />
          <Button
            type="submit"
            disabled={!isSumbitAvailable}
            variant="theme"
            rounded="full"
            className={cn(
              isDev && '__EmailSignInForm_Button', // DEBUG
              'rounded-s-none',
              'flex gap-2',
            )}
          >
            <SubmitIcon className={cn('size-4', isSubmitting && 'animate-spin')} />
            {/*
            <span>Sign in with Email</span>
            */}
          </Button>
        </div>
        {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
      </div>

      {message && !error && <p className={cn('text-center text-sm text-green-500')}>{message}</p>}
      {error && <p className={cn('text-center text-sm text-red-500')}>{error}</p>}
    </form>
  );
}
